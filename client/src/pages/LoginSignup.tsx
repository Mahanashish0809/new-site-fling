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
  const endpoint = isLogin ? "/api/login" : "/api/signup";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Request failed");

    if (isLogin) {
      alert("Logged in successfully!");
      navigate("/");
    } else {
      // After signup → redirect to OTP page with email
      navigate("/otp", { state: { email: form.email } });
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong!");
  }
};


  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-[#0A2540]">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-3">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-medium hover:underline cursor-pointer"
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
