import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from "@getbrevo/brevo";

const apiInstance = new TransactionalEmailsApi();

apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export async function sendEmail({ to, subject, html, text }) {
  if (!to || !subject) {
    throw new Error("sendEmail: 'to' and 'subject' are required");
  }

  const sendSmtpEmail = new SendSmtpEmail();

  sendSmtpEmail.sender = {
    name: "Perplexity Clone",
    email: process.env.BREVO_SENDER_EMAIL,
  };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  if (text) sendSmtpEmail.textContent = text;

  const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

  console.log("📧 Email sent to:", to, "| Message ID:", data.body.messageId);
  return data;
}