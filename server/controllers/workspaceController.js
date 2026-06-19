import supabase from "../db/supabase.js";
import crypto from "crypto";

export const createWorkspace = async (req, res) => {
  try {
    const inviteCode = crypto.randomBytes(4).toString("hex");

    const { name } = req.body;

    const { data, error } = await supabase
      .from("workspaces")
      .insert([
        {
          name,
          owner_id: req.user.id,
          invite_code: inviteCode,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    const { error: memberError } = await supabase
      .from("workspace_members")
      .insert([
        {
          workspace_id: data.id,
          user_id: req.user.id,
        },
      ]);

    if (memberError) {
      if (
        memberError.message.includes(
          "workspace_members_workspace_id_user_id_key",
        )
      ) {
        return res.status(400).json({
          message: "You are already a member of this workspace",
        });
      }

      return res.status(400).json({
        message: memberError.message,
      });
    }
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getWorkspaces = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("workspace_members")
      .select(
        `
    workspaces (
      *
    )
  `,
      )
      .eq("user_id", req.user.id);
    console.log(error);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const workspaces = data.map((item) => item.workspaces);

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const joinWorkspace = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("invite_code", inviteCode)
      .single();

    if (workspaceError || !workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const { error: memberError } = await supabase
      .from("workspace_members")
      .insert([
        {
          workspace_id: workspace.id,
          user_id: req.user.id,
        },
      ]);

    if (memberError) {
      if (
        memberError.message.includes(
          "workspace_members_workspace_id_user_id_key",
        )
      ) {
        return res.status(400).json({
          message: "You are already a member of this workspace",
        });
      }

      return res.status(400).json({
        message: memberError.message,
      });
    }

    res.status(200).json({
      message: "Joined workspace successfully",
      workspace,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", id)
      .single();

    if (workspaceError || !workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    if (workspace.owner_id !== req.user.id) {
      return res.status(403).json({
        message: "Only the workspace owner can delete this workspace",
      });
    }

    const { error } = await supabase
      .from("workspaces")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.json({
      message: "Workspace deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Workspace name is required",
      });
    }

    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", id)
      .single();

    if (workspaceError || !workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    if (workspace.owner_id !== req.user.id) {
      return res.status(403).json({
        message: "Only the workspace owner can rename this workspace",
      });
    }

    const { data, error } = await supabase
      .from("workspaces")
      .update({
        name: name.trim(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
