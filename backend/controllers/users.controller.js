const Users = require('../models/users.models');
const fileFormat = require('../validation/fileFormat');

const FindAllUsers = async (req, res) => {
  try {
    if (!req.query.page) {
      const data = await Users.find({ isVerified: true });
      res.status(201).json(data);
    } else {
      const PAGE_SIZE = 10;
      const page = parseInt(req.query.page || '0');
      const total_users = await Users.countDocuments({ isVerified: true });
      const total_page = Math.ceil(total_users / PAGE_SIZE);
      const result = await Users.find({ isVerified: true })
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page);
      res.status(201).json({ total_users, total_page, result });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const DeleteUser = async (req, res) => {
  try {
    const data = await Users.deleteOne({
      _id: req.query.id,
    });
    res.status(200).json({ data, message: 'Delete Successfully' });
  } catch (error) {
    res.send({
      error: error,
    });
  }
};

const UpdateCV = async (req, res) => {
  try {
    const data = await Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        CV: req.file ? (fileFormat(req.file) ? req.file.path : '') : '',
      },
      { new: true }
    );
    if (data.CV === '')
      return res.status(400).json({ message: 'File format required' });
    res.status(200).json(data);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};

const FindUserResume = async (req, res) => {
  try {
    const data = await Users.findOne({
      isVerified: true,
      email: req.query.email,
    }).select('CV');
    res.status(200).json(data);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

const SeachUsers = async (req, res) => {
  try {
    const PAGE_SIZE = 10;
    const page = parseInt(req.query.page || '0');
    const data = await Users.find({
      isVerified: true,
      $or: [
        { name: { $regex: req.params.search, $options: 'i' } },
        { email: { $regex: req.params.search, $options: 'i' } },
        { profession: { $regex: req.params.search, $options: 'i' } },
        { phone: { $regex: req.params.search, $options: 'i' } },
      ],
    })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
    const total_users = await Users.countDocuments({
      isVerified: true,
      $or: [
        { name: { $regex: req.params.search, $options: 'i' } },
        { email: { $regex: req.params.search, $options: 'i' } },
        { profession: { $regex: req.params.search, $options: 'i' } },
        { phone: { $regex: req.params.search, $options: 'i' } },
      ],
    });
    const total_pages = Math.ceil(total_users / PAGE_SIZE);

    res.status(200).json({ data, total_pages });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

module.exports = {
  DeleteUser,
  FindAllUsers,
  UpdateCV,
  SeachUsers,
  FindUserResume,
};