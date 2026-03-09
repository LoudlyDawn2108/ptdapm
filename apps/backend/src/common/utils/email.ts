import { env } from "@hrms/env";
import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendNewAccountEmail(
  to: string,
  username: string,
  password: string,
): Promise<void> {
  const mailer = getTransporter();
  await mailer.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "HRMS — Tài khoản mới đã được tạo",
    html: `
      <h2>Chào mừng bạn đến với HRMS</h2>
      <p>Tài khoản của bạn đã được tạo. Dưới đây là thông tin đăng nhập:</p>
      <ul>
        <li><strong>Tên đăng nhập:</strong> ${username}</li>
        <li><strong>Mật khẩu:</strong> ${password}</li>
      </ul>
      <p>Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu.</p>
      <p>— Hệ thống HRMS</p>
    `,
  });
}
