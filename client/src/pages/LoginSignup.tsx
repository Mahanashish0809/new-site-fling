import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // ✅ ensure correct firebase import path

const LoginSignup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // 🔹 LOGIN via Firebase
        const userCred = await signInWithEmailAndPassword(auth, form.email, form.password);
        const token = await userCred.user.getIdToken();

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/firebase-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        localStorage.setItem("token", token);
        console.log("✅ Login success:", data.user);
        navigate("/jobPage", { replace: true });
      } else {
        // 🔹 SIGNUP via Firebase
        const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const token = await userCred.user.getIdToken();

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/firebase-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");

        console.log("✅ Signup success:", data.user);
        navigate("/otp", {
          state: { email: form.email, devOtp: data.devOtp || "" },
        });
      }
    } catch (err: any) {
      console.error("Firebase error:", err);
      alert(err.message || "Something went wrong!");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0F24] to-[#0A2540] overflow-hidden text-white">
      {/* 🔸 Glowing background spheres */}
      <div className="absolute top-20 left-32 w-72 h-72 bg-gradient-to-r from-orange-600 to-yellow-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-32 w-80 h-80 bg-gradient-to-r from-purple-700 to-indigo-500 rounded-full opacity-25 blur-3xl animate-pulse"></div>

      {/* 🔹 Main card */}
      <Card className="relative w-full max-w-2xl bg-[#101a3f]/90 border border-gray-700 shadow-2xl rounded-2xl p-10 backdrop-blur-md z-10">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-extrabold text-white drop-shadow-md">
            {isLogin ? "Welcome Back" : "Create Your JoltQ Account"}
          </CardTitle>
          <p className="text-center text-gray-400 mt-2">
            {isLogin
              ? "Log in to continue your AI-powered career journey."
              : "Sign up to explore personalized job recommendations."}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  className="bg-[#0d1636] text-white border-gray-600 focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="bg-[#0d1636] text-white border-gray-600 focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                required
              />
            </div>

            <div className="space-y-1 relative">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-[#0d1636] text-white border-gray-600 focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* 🔸 Submit button */}
            <Button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 text-lg rounded-xl transition-all duration-300"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-gray-400 mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-orange-400 font-medium hover:underline cursor-pointer"
              >
                {isLogin ? "Sign up" : "Login"}
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginSignup;
