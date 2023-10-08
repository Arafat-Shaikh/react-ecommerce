const { Cart } = require("../model/Cart");

exports.addToCart = async (req, res) => {
  try {
    const { id } = req.user;
    console.log("cart here " + req.user);
    const item = new Cart({ ...req.body, user: id });
    const doc = await item.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.getCartByUserId = async (req, res) => {
  try {
    const { id } = req.user;
    // console.log("are you here " + id);
    console.log("are you at cart");
    const cart = await Cart.find({ user: id }).populate("product");
    console.log("here is cart " + cart);
    res.status(201).json(cart);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("product");

    res.status(201).json(item);
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const item = await Cart.findByIdAndDelete(id);
    res.status(201).json(item);
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.deleteAllItems = async (req, res) => {
  try {
    const { id } = req.user;
    const cart = await Cart.deleteMany({ user: id });
    console.log(id);
    console.log(cart);
    res.status(201).json(cart);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
};
