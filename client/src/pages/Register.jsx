import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border">
        <h1 className="text-3xl font-bold mb-2">
          Create Account
        </h1>

        <p className="text-zinc-500 mb-8">
          Start using WorkChat
        </p>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full border rounded-xl px-4 py-3"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl px-4 py-3"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl px-4 py-3"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <button className="w-full bg-black text-white py-3 rounded-xl">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-500">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-medium text-black"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;