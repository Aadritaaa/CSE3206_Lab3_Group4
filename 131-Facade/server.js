/**
 * server.js - Express Application (Client Code)
 * 
 * Course: CSE 3206 - Software Engineering Sessional
 * Lab 3: Design Pattern Analysis, Implementation and Code Review
 * Group: 4 | Pattern: Façade Pattern (Teammate 131)
 * 
 * Demonstrates:
 * 1. Façade Integration (POST /api/register): High-level, decoupled client route.
 * 2. Subsystem Independence (POST /api/test-email): Direct subsystem access bypassing the Façade.
 */

const express = require('express');
const AuthFacade = require('./facades/AuthFacade');
const NotificationService = require('./services/NotificationService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// ── Root Route: Documentation & Visual Status ──────────────────────────────
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Façade Pattern Demo · CSE 3206 Group 4</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 850px; margin: 40px auto; padding: 0 20px; line-height: 1.6; background: #0f172a; color: #e2e8f0; }
        h1 { color: #818cf8; border-bottom: 2px solid #334155; padding-bottom: 12px; }
        .card { background: #1e293b; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #334155; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; background: #3b82f6; color: white; }
        .badge-green { background: #10b981; }
        pre { background: #090d16; padding: 12px; border-radius: 6px; overflow-x: auto; color: #38bdf8; }
        button { background: #6366f1; color: white; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-size: 14px; }
        button:hover { background: #4f46e5; }
        input { background: #0f172a; border: 1px solid #475569; color: white; padding: 8px 12px; border-radius: 4px; margin-right: 8px; }
      </style>
    </head>
    <body>
      <h1>🏛️ Façade Pattern Demonstration Server</h1>
      <p><strong>Course:</strong> CSE 3206 Software Engineering Sessional | <strong>Group:</strong> 4 (Teammate 131)</p>
      
      <div class="card">
        <h3><span class="badge">Façade Route</span> POST /api/register</h3>
        <p>Demonstrates how the client code interacts <strong>exclusively with the Façade</strong> without knowing anything about Bcrypt, MongoDB, JWT, or Nodemailer internals.</p>
        <div>
          <input type="email" id="regEmail" value="student@ruet.ac.bd" placeholder="Email" />
          <input type="password" id="regPassword" value="SecretPassword123" placeholder="Password" />
          <button onclick="testRegister()">Register via Façade</button>
        </div>
        <pre id="regOutput">// Click "Register via Façade" to test...</pre>
      </div>

      <div class="card">
        <h3><span class="badge badge-green">Independent Subsystem Route</span> POST /api/test-email</h3>
        <p>Demonstrates that the underlying <strong>NotificationService remains completely independent</strong> and can be directly used by other clients without the Façade.</p>
        <div>
          <input type="email" id="testEmailInput" value="direct-test@ruet.ac.bd" placeholder="Email" />
          <button onclick="testDirectEmail()">Send Direct Email</button>
        </div>
        <pre id="emailOutput">// Click "Send Direct Email" to test...</pre>
      </div>

      <script>
        async function testRegister() {
          const email = document.getElementById('regEmail').value;
          const password = document.getElementById('regPassword').value;
          const output = document.getElementById('regOutput');
          output.textContent = "Processing registration via AuthFacade...";
          try {
            const res = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, name: 'RUET Student' })
            });
            const data = await res.json();
            output.textContent = JSON.stringify(data, null, 2);
          } catch(err) {
            output.textContent = "Error: " + err.message;
          }
        }

        async function testDirectEmail() {
          const email = document.getElementById('testEmailInput').value;
          const output = document.getElementById('emailOutput');
          output.textContent = "Dispatching direct email via NotificationService...";
          try {
            const res = await fetch('/api/test-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, name: 'Direct Subsystem User' })
            });
            const data = await res.json();
            output.textContent = JSON.stringify(data, null, 2);
          } catch(err) {
            output.textContent = "Error: " + err.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// ── 1. The Façade Route: POST /api/register ─────────────────────────────────
/**
 * Clean client route demonstrating how AuthFacade encapsulates:
 * 1. SecurityService (hashing)
 * 2. DatabaseService (persistence)
 * 3. TokenService (JWT issuance)
 * 4. NotificationService (email dispatch)
 */
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Client only interacts with the unified Facade
    const authFacade = new AuthFacade();
    const result = await authFacade.registerUser(email, password, name);

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ── 2. The Independent Subsystem Route: POST /api/test-email ───────────────
/**
 * Direct subsystem route proving that NotificationService is completely decoupled
 * and can be utilized independently without going through AuthFacade.
 */
app.post('/api/test-email', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required to test email dispatch.'
      });
    }

    // Direct instantiation and invocation of subsystem component
    const notificationService = new NotificationService();
    const emailResult = await notificationService.sendWelcomeEmail(email, name || 'Subsystem Tester');

    return res.status(200).json({
      success: true,
      message: 'Direct subsystem call executed successfully (bypassed AuthFacade).',
      data: emailResult
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ── Server Listener ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Façade Demo Server listening on http://localhost:${PORT}`);
  console.log(`   - Façade Route:            POST http://localhost:${PORT}/api/register`);
  console.log(`   - Direct Subsystem Route:  POST http://localhost:${PORT}/api/test-email`);
  console.log(`====================================================`);
});
