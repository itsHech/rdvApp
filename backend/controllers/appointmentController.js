const Appointment = require('../models/Appointment');

// 📌 Create
exports.createAppointment = async (req, res) => {
    try {
        const { professionalId, date } = req.body;
        const appointment = new Appointment({
            client: req.user.id,
            professional: professionalId,
            date
        });
        await appointment.save();
        res.redirect('/appointments');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 📌 Read (list all)
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ client: req.user.id })
            .populate('professional', 'name email')
            .sort({ date: 1 });

        res.render('appointments/list', { appointments, title: 'My Appointments' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 📌 Show edit form
exports.editAppointmentForm = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).send('Appointment not found');

        res.render('appointments/edit', { appointment, title: 'Edit Appointment' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 📌 Update
exports.updateAppointment = async (req, res) => {
    try {
        const { date } = req.body;
        await Appointment.findByIdAndUpdate(req.params.id, { date });
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
