import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../db/supabase.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from("users")
            .insert([
                {
                    name,
                    email,
                    password: hashedPassword
                }
            ])
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(201).json({
            message: "User created"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Wrong password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};