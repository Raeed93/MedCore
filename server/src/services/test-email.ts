// Load .env BEFORE importing services
import dotenv from 'dotenv';
import path from 'path';

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Now import services
import { testEmailConnection, sendMagicLinkEmail } from './email.service';

async function runTest() {
  console.log('🧪 Testing email configuration...\n');
  
  // Debug: Show what was loaded
  console.log('📧 Email config:');
  console.log('  Host:', process.env.SMTP_HOST);
  console.log('  Port:', process.env.SMTP_PORT);
  console.log('  User:', process.env.SMTP_USER);
  console.log('  Pass:', process.env.SMTP_PASS ? '****' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
  console.log('');
  
  // Test 1: Verify connection
  const isConnected = await testEmailConnection();
  
  if (!isConnected) {
    console.error('\n❌ Email configuration failed. Check your .env file!');
    process.exit(1);
  }
  
  // Test 2: Send test email
  console.log('\n📧 Sending test magic link email...');
  try {
    await sendMagicLinkEmail(
      process.env.SMTP_USER || 'test@example.com',
      'TEST_TOKEN_123'
    );
    console.log('\n✅ Test email sent! Check your inbox!');
  } catch (error) {
    console.error('\n❌ Failed to send test email:', error);
  }
}

runTest();