import supabase from "../db/supabase.js";

export const sendMessage = async (req, res) => {
  try {
    const { channelId, content } = req.body;

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          channel_id: channelId,
          sender_id: req.user.id,
          content,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to send message",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;

    const { data, error } = await supabase
      .from("messages")
      .select(
        `
      *,
      users (
        id,
        name,
        email
      )
    `,
      )
      .eq("channel_id", channelId)
      .order("created_at", {
        ascending: true,
      });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: message, error: fetchError } = await supabase.from("messages").select("*").eq("id", id).single();

    if (fetchError || !message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (message.sender_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) throw error;

    res.json({
      message: "Message deleted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to delete message",
    });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    const { data: message, error: fetchError } = await supabase.from("messages").select("*").eq("id", id).single();

    if (fetchError || !message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (message.sender_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const { data, error } = await supabase
      .from("messages")
      .update({
        content,
        edited_at: new Date(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to update message",
    });
  }
};
