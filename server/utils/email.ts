import path from "path";
import nodemailer, { TransportOptions } from "nodemailer";
import pug from "pug";

export const sendEmail = async (
  recipient: string,
  emailSubject: string,
  template: string,
  key?: { [Key: string]: string },
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as TransportOptions);

  const compiledFunction = pug.compileFile(
    path.join(process.cwd(), `/server/utils/emails/`, template, "html.pug"),
  );
  const emailHTML = compiledFunction(key);

  await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: recipient,
    subject: emailSubject,
    html: emailHTML,
  });
};
