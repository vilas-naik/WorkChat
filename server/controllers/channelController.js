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

export const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: channel, error: channelError } = await supabase
      .from("channels")
      .select("*")
      .eq("id", id)
      .single();

    if (channelError || !channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("owner_id")
      .eq("id", channel.workspace_id)
      .single();

    if (workspaceError || !workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    if (workspace.owner_id !== req.user.id) {
      return res.status(403).json({
        message: "Only the workspace owner can delete channels",
      });
    }

    const { error } = await supabase
      .from("channels")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      message: "Channel deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete channel",
    });
  }
};
