const Professional = require("../models/Professional");
const User = require("../models/User");

// Get all professionals
exports.getProfessionals = async (req, res) => {
  try {
    const professionals = await User.find({
      role: "professional",
    });
    res.json(professionals);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getProfessionalById = async (req, res) => {
  try {
    const professional = await User.find({
      $and: [{ _id: req.params.id }, { role: "professional" }],
    });
    if (!professional) return res.status(404).json({ error: "Not found" });
    res.json(professional);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};