import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import supabase from "./db/supabase.js";

import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import channelRoutes from "./routes/channelRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use(  "/api/workspaces",workspaceRoutes);
app.use("/api/channels",channelRoutes);


app.get(
  "/api/me",
  authMiddleware,
  async (req, res) => {

    const { data: user, error } = await supabase
      .from("users")
      .select("id,name,email")
      .eq("id", req.user.id)
      .single();

    if (error) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user
    });
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});