const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    }
});
const sendEmail = async ({recipient, subject, message, sender}) => {
    return await transport.sendMail({
        from : sender,
        to: recipient,
        subject,
        text: message,
        html: '<h5>'+message+'</h5>',
    })
}
// 📌 Create
exports.createAppointment = async (req, res) => {
    try {
        const { professionalId, date } = req.body;
        const appointment = new Appointment({
            client: req.user.id,
            professional: professionalId,
            date
        });
        //await appointment.save();
        const user = await User.findById(professionalId);
        const client = await User.findById(req.user.id);

        const sender = client.email;
        const recipient = user.email;
        const subject = "Rendez-vous";
        const message = "Vous avez rendez vous dans la date "+date+" avec le client "+client.name;
        sendEmail({recipient, subject, message, sender});
        res.status(200).json({user});
    } catch (err) {
        res.status(500).send(err);
    }
};

// 📌 Read (list all)
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ client: req.user.id })
            .populate('professional', 'name email')
            .sort({ date: 1 });

        res.json({ appointments : appointments });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 📌 Show edit form
/*
exports.editAppointmentForm = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).send('Appointment not found');

        res.render('appointments/edit', { appointment, title: 'Edit Appointment' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
*/

// 📌 Update
exports.updateAppointment = async (req, res) => {
    try {
        const { date } = req.body;
        await Appointment.findByIdAndUpdate(req.params.id, { date,  });
        res.redirect('/appointments');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 📌 Delete
exports.deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.redirect('/appointments');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
