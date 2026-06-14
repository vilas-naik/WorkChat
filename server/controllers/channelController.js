import supabase from "../db/supabase.js";

export const createChannel = async (
  req,
  res
) => {
    try {
    const { workspaceId, name } = req.body;

    const { data, error } = await supabase
      .from("channels")
      .insert([
        {
          workspace_id: workspaceId,
          name,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create channel",
    });
  }
};

export const getChannels = async (
  req,
  res
) => {
    try {
    const { workspaceId } = req.params;

    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch channels",
    });
  }
};