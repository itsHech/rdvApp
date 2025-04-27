const Appointment = require("../models/Appointment");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// 📌 Create
exports.createAppointment = async (req, res) => {
  try {
    // Block if the user is a professional
    if (req.user.role === 'professional') {
      return res.status(403).json({ message: 'Professionals are not allowed to create appointments.' });
    }

    const { professionalId, date } = req.body;
    const appointment = new Appointment({
      client: req.user.id,
      professional: professionalId,
      date,
      description: "test test test",
    });
    await appointment.save();

    const user = await User.findById(professionalId);
    const client = await User.findById(req.user.id);

    const sender = client.email;
    const recipient = user.email;
    const subject = "Rendez-vous";
    const message =
      "Vous avez rendez-vous le " +
      date +
      " avec le client " +
      client.name;
      
    sendEmail({ recipient, subject, message, sender });

    res.status(200).json({ appointment });
  } catch (err) {
    res.status(500).json({ err: err.message || err });
  }
};

// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    if (req.query.status) {
      const appointments = await Appointment.find({
        $and: [
          { $or: [{ client: req.user.id }, { professional: req.user.id }] },
          { status: req.query.status },
        ],
      });

      res.json({ appointments: appointments });
    } else {
      const appointments = await Appointment.find({
        $or: [{ client: req.user.id }, { professional: req.user.id }],
      });

      res.json({ appointments: appointments });
    }
  } catch (err) {
    res.status(500).json({ err: err });
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    // Check if the user is an admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only.' });
    }

    const appointments = await Appointment.find();

    res.json({ appointments: appointments });
  } catch (err) {
    res.status(500).json({ err: err.message || err });
  }
};


// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    // Block if the user is a client
    if (req.user.role === 'client') {
      return res.status(403).json({ message: 'Clients are not allowed to update appointments.' });
    }

    const { date } = req.body;
    await Appointment.findByIdAndUpdate(req.params.id, { date });
    res.status(200).json({ message: "Update avec succès" });
  } catch (err) {
    res.status(500).json({ err: err.message || err });
  }
};


// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    // Allow only admins
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete appointments.' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Suppression avec succès" });
  } catch (err) {
    res.status(500).json({ err: err.message || err });
  }
};


// send Email 

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});
const sendEmail = async ({ recipient, subject, message, sender }) => {
  return await transport.sendMail({
    from: sender,
    to: recipient,
    subject,
    text: message,
    html: "<h5>" + message + "</h5>",
  });
};