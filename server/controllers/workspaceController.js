import supabase from "../db/supabase.js";

export const createWorkspace = async (req, res) => {
    try {

        const { name } = req.body;

        const { data, error } = await supabase
            .from("workspaces")
            .insert([
                {
                    name,
                    owner_id: req.user.id
                }
            ])
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(201).json(data);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

export const getWorkspaces = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from("workspaces")
            .select("*")
            .eq("owner_id", req.user.id)
            .order("created_at", {
                ascending: false
            });

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.json(data);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};