import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import supabase from "../services/supabase";

import ChannelSidebar from "../components/layout/ChannelSidebar";
import MainContent from "../components/layout/MainContent";
import WorkspaceSidebar from "../components/layout/WorkspaceSidebar";

import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [channels, setChannels] = useState([]);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchWorkspaces = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await api.get("/workspaces", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWorkspaces(data);
      console.log("WORKSPACES:", data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const { data } = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data.user);
    } catch {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const createWorkspace = async () => {
    if (creatingWorkspace) return;
    setCreatingWorkspace(true);

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/workspaces",
        {
          name: workspaceName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchWorkspaces();

      setWorkspaceName("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingWorkspace(false);
    }
  };

  const joinWorkspace = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/workspaces/join",
        {
          inviteCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchWorkspaces();

      setInviteCode("");
      setShowJoinModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to join workspace");
    }
  };

  const deleteWorkspace = async (workspace) => {
    const confirmed = window.confirm(`Delete ${workspace.name}? This will remove all channels and messages in the workspace.`);

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/workspaces/${workspace.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = await api.get("/workspaces", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWorkspaces(data);
      setSelectedWorkspace(null);
      setSelectedChannel(null);
      setChannels([]);
      setMessages([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete workspace");
    }
  };

  const fetchChannels = async (workspaceId) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await api.get(`/channels/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChannels(data);

      if (data.length > 0) {
        setSelectedChannel(data[0]);
        fetchMessages(data[0].id);
      } else {
        setSelectedChannel(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWorkspaceClick = (workspace) => {
    setSelectedWorkspace(workspace);

    fetchChannels(workspace.id);
  };

  const createChannel = async () => {
    try {
      if (!selectedWorkspace) {
        alert("Select a workspace first");
        return;
      }
      const token = localStorage.getItem("token");

      await api.post(
        "/channels",
        {
          workspaceId: selectedWorkspace.id,
          name: channelName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchChannels(selectedWorkspace.id);

      setChannelName("");
      setShowChannelModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteChannel = async (channel) => {
    if (!selectedWorkspace) return;

    const confirmed = window.confirm(`Delete #${channel.name}? This will remove all messages in the channel.`);

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/channels/${channel.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = await api.get(`/channels/${selectedWorkspace.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChannels(data);

      if (selectedChannel?.id === channel.id) {
        setSelectedChannel(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete channel");
    }
  };

  const fetchMessages = async (channelId) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await api.get(`/messages/${channelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/messages",
        {
          channelId: selectedChannel.id,
          content: messageInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchMessages(selectedChannel.id);

      setMessageInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchMessages(selectedChannel.id);
    } catch (err) {
      console.error(err);
    }
  };

    const updateMessage = async (messageId) => {
      try {
        const token = localStorage.getItem("token");

        await api.put(
          `/messages/${messageId}`,
          {
            content: editText,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        await fetchMessages(selectedChannel.id);

        setEditingMessage(null);
        setEditText("");
      } catch (err) {
        console.error(err);
      }
    };
  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);

    fetchMessages(channel.id);
  };

  useEffect(() => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          if (selectedChannel && payload.new.channel_id === selectedChannel.id) {
            fetchMessages(selectedChannel.id);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChannel]);

  useEffect(() => {
    fetchUser();
    fetchWorkspaces();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 text-neutral-950">
      <WorkspaceSidebar
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        onWorkspaceClick={handleWorkspaceClick}
        setShowModal={setShowModal}
        user={user}
        logout={logout}
        deleteWorkspace={deleteWorkspace}
      />
      <ChannelSidebar
        user={user}
        channels={channels}
        selectedWorkspace={selectedWorkspace}
        selectedChannel={selectedChannel}
        setShowChannelModal={setShowChannelModal}
        onChannelClick={handleChannelClick}
        deleteChannel={deleteChannel}
      />

      <MainContent
        user={user}
        selectedWorkspace={selectedWorkspace}
        selectedChannel={selectedChannel}
        channels={channels}
        messages={messages}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        sendMessage={sendMessage}
        deleteMessage={deleteMessage}
        updateMessage={updateMessage}
        editingMessage={editingMessage}
        setEditingMessage={setEditingMessage}
        editText={editText}
        setEditText={setEditText}
        updateMessage={updateMessage}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl shadow-neutral-950/20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">New workspace</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">Create Workspace</h2>
            </div>
            <button
              onClick={() => {
                setShowModal(false);
                setShowJoinModal(true);
              }}
              className="
    rounded-xl
    border
    px-4
    py-2
    text-sm
    font-medium
  "
            >
              Join Workspace
            </button>

            <input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Workspace Name"
              className="mt-6 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-2xl border border-neutral-200 px-4 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                Cancel
              </button>

              <button disabled={creatingWorkspace} onClick={createWorkspace}>
                {creatingWorkspace ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div
          className="fixed inset-0 
      flex
      items-center
      justify-center
      bg-black/50
    "
        >
          <div
            className="
        w-96
        rounded-3xl
        bg-white
        p-6
      "
          >
            <h2
              className="
          mb-4
          text-xl
          font-bold
        "
            >
              Join Workspace
            </h2>

            <input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Invite Code"
              className="
          w-full
          rounded-xl
          border
          p-3
        "
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="
            flex-1
            rounded-xl
            border
            py-2
          "
              >
                Cancel
              </button>

              <button
                onClick={joinWorkspace}
                className="
            flex-1
            rounded-xl
            bg-blue-600
            py-2
            text-white
          "
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {showChannelModal && (
        <div
          className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
      "
        >
          <div
            className="
          bg-white
          rounded-3xl
          p-6
          w-96
        "
          >
            <h2
              className="
            text-xl
            font-bold
            mb-4
          "
            >
              Create Channel
            </h2>

            <input
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="general"
              className="
            w-full
            border
            rounded-xl
            p-3
          "
            />

            <div
              className="
            flex
            gap-3
            mt-4
          "
            >
              <button
                onClick={() => setShowChannelModal(false)}
                className="
              flex-1
              border
              rounded-xl
              py-2
            "
              >
                Cancel
              </button>

              <button
                onClick={createChannel}
                className="
              flex-1
              bg-black
              text-white
              rounded-xl
              py-2
            "
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
