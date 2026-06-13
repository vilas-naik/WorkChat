import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchWorkspaces = async () => {

    try {

      const token = localStorage.getItem("token");

      const { data } = await api.get(
        "/workspaces",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setWorkspaces(data);
      console.log("WORKSPACES:", data);
    } catch (err) {
      console.error(err);
    }

  };

  const fetchUser = async () => {
    try {
      const token =
        localStorage.getItem("token");

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

      const token =
        localStorage.getItem("token");

      await api.post(
        "/workspaces",
        {
          name: workspaceName
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      await fetchWorkspaces();

      setWorkspaceName("");

      setShowModal(false);

    } catch (err) {
      console.error(err);
    }

  };
  useEffect(() => {
    fetchUser();
    fetchWorkspaces();
  }, []);

  return (
    <div className="h-screen bg-zinc-50 flex">
      <Sidebar
        workspaces={workspaces}
        setShowModal={setShowModal}
        setSelectedWorkspace={setSelectedWorkspace}

      />
      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-8">
          <div className="bg-white rounded-3xl border h-full p-8">
            <h1 className="text-3xl font-bold">
              {
                selectedWorkspace ? (
                  <h1 className="text-3xl font-bold">
                    {selectedWorkspace.name}
                  </h1>
                ) : (
                  <h1 className="text-3xl font-bold">
                    Select a Workspace
                  </h1>
                )
              }
            </h1>

          </div>
        </main>
      </div>
      {
        showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 w-96">

              <h2 className="text-xl font-semibold mb-4">
                Create Workspace
              </h2>

              <input
                value={workspaceName}
                onChange={(e) =>
                  setWorkspaceName(e.target.value)
                }
                placeholder="Workspace Name"
                className="w-full border rounded-lg p-3"
              />

              <div className="flex gap-3 mt-4">

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 border rounded-lg py-2"
                >
                  Cancel
                </button>

                <button onClick={createWorkspace}
                  className="flex-1 bg-black text-white rounded-lg py-2"
                >
                  Create
                </button>

              </div>

            </div>
          </div>
        )
      }
    </div>

  );
};

export default Dashboard;