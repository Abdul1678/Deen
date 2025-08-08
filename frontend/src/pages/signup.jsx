import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import supabase from "../client";

export default function Signup() {
  const [alert, setAlert] = useState({ show: false, message: "" });
  const navigate = useNavigate();

  const showAlert = ({ message, show }) => {
    setAlert({ message, show });
  };

  // Alert component
  function SignupAlert({ alert, showAlert }) {
    if (!alert.show) return null;
    return (
      <div className="alert alert-error mb-4">
        <div className="inline-flex justify-between items-center w-full">
          <span>{alert.message}</span>
          <button
            onClick={() => showAlert({ message: "", show: false })}
            className="btn btn-ghost btn-circle"
          >
            X
          </button>
        </div>
      </div>
    );
  }

  // Signup form component
  function SignupForm({ showAlert }) {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      defaultValues: {
        username: "",
        email: "",
        password: "",
      },
    });

    const signupUser = async (values) => {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
          },
        },
      });

      if (error) {
        showAlert({ message: error.message, show: true });
      } else {
        showAlert({ message: "Check your email for confirmation!", show: true });
        
      }
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit(signupUser)}>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="input input-bordered w-full"
            {...register("username", { required: true })}
          />
          {errors.username && <p className="text-red-500 text-sm">Username is required</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input input-bordered w-full"
            {...register("email", { required: true })}
          />
          {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input input-bordered w-full"
            {...register("password", { required: true })}
          />
          {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Signup
        </button>
      </form>
    );
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        <SignupAlert alert={alert} showAlert={showAlert} />
        <SignupForm showAlert={showAlert} />

        <p className="mt-4 text-center text-sm">
          Have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
