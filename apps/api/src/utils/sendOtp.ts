import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtp(email: string, otp: string) {
  const { data, error } = await resend.emails.send({
    from: "Dev Warriors <mail@mail.mohdfazil.dev>",
    to: email,
    subject: "Email verify Otp",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,.08);">

          <tr>
            <td align="center">
              <h1 style="margin:0;color:#111827;font-size:28px;">
                Verify your email
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding-top:20px;">
              <p style="margin:0;font-size:16px;color:#4b5563;line-height:1.6;">
                Hi,
              </p>

              <p style="font-size:16px;color:#4b5563;line-height:1.8;">
                Thanks for signing up for <strong>Dev Warriors</strong>.
                Use the verification code below to complete your email verification.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:30px 0;">
              <div style="
                display:inline-block;
                background:#111827;
                color:#ffffff;
                padding:18px 40px;
                font-size:34px;
                font-weight:700;
                letter-spacing:10px;
                border-radius:10px;
              ">
                ${otp}
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <p style="font-size:15px;color:#6b7280;line-height:1.7;">
                This verification code is valid for
                <strong>10 minutes</strong>.
              </p>

              <p style="font-size:15px;color:#6b7280;line-height:1.7;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-top:30px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
                © 2026 Dev Warriors. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}
