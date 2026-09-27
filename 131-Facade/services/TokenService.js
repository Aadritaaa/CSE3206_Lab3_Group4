/**
 * TokenService.js - Subsystem 3: Token Generation & Authentication
 * 
 * Subsystem responsible for issuing signed JSON Web Tokens (JWT).
 * Does NOT depend on or import any other subsystem.
 */

const jwt = require('jsonwebtoken');

class TokenService {
  constructor(secret = process.env.JWT_SECRET || 'cse3206_lab3_facade_jwt_secret_key') {
    this.secret = secret;
    this.defaultExpiresIn = '2h';
  }

  /**
   * Generates a signed JWT for a user payload.
   * @param {Object} payload - Data to embed in the token (e.g., userId, email).
   * @param {string|number} expiresIn - Expiration duration (defaults to '2h').
   * @returns {string} The signed JWT string.
   */
  generateToken(payload, expiresIn = this.defaultExpiresIn) {
    if (!payload) {
      throw new Error('TokenService: payload is required to generate token');
    }
    console.log(`[TokenService] Issuing signed JWT for payload:`, payload);
    const token = jwt.sign(payload, this.secret, { expiresIn });
    console.log('[TokenService] JWT issued successfully.');
    return token;
  }

  /**
   * Verifies and decodes a signed JWT.
   * @param {string} token - The signed JWT string.
   * @returns {Object} Decoded token payload.
   */
  verifyToken(token) {
    return jwt.verify(token, this.secret);
  }
}

module.exports = TokenService;
