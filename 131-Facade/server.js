/**
 * server.js - Entry point for User Registration Workflow (Façade Pattern)
 * 
 * Course: CSE 3206 - Software Engineering Sessional
 * Lab 3: Design Pattern Analysis, Implementation and Code Review
 * Group: 4 | Pattern: Façade Pattern (Teammate 131)
 */

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON request bodies
app.use(express.json());

// ── Root / Health Check Route ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'CSE 3206 Lab 3 - Façade Pattern Demonstration Server',
    author: 'Teammate 131 (Group 4)',
    endpoints: {
      facadeRegistration: 'POST /api/register',
      independentSubsystemEmail: 'POST /api/test-email'
    }
  });
});

// ── Placeholder Routes (To be integrated in Step 4) ─────────────────────────

// Façade Route: High-level simplified interface for registration
app.post('/api/register', (req, res) => {
  res.status(501).json({
    message: 'POST /api/register placeholder - Façade integration pending (Step 3 & 4)'
  });
});

// Subsystem Direct Route: Demonstrating subsystem independence
app.post('/api/test-email', (req, res) => {
  res.status(501).json({
    message: 'POST /api/test-email placeholder - Direct subsystem integration pending (Step 4)'
  });
});

// ── Server Listener ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Façade Demo Server listening on http://localhost:${PORT}`);
  console.log(`====================================================`);
});
