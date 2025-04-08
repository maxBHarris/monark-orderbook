import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  symbol: String,
  side: String,
  price: Number,
  quantity: Number,
  total: Number,
  valuation: String,
  direct: Boolean,
  spv: Boolean,
  shareClass: String,
  mgmtFee: String,
  carry: String,
  riaManaged: Boolean,
  doubleLayer: Boolean,
  audits: Boolean,
  dataroom: Boolean,
  notes: String,
  visibility: String,
  minimum: String,
  closingDate: String,
  createdAt: Date,
});

export default mongoose.model("Order", OrderSchema);
