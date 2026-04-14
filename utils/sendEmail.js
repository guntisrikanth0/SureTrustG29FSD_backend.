import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    // 1. Create the transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      // Using 587 is more stable on Render than 465
      port: Number(process.env.SMTP_PORT) || 587,
      // secure: false is required for port 587
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Your 16-character App Password
      },
      // This setting helps prevent connection timeouts on cloud servers
      tls: {
        rejectUnauthorized: false
      }
    });

    // 2. Define the email options
    const mailOptions = {
      from: `"Sure Trust" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    // 3. Send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email sent successfully: %s", info.messageId);
    return info;

  } catch (error) {
    // This will print the exact reason for failure in your Render Logs
    console.error("❌ Nodemailer Error Detail:", error.message);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

export default sendEmail;
