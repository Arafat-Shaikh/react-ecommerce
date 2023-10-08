const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  items: { type: [Schema.Types.Mixed], required: true },
  totalAmount: { type: Number },
  totalItems: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  paymentType: { type: String, required: true },
  OrderStatus: { type: String, default: "Pending" },
  address: { type: Schema.Types.Mixed, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model("Order", orderSchema);

// {
//     items:[
//         {
//             "id": "64ea67fc96a75e3591a577db",
//             "title": "iPhone X",
//             "description": "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...",
//             "price": 1111,
//             "discountPercentage": 17.94,
//             "rating": 0,
//             "stock": 34,
//             "brand": "Apple",
//             "category": "smartphones",
//             "thumbnail": "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
//             "images": [
//                 "https://i.dummyjson.com/data/products/2/1.jpg",
//                 "https://i.dummyjson.com/data/products/2/2.jpg",
//                 "https://i.dummyjson.com/data/products/2/3.jpg",
//                 "https://i.dummyjson.com/data/products/2/thumbnail.jpg"
//             ],
//             "deleted": true
//         }
//     ]
//     totalAmount:2345,
//     totalItems:1,
//     user:"64ee04bc89beda7c6d194bf5",
//     paymentMethod: "cash",
//     paymentStatus: "pending",
//     status: "pending",
//     selectedAddress: "gokul village"
// }
