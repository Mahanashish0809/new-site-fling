import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const LoginSignup: React.FC = () => {
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

  // Inside handleSubmit()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Load API base URL from env
    const API_URL = import.meta.env.VITE_API_URL;
    const endpoint = isLogin ? `${API_URL}/login` : `${API_URL}/signup`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      if (!res.ok) throw new Error(data.error || data.message || "Request failed");

      if (isLogin) {
        localStorage.setItem("token", data.token); // save JWT if returned
        alert("Logged in successfully!");
        navigate("/");
      } else {
        alert("Signup successful!");
        navigate("/otp", { state: { email: form.email } });
      }
    } catch (err) {
      console.error("Frontend error:", err);
      alert(err.message || "Something went wrong!");
    }
  };



  return (
   
    <div className="h-screen flex items-center justify-center 
    bg-gradient-to-b from-[#0b132b] to-[#1c2541] text-white px-6 py-8">

      {/* 🟠 CHANGED: Modern dark card with rounded edges and subtle border */}
      <Card className="w-full max-w-md bg-[#1b1b2f] border border-[#282846] 
      shadow-2xl rounded-3xl p-10">

        {/* 🟠 CHANGED: Header with orange title and gray subtitle */}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-[#ff9f1c]">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </CardTitle>
          <p className="text-gray-400 mt-2 text-sm">
            {isLogin
              ? "Sign in to continue building the future with JoltQ."
              : "Join the JoltQ community today!"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="username" className="text-gray-300">
                  Username
                </Label>
                {/* 🟠 CHANGED: Input with dark background + orange focus */}
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="bg-[#0b132b] border border-gray-600 text-white 
                  placeholder-gray-500 focus:border-[#ff9f1c] focus:ring-[#ff9f1c]"
                />
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-[#0b132b] border border-gray-600 text-white 
                placeholder-gray-500 focus:border-[#ff9f1c] focus:ring-[#ff9f1c]"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-[#0b132b] border border-gray-600 text-white 
                placeholder-gray-500 focus:border-[#ff9f1c] focus:ring-[#ff9f1c]"
              />
            </div>

            {/* 🟠 CHANGED: Orange button with hover transition */}
            <Button
              type="submit"
              className="w-full mt-3 bg-[#ff9f1c] hover:bg-[#ffa733] 
              text-[#0b132b] font-semibold rounded-lg transition-all"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            {/* 🟠 CHANGED: Gray text with orange link */}
            <p className="text-center text-sm text-gray-400 mt-3">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#ff9f1c] font-medium hover:underline cursor-pointer"
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
