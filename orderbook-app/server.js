import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Order from "./models/Orders.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
//const MONGO_URI =
//"mongodb+srv://maxbharris1:puxTsSmHSxxp6wTO@orderbook-data-maxh.c7rx0hm.mongodb.net/?appName=Orderbook-Data-MaxH";

const MONGO_URI =
  "mongodb+srv://maxbharris1:j10xiV0E9xebJkRP@orderbook-data-maxh.c7rx0hm.mongodb.net/?appName=Orderbook-Data-MaxH";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
