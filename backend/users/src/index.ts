import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './router/routerUser';
import cors from 'cors';

const mongoUri = process.env.ME_CONFIG_MONGODB_URL;
const corsAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : [];

const app = express();

app.use(cors({
  origin: corsAllowedOrigins
}));

app.use(express.json());

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;

const mongooseOptions = {
  serverSelectionTimeoutMS: 80000,
  connectTimeoutMS: 500000, 
};

mongoose.connect(mongoUri as string, mongooseOptions)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
