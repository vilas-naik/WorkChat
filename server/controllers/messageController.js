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
