/**
 * DatabaseService.js - Subsystem 1: Database Persistence
 * 
 * Subsystem responsible for plain MongoDB connection and CRUD operations for users.
 * Does NOT depend on or import any other subsystem.
 */

const { MongoClient } = require('mongodb');

class DatabaseService {
  constructor(uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017', dbName = 'lab3_facade_db') {
    this.uri = uri;
    this.dbName = dbName;
    this.client = null;
    this.db = null;
  }

  /**
   * Connects to the MongoDB server if not already connected.
   */
  async connect() {
    if (!this.client) {
      this.client = new MongoClient(this.uri);
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log(`[DatabaseService] Connected to MongoDB database: ${this.dbName}`);
    }
    return this.db;
  }

  /**
   * Inserts a new user record into the 'users' collection.
   * @param {Object} userData - User record containing email, password hash, etc.
   * @returns {Promise<Object>} The created user record including the MongoDB insertedId.
   */
  async saveUser(userData) {
    console.log(`[DatabaseService] Persisting user record for: ${userData.email}`);
    
    // In environments without a live MongoDB instance, provide mock persistence fallback for demo reliability
    try {
      const db = await this.connect();
      const usersCollection = db.collection('users');
      
      const record = {
        ...userData,
        createdAt: new Date()
      };

      const result = await usersCollection.insertOne(record);
      return {
        id: result.insertedId.toString(),
        email: record.email,
        createdAt: record.createdAt
      };
    } catch (dbError) {
      console.warn(`[DatabaseService] MongoDB live connection unavailable (${dbError.message}). Using simulated persistent record.`);
      // Simulated insert return for offline demonstration
      return {
        id: 'mock_usr_' + Date.now().toString(36),
        email: userData.email,
        createdAt: new Date(),
        _offlineSimulated: true
      };
    }
  }

  /**
   * Closes database connection gracefully.
   */
  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('[DatabaseService] Database connection closed.');
    }
  }
}

module.exports = DatabaseService;
