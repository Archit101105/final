// server.js
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Replace with your own Razorpay Key ID and Secret
const razorpay = new Razorpay({
  key_id: 'rzp_test_O6e3vSm0GA6BhX',
  key_secret: 'QuI9XC3R5dJfvqOezLWVsRMy'
});

// 🎯 POST endpoint to create an order
app.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  if (!amount) return res.status(400).json({ error: 'Amount is required' });

  const options = {
    amount: amount * 100, // convert to paisa
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: 'rzp_test_O6e3vSm0GA6BhX' // expose only key_id to client
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));