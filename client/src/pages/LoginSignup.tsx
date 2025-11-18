import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup 
} from "firebase/auth";
import { auth, googleProvider } from "../firebase"; // ✅ ensure correct firebase import path

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
        const firebaseToken = await userCred.user.getIdToken();

        const res = await fetch(`${import.meta.env.VITE_API_URL}api/auth/firebase-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: firebaseToken }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        // Store our backend JWT token
        localStorage.setItem("token", data.token || firebaseToken);
        console.log("✅ Login success:", data.user);
        navigate("/jobPage", { replace: true });
      } else {
        // 🔹 SIGNUP via Firebase
        const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const firebaseToken = await userCred.user.getIdToken();

        const res = await fetch(`${import.meta.env.VITE_API_URL}api/auth/firebase-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: firebaseToken }),
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

  // 🔹 Google Sign In Handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();

      // Send Firebase token to backend for verification and user creation
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/auth/firebase-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: firebaseToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google sign-in failed");

      // Store our backend JWT token (not Firebase token)
      localStorage.setItem("token", data.token || firebaseToken);
      console.log("✅ Google sign-in success:", data.user);
      console.log("Provider:", data.provider);
      navigate("/jobPage", { replace: true });
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      alert(err.message || "Google sign-in failed!");
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

            {/* 🔸 Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#101a3f] text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* 🔸 Google Sign In Button */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-3 border border-gray-300"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
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
