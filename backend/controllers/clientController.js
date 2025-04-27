const User = require('../models/User');


// Get all professionals
exports.getClients = async (req, res) => {
    try {
        const clients = await User.find(
            { role : 'client' }
        );
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
