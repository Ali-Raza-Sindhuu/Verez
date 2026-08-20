import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = new Resend(env.resendApiKey);

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const { data, error } = await resend.emails.send({
    from: `Vexez <${env.resendFromEmail}>`,
    to,
    subject: "Reset your Vexez password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>We received a request to reset the password for your Vexez account.</p>
        <p>This link expires in ${env.jwtResetExpiresIn}. If you didn't request this, you can safely ignore this email.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background:#3D6DF2;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">
            Reset password
          </a>
        </p>
        <p style="color:#888;font-size:12px;">If the button doesn't work, copy this link: ${resetUrl}</p>
      </div>
    `,
  });

  // The Resend SDK does NOT throw on failure — it resolves with { data, error }.
  // Without this check, a bad API key, unverified sender domain, or rate limit
  // would silently "succeed" and the user would just never get the email.
  if (error) {
    console.error("Resend failed to send password reset email:", error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }

  return data;
}