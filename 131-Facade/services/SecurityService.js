/**
 * SecurityService.js - Subsystem 2: Password Hashing & Security
 * 
 * Subsystem responsible for cryptographic operations (Bcrypt hashing & verification).
 * Does NOT depend on or import any other subsystem.
 */

const bcrypt = require('bcrypt');

class SecurityService {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  /**
   * Hashes a plain-text password using bcrypt.
   * @param {string} rawPassword - The plain text password.
   * @returns {Promise<string>} The resulting bcrypt hash string.
   */
  async hashPassword(rawPassword) {
    if (!rawPassword) {
      throw new Error('SecurityService: rawPassword is required for hashing');
    }
    console.log('[SecurityService] Generating bcrypt salt and hashing raw password...');
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hash = await bcrypt.hash(rawPassword, salt);
    console.log('[SecurityService] Password hashed successfully.');
    return hash;
  }

  /**
   * Verifies a plain-text password against a hashed password.
   * @param {string} rawPassword - Plain text candidate password.
   * @param {string} hashedPassword - Stored hash.
   * @returns {Promise<boolean>} True if matching, false otherwise.
   */
  async comparePassword(rawPassword, hashedPassword) {
    return await bcrypt.compare(rawPassword, hashedPassword);
  }
}

module.exports = SecurityService;
