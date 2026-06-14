import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/layout/AuthShell";
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
    <AuthShell
      title="Create account"
      subtitle="Start your WorkChat workspace in a few seconds."
    >
        <form
          onSubmit={handleRegister}
          className="mt-8 space-y-4"
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-neutral-500">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-semibold text-blue-600 transition hover:text-blue-500"
          >
            Login
          </Link>
        </p>
    </AuthShell>
  );
};

export default Register;
