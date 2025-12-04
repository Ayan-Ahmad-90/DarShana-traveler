import nodemailer, { SendMailOptions } from 'nodemailer';
import { environment } from './environment.js';

const transporter = nodemailer.createTransport({
  host: environment.mail.host,
  port: environment.mail.port,
  secure: environment.mail.port === 465,
  auth: environment.mail.user
    ? {
        user: environment.mail.user,
        pass: environment.mail.pass
      }
    : undefined
});

export const sendMail = async (options: SendMailOptions) => {
  if (!environment.mail.host) {
    console.warn('SMTP configuration missing, skipping email send');
    return;
  }
  const payload = {
    from: environment.mail.from,
    ...options
  };
  await transporter.sendMail(payload);
};
