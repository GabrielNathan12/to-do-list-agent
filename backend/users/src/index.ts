import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './router/routerUser';
import { config } from 'dotenv';
import path from 'path';

const environment = config({ path: path.resolve(__dirname, '../dotenv_files/.env') });


const mongoUri = environment.parsed?.ME_CONFIG_MONGODB_URL;

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(mongoUri as string)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/api/users`);
});
