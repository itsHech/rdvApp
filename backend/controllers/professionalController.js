const Professional = require("../models/Professional");
const User = require('../models/User');

// Get all professionals
exports.getProfessionals = async (req, res) => {
  try {
    const professionals = await User.find({
        role : 'professional'
    });
    res.json(professionals);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
