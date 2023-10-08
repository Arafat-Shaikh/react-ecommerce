const { User } = require("../model/User");

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    console.log(user);
    res.status(201).json(user);
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.fetchUserById = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    res.status(201).json(user);
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.fetchAllUsersInfo = async (req, res) => {
  try {
    const users = await User.find({});
    let modifiedUser = [];
    for (let user of users) {
      const { email, role, addresses, id } = user;
      modifiedUser.push({
        id: id,
        email: email,
        role: role,
        addresses: addresses,
      });
      console.log(modifiedUser);
    }
    res.status(201).json(modifiedUser);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
};

exports.updateAdminUser = async (req, res) => {
  try {
    const { id, role, email, addresses } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { role: role },
      { new: true }
    );
    const modifiedUser = {
      id: id,
      email: email,
      role: role,
      addresses: addresses,
    };
    console.log(user);
    res.status(201).json(modifiedUser);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
};

exports.adminDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    console.log(user);
    const { email, role, addresses, id } = user;
    let modifiedUser = {
      id: id,
      email: email,
      role: role,
      addresses: addresses,
    };

    res.status(201).json(modifiedUser);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
};
