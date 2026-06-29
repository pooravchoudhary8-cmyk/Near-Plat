import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a mock ethereal transporter for development
// In production, you would configure SMTP settings from process.env (SendGrid, AWS SES, etc)
let transporter;

const initTransporter = async () => {
  if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate a test account on the fly if not production
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

initTransporter();

export const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  try {
    if (!transporter) await initTransporter();

    const mailOptions = {
      from: '"Near Plat" <no-reply@nearplat.com>',
      to: userEmail,
      subject: `Order Confirmation - #${orderDetails._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Thank you for your order!</h2>
          <p>We've received your order and are getting it ready to ship.</p>
          <h3>Order Details:</h3>
          <p><strong>Order Number:</strong> ${orderDetails._id}</p>
          <p><strong>Total Price:</strong> $${orderDetails.totalPrice.toFixed(2)}</p>
          <br/>
          <p>Your Near Plat Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Email send failed:', error);
  }
};
