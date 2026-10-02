import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import config from "../config/config.js";

const sendEmail = async (options) => {
  // Configure mailgen by setting a theme and your product info
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      // Appears in header & footer of e-mails
      name: "TaskPilot",
      link: "https://taskpilot.app",
      // Optional product logo
      // logo: ''
    },
  });

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);

  // Generate an HTML email with the provided contents
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  //A transporter is an object that handles the connection to your email service and sends messages on your behalf.
  //create one transporter and reuse it for all your emails.
  const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass,
    },
  });

  const mail = {
    from: "mail.taskpilot@example.com",
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed silently. Make sure that you have provided your MAILTRAP credentials in the .env file",
    );
    console.error("Error: ", error);
  }
};

//method to generate verification mail content

const emailVerificationMailContentGen = (username, verficationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to TaskPilot! Glad to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verficationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

////method to generate verification mail content

const forgotPasswordMailContentGen = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions:
          "To reset your password click on the following button or link",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  emailVerificationMailContentGen,
  forgotPasswordMailContentGen,
  sendEmail,
};
