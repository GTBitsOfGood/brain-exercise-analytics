import path from "path";
import Email from "email-templates";
import nodemailer, { TransportOptions } from "nodemailer";

export const sendEmail = async (
  recipient: string,
  emailSubject: string,
  template: string,
  key?: { [Key: string]: string },
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as TransportOptions);
  const email = new Email({
    message: {
      from: process.env.EMAIL_FROM,
    },
    preview:
      process.env.NODE_ENV === "development" ? { openSimulator: false } : false,
    transport: transporter,
  });

  console.log(path.join(process.cwd(), `/server/utils/emails/`, template));
  await email.send({
    template: path.join(process.cwd(), `/server/utils/emails/`, template),
    message: {
      to: recipient,
      subject: emailSubject,
    },
    locals: key,
  });
};
