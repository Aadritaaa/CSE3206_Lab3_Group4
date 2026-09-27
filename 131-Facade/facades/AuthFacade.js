/**
 * AuthFacade.js - The Façade Design Pattern Implementation
 * 
 * Aggregates and orchestrates the complex subsystem interactions required for user registration:
 * 1. SecurityService      -> Hash raw password
 * 2. DatabaseService      -> Persist user record to database
 * 3. TokenService         -> Issue signed JWT token
 * 4. NotificationService  -> Send welcome email via Nodemailer/Ethereal
 * 
 * Exposes a clean, unified, and simplified API to client callers (e.g. Express routes).
 */

const DatabaseService = require('../services/DatabaseService');
const SecurityService = require('../services/SecurityService');
const TokenService = require('../services/TokenService');
const NotificationService = require('../services/NotificationService');

class AuthFacade {
  /**
   * Initializes the Façade by establishing composition handles to all subsystem services.
   * Supports dependency injection for enhanced testability.
   */
  constructor(
    securityService = new SecurityService(),
    databaseService = new DatabaseService(),
    tokenService = new TokenService(),
    notificationService = new NotificationService()
  ) {
    this.securityService = securityService;
    this.databaseService = databaseService;
    this.tokenService = tokenService;
    this.notificationService = notificationService;
  }

  /**
   * Unified registration method that coordinates the multi-step registration workflow.
   * 
   * @param {string} email - The user's email address
   * @param {string} rawPassword - The user's plain-text password
   * @param {string} [userName] - Optional display name
   * @returns {Promise<Object>} Structured registration response
   */
  async registerUser(email, rawPassword, userName) {
    console.log('\n======================================================');
    console.log(`[AuthFacade] Starting registration pipeline for: ${email}`);
    console.log('======================================================');

    // 1. Basic validation
    if (!email || !rawPassword) {
      throw new Error('Both email and password are required for registration.');
    }

    try {
      // Step A: Hash password via SecurityService
      console.log('[AuthFacade -> Step 1/4] Delegating password hashing to SecurityService...');
      const hashedPassword = await this.securityService.hashPassword(rawPassword);

      // Step B: Persist user record via DatabaseService
      console.log('[AuthFacade -> Step 2/4] Delegating record persistence to DatabaseService...');
      const savedUser = await this.databaseService.saveUser({
        email,
        password: hashedPassword
      });

      // Step C: Generate JWT authentication token via TokenService
      console.log('[AuthFacade -> Step 3/4] Delegating token generation to TokenService...');
      const token = this.tokenService.generateToken({
        userId: savedUser.id,
        email: savedUser.email
      });

      // Step D: Dispatch welcome email via NotificationService
      console.log('[AuthFacade -> Step 4/4] Delegating email notification to NotificationService...');
      const displayName = userName || email.split('@')[0];
      const emailResult = await this.notificationService.sendWelcomeEmail(email, displayName);

      console.log('======================================================');
      console.log(`[AuthFacade] Workflow completed successfully for: ${email}`);
      console.log('======================================================\n');

      // Return unified, structured response to the caller
      return {
        success: true,
        message: 'User registered successfully through AuthFacade orchestration.',
        data: {
          userId: savedUser.id,
          email: savedUser.email,
          token,
          emailDelivery: {
            messageId: emailResult.messageId,
            previewUrl: emailResult.previewUrl
          }
        }
      };
    } catch (error) {
      console.error(`[AuthFacade ERROR] Registration workflow failed: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AuthFacade;
