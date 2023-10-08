const { Product } = require("../model/Product");

exports.createNewProduct = async (req, res) => {
  try {
    const product = new Product({ ...req.body });
    console.log(product);
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(product);

    res.status(201).json(product);
  } catch (err) {
    res.status(401).json(err);
    console.log(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  console.log("hello");
  try {
    const product = await Product.find({});
    res.status(201).json(product);
  } catch (err) {
    res.status(401).json(err);
    console.log(err);
  }
};

exports.fetchProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(201).json(product);
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.fetchFilteredProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.perPage) || 6;
    let query = Product.find({});
    let productCount = Product.find({});

    const sort = req.query.sort;
    const sortValue = req.query.order == "asc" ? 1 : -1;

    if (sort && sortValue) {
      query = query.sort({ [sort]: sortValue });
    }

    if (req.query.category) {
      query = query.find({ category: { $in: req.query.category.split(",") } });
      productCount = productCount.find({
        category: { $in: req.query.category.split(",") },
      });
    }

    if (req.query.brand) {
      query = query.find({ brand: { $in: req.query.brand.split(",") } });
      productCount = productCount.find({
        brand: { $in: req.query.brand.split(",") },
      });
    }

    const docCount = await productCount.count().exec();
    query = query.skip((page - 1) * pageSize).limit(pageSize);
    console.log(docCount);

    const docs = await query.exec();
    res.set("X-DOCUMENT-COUNT", docCount);
    res.status(201).json(docs);
  } catch (err) {
    res.status(401).json(err);
    console.log(err);
  }
};
