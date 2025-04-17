const Professional = require('../models/Professional');

// Create new professional
exports.createProfessional = async (req, res) => {
    try {
        const { name, email, specialty, availableDates } = req.body;
        const professional = new Professional({ name, email, specialty, availableDates });
        await professional.save();
        res.status(201).json(professional);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all professionals
exports.getProfessionals = async (req, res) => {
    try {
        const professionals = await Professional.find();
        res.json(professionals);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get single professional
exports.getProfessionalById = async (req, res) => {
    try {
        const professional = await Professional.findById(req.params.id);
        if (!professional) return res.status(404).json({ error: 'Not found' });
        res.json(professional);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
