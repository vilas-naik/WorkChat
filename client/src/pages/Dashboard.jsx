import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      />
      <ChannelSidebar
        channels={channels}
        selectedWorkspace={selectedWorkspace}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        setShowChannelModal={setShowChannelModal}
      />

      <MainContent
        user={user}
        selectedWorkspace={selectedWorkspace}
        selectedChannel={selectedChannel}
        channels={channels}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl shadow-neutral-950/20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                New workspace
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">
                Create Workspace
              </h2>
            </div>

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

              <button
                onClick={createWorkspace}
                className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
              >
                Create
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
