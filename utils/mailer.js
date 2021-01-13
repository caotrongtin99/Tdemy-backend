var nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport(
  {
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_POST,
    // secure: account.smtp.secure,
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    logger: true,
    debug: false, // include SMTP traffic in the logs
  },
  {
    // default message fields

    // sender info
    from: "TDEMY <tdemy@gmail.com>"
  }
);

module.exports = (message) => {
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log("[MAIL][ERROR] "+ error.message);
    }else{
    console.log("[MAIL][SUCCESS] Message sent successfully!: ", info);
    }
    // // only needed when using pooled connections
    // transporter.close();
  });
};