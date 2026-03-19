import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Email transporter is ready to send emails");
  })
  .catch((err) => {
    console.error("Email transporter verification failed:", err);
  });

export async function sendEmail({ to, subject, html, text }) {
  if (!to || !subject) {
    throw new Error("sendEmail: 'to' and 'subject' are required");
  }

  const info = await transporter.sendMail({
    from: `"Perplexity Clone" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });

  console.log("📧 Email sent to:", to, "| Message ID:", info.messageId);
  return info;
}
