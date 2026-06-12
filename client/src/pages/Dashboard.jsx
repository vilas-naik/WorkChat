import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
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

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border p-8">
        <h1 className="text-3xl font-bold">
          WorkChat
        </h1>

        <p className="mt-4">
          Welcome{" "}
          <span className="font-semibold">
            {user?.name}
          </span>
        </p>

        <p className="text-zinc-500 mt-2">
          {user?.email}
        </p>

        <button
          onClick={logout}
          className="mt-8 bg-black text-white px-5 py-3 rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;