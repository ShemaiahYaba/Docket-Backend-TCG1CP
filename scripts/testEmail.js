// Standalone email test — run with: node scripts/testEmail.js
import 'dotenv/config';
import { sendWelcomeEmail } from '../src/services/email/index.js';

const testLawyer = {
  full_name: 'Shemaiah (Test)',
  email: 'apostleshem17@gmail.com',
  role: 'senior_partner',
};

console.log(`Sending test welcome email to ${testLawyer.email}...`);
sendWelcomeEmail(testLawyer);

// Give the async send a moment to complete before the process exits
setTimeout(() => process.exit(0), 5000);
