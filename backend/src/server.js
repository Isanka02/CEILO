import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes         from './routes/authRoutes.js';
import userRoutes         from './routes/userRoutes.js';
import productRoutes      from './routes/productRoutes.js';
import categoryRoutes     from './routes/categoryRoutes.js';
import orderRoutes        from './routes/orderRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes        from './routes/adminRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/products',      productRoutes);
app.use('/api/categories',    categoryRoutes);
app.use('/api/orders',        orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin',         adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

app.get('/', (req, res) => res.send('CEILO API running...'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));