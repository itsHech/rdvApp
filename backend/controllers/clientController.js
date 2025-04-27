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

exports.getClientById = async (req, res) => {
    try {
        const clients = await User.find(
            { $and : [ {_id : req.params.id}, {role : 'client'} ] }
        );
        if (!clients) return res.status(404).json({ error: 'Not found' });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
