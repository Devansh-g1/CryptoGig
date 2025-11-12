// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CryptoGigEscrow
 * @dev Handles escrow payments between clients, freelancers, and arbitrator
 * Flow: Client deposits USDC → Arbitrator holds → Release to freelancer on completion
 */
contract CryptoGigEscrow is ReentrancyGuard, Ownable {
    IERC20 public usdc;
    address public arbitrator;
    
    // Fee percentages (in basis points: 500 = 5%)
    uint256 public constant NORMAL_FEE = 500; // 5%
    uint256 public constant DISPUTE_FEE = 800; // 8%
    
    enum JobStatus { Created, Funded, InProgress, Completed, Disputed, Resolved, Cancelled }
    
    struct Job {
        uint256 jobId;
        address client;
        address freelancer;
        uint256 amount;
        uint256 depositedAmount;
        JobStatus status;
        bool disputeRaised;
        uint256 createdAt;
        uint256 completedAt;
    }
    
    mapping(uint256 => Job) public jobs;
    
    event JobFunded(uint256 indexed jobId, address indexed client, uint256 amount);
    event JobAssigned(uint256 indexed jobId, address indexed freelancer);
    event PaymentReleased(uint256 indexed jobId, address indexed freelancer, uint256 amount, uint256 fee);
    event DisputeResolved(uint256 indexed jobId, uint256 clientAmount, uint256 freelancerAmount);
    
    modifier onlyArbitrator() {
        require(msg.sender == arbitrator, "Only arbitrator");
        _;
    }
    
    constructor(address _usdcAddress, address _arbitrator) Ownable(msg.sender) {
        require(_usdcAddress != address(0), "Invalid USDC");
        require(_arbitrator != address(0), "Invalid arbitrator");
        usdc = IERC20(_usdcAddress);
        arbitrator = _arbitrator;
    }
    
    // Function to check if address is arbitrator (for frontend verification)
    function isArbitrator(address _address) external view returns (bool) {
        return _address == arbitrator;
    }
    
    function fundJob(uint256 _jobId, uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(jobs[_jobId].client == address(0), "Job already funded");
        require(usdc.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        jobs[_jobId] = Job({
            jobId: _jobId,
            client: msg.sender,
            freelancer: address(0),
            amount: _amount,
            depositedAmount: _amount,
            status: JobStatus.Funded,
            disputeRaised: false,
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        emit JobFunded(_jobId, msg.sender, _amount);
    }
    
    function assignFreelancer(uint256 _jobId, address _freelancer) external {
        Job storage job = jobs[_jobId];
        require(job.client == msg.sender, "Only client can assign");
        require(job.status == JobStatus.Funded, "Job not funded");
        require(_freelancer != address(0), "Invalid freelancer");
        
        job.freelancer = _freelancer;
        job.status = JobStatus.InProgress;
        
        emit JobAssigned(_jobId, _freelancer);
    }
    
    function completeJob(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(job.freelancer == msg.sender, "Only assigned freelancer");
        require(job.status == JobStatus.InProgress, "Job not in progress");
        
        job.status = JobStatus.Completed;
        job.completedAt = block.timestamp;
    }
    
    function releasePayment(uint256 _jobId) external onlyArbitrator nonReentrant {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.InProgress || job.status == JobStatus.Completed, "Invalid status");
        require(job.freelancer != address(0), "No freelancer assigned");
        
        uint256 feeRate = job.disputeRaised ? DISPUTE_FEE : NORMAL_FEE;
        uint256 arbitratorFee = (job.depositedAmount * feeRate) / 10000;
        uint256 freelancerAmount = job.depositedAmount - arbitratorFee;
        
        job.status = JobStatus.Resolved;
        job.completedAt = block.timestamp;
        
        require(usdc.transfer(arbitrator, arbitratorFee), "Fee transfer failed");
        require(usdc.transfer(job.freelancer, freelancerAmount), "Payment transfer failed");
        
        emit PaymentReleased(_jobId, job.freelancer, freelancerAmount, arbitratorFee);
    }
    
    function raiseDispute(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client || msg.sender == job.freelancer, "Not authorized");
        require(job.status == JobStatus.InProgress || job.status == JobStatus.Completed, "Invalid status");
        require(!job.disputeRaised, "Dispute already raised");
        
        job.disputeRaised = true;
        job.status = JobStatus.Disputed;
    }
    
    function resolveDispute(uint256 _jobId, uint256 _clientPercentage, uint256 _freelancerPercentage) external onlyArbitrator nonReentrant {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Disputed, "Not disputed");
        require(_clientPercentage + _freelancerPercentage == 100, "Percentages must sum to 100");
        
        uint256 arbitratorFee = (job.depositedAmount * DISPUTE_FEE) / 10000;
        uint256 remainingAmount = job.depositedAmount - arbitratorFee;
        
        uint256 clientAmount = (remainingAmount * _clientPercentage) / 100;
        uint256 freelancerAmount = (remainingAmount * _freelancerPercentage) / 100;
        
        job.status = JobStatus.Resolved;
        job.completedAt = block.timestamp;
        
        require(usdc.transfer(arbitrator, arbitratorFee), "Fee transfer failed");
        
        if (clientAmount > 0) {
            require(usdc.transfer(job.client, clientAmount), "Client refund failed");
        }
        
        if (freelancerAmount > 0) {
            require(usdc.transfer(job.freelancer, freelancerAmount), "Freelancer payment failed");
        }
        
        emit DisputeResolved(_jobId, clientAmount, freelancerAmount);
    }
}
