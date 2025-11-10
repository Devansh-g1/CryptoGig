const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create self-signed certificate for local HTTPS
const createCertificate = () => {
  const certDir = path.join(__dirname, 'certs');
  
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir);
  }
  
  const keyPath = path.join(certDir, 'key.pem');
  const certPath = path.join(certDir, 'cert.pem');
  
  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.log('🔐 Creating self-signed certificate for HTTPS...');
    
    try {
      // Create self-signed certificate
      execSync(`openssl req -x509 -newkey rsa:4096 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"`, {
        stdio: 'inherit'
      });
      
      console.log('✅ Certificate created successfully!');
    } catch (error) {
      console.log('❌ Failed to create certificate. Using HTTP instead.');
      return null;
    }
  }
  
  return { keyPath, certPath };
};

// Set environment variables for HTTPS
const cert = createCertificate();

if (cert) {
  process.env.HTTPS = 'true';
  process.env.SSL_CRT_FILE = cert.certPath;
  process.env.SSL_KEY_FILE = cert.keyPath;
  console.log('🚀 Starting with HTTPS support...');
} else {
  console.log('🚀 Starting with HTTP (wallet connection may be limited)...');
}

// Start the development server
require('@craco/craco/scripts/start');