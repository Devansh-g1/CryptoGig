// Arbitrator access configuration
export const ARBITRATOR_EMAIL = 'devanshgoyal1234@gmail.com';
export const ARBITRATOR_WALLET = '0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483';

/**
 * Check if user has arbitrator access
 * @param {Object} user - User object with email and wallet_address
 * @returns {boolean} - True if user has arbitrator access
 */
export const isArbitrator = (user) => {
  if (!user) return false;
  
  const hasArbitratorEmail = user.email === ARBITRATOR_EMAIL;
  const hasArbitratorWallet = user.wallet_address?.toLowerCase() === ARBITRATOR_WALLET.toLowerCase();
  
  return hasArbitratorEmail || hasArbitratorWallet;
};

/**
 * Get arbitrator access method
 * @param {Object} user - User object
 * @returns {string} - Access method ('email', 'wallet', or 'none')
 */
export const getArbitratorAccessMethod = (user) => {
  if (!user) return 'none';
  
  if (user.email === ARBITRATOR_EMAIL) return 'email';
  if (user.wallet_address?.toLowerCase() === ARBITRATOR_WALLET.toLowerCase()) return 'wallet';
  
  return 'none';
};