#!/usr/bin/env node

/**
 * Generate a secure JWT secret key
 */

const crypto = require('crypto');

console.log('\n' + '='.repeat(60));
console.log('JWT SECRET KEY GENERATOR');
console.log('='.repeat(60) + '\n');

// Generate a random 64-byte (512-bit) secret
const secret = crypto.randomBytes(64).toString('hex');

console.log('Your JWT Secret Key:');
console.log('-'.repeat(60));
console.log(secret);
console.log('-'.repeat(60));

console.log('\n📋 Copy this key and add it to Railway:');
console.log('   Variable Name: JWT_SECRET');
console.log('   Variable Value: ' + secret);

console.log('\n✅ This key is cryptographically secure and unique');
console.log('⚠️  Keep this secret safe - never commit it to git!\n');

// Also generate a shorter version if needed
const shortSecret = crypto.randomBytes(32).toString('hex');
console.log('Alternative (shorter 256-bit key):');
console.log(shortSecret);
console.log('\n');
