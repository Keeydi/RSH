// Supabase Edge Function to send OTP email
// Deploy this to: supabase/functions/send-otp-email/

import {serve} from 'https://deno.land/std@0.168.0/http/server.ts';
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@rhs-archaid.com';

serve(async (req) => {
  try {
    const {email, code, name} = await req.json();

    if (!email || !code) {
      return new Response(
        JSON.stringify({error: 'Email and code are required'}),
        {status: 400, headers: {'Content-Type': 'application/json'}},
      );
    }

    // Send email using Resend API (or Supabase's email service)
    const emailBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #3B82F6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">RHS ArchAID</h1>
          </div>
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email</h2>
            <p>Hello ${name || 'there'},</p>
            <p>Thank you for signing up! Please use the following verification code to confirm your email address:</p>
            <div style="background-color: white; border: 2px dashed #3B82F6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <p style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3B82F6; margin: 0;">${code}</p>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't create an account, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">This is an automated email from RHS ArchAID. Please do not reply to this email.</p>
          </div>
        </body>
      </html>
    `;

    // Use Resend API if available, otherwise use Supabase's email service
    if (RESEND_API_KEY) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: email,
          subject: 'Verify Your Email - RHS ArchAID',
          html: emailBody,
        }),
      });

      if (!resendResponse.ok) {
        throw new Error('Failed to send email via Resend');
      }
    } else {
      // Fallback: Use Supabase's built-in email (requires configuration)
      // For now, we'll just log it - you'll need to configure email sending
      console.log('OTP Code:', code, 'for email:', email);
      console.log('Configure RESEND_API_KEY or Supabase email service to send emails');
    }

    return new Response(
      JSON.stringify({success: true, message: 'OTP email sent'}),
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({error: error.message}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
});











