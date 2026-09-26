const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Tvoj link sa bazom i šifrom
const MONGO_URI = "mongodb+srv://zoranjevtic2009_db_user:tasty1234@cluster0.zfkgqqs.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Uspešno povezano sa MongoDB bazom!"))
  .catch(err => console.log("Greška pri povezivanju:", err));

// Šema za porudžbine
const OrderSchema = new mongoose.Schema({
    id: Number,
    customer: String,
    phone: String,
    city: String,
    address: String,
    items: Array,
    step: { type: Number, default: 1 },
    status: { type: String, default: 'Porudžbina Primljena' },
    createdAt: String
});

const Order = mongoose.model('Order', OrderSchema);

// Ruta za primanje porudžbine sa sajta
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true, message: "Porudžbina sačuvana u bazi!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Ruta za uzimanje porudžbina za admin panel
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta za promenu statusa u admin panelu
app.put('/api/orders/:id', async (req, res) => {
    try {
        const updated = await Order.findOneAndUpdate(
            { id: req.params.id }, 
            { step: req.body.step, status: req.body.status },
            { new: true }
        );
        res.json({ success: true, updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));