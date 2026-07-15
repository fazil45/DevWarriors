import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtp (email:string,otp:string) {
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: "mdfazil846@gmail.com",
    subject: 'Email verify Otp',
    html: `<div><h2>Your otp is here</h2><h3>${otp}</h3></div>`,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}