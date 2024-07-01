import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import myHotelRoutes from './routes/my-hotels.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);

app.listen(7000, () => {
    console.log("server running on localhost:7000");
});
