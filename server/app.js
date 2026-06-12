import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get(
    "/api/me",
    authMiddleware,
    (req, res) => {
        res.json({
            user: req.user
        });
    }
);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});