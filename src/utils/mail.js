import { text } from "express";
import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "task Manager",
      link: "https//taskmanager.com",
    },
  });

  const emailtextual = mailGenerator.generatePlaintext(
    options.emailVerificationContent
  );

  const emailhtml = mailGenerator.generate(options.emailVerificationContent);
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_TRAP_SMTP_HOST,
    PORT: process.env.MAIL_TRAP_SMTP_PORT,
    auth: {
      user: process.env.MAIL_TRAP_SMTP_USER,
      pass: process.env.MAIL_TRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "ayush72350@gmail.com",
    to: options.email,
    text: emailtextual,
    html: emailhtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "email service is failed , make sure you provide correct credential"
    );
    console.error("error", error);
  }
};

const emailVerificationContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our application!!",
      action: {
        instructions:
          "To verify your email, please click the following button:",
        button: {
          color: "#1aae5aff",
          text: "Verify your email",
          link: verificationUrl, // Use the variable, not a string
        },
      },
      outro: "If you did not request this email, you can safely ignore it.",
    },
  };
};
const passwordResetVerification = (username, PasswordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "reset your password",
      action: {
        instructions:
          "To reset your password, please click the following button:",
        button: {
          color: "#ae1a1aff",
          text: "click to reset",
          link: PasswordResetUrl, // Use the variable, not a string
        },
      },
      outro: "If you did not request this email, you can safely ignore it.",
    },
  };
};
export { emailVerificationContent, passwordResetVerification, sendmail };
