require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors('*'));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/mail", async (req, res) => {
  const { email, subject, text, name, attachments } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // if(att)
  if(attachments && attachments.length > 0){
    attachments.forEach((attachment) => {
      if (!attachment.path) {
        return res.status(500).json({ message: "Invalid attachment" });
      }
      else if(!attachment.filename) {
        attachment.filename = attachment.path.split("/").pop();
      }
    });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject + (name? " - " + name : ""),
      text: text,
      attachments: attachments? attachments : [],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});