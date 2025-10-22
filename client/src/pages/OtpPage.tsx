import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const devOtp = location.state?.devOtp || "";
  const [otp, setOtp] = useState(devOtp); // will auto-fill for dev

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.message || "Invalid OTP");

      alert("OTP verified successfully!");
      navigate("/login");
    } catch (err: any) {
      alert(err.message || "Invalid or expired OTP!");
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0F1C]">
      {/* --- Glowing Background Spheres --- */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 🟠 Left orange glow */}
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-orange-500/30 to-yellow-400/20 rounded-full blur-3xl top-20 left-10 animate-pulse" />
        {/* 🔵 Right purple-blue glow */}
        <div className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse delay-200" />
        {/* 🔵 Center subtle cyan tint */}
        <div className="absolute w-[300px] h-[300px] bg-cyan-400/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-700" />
      </div>

      {/* --- OTP Card --- */}
      <Card className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 z-10 text-white">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-white">
            Verify OTP
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="otp"
                className="text-white/80 text-sm font-medium tracking-wide"
              >
                Enter the 6-digit code sent to your email
              </Label>
              <Input
                id="otp"
                name="otp"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="text-center text-lg font-semibold tracking-widest bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* 🟠 Orange gradient Verify button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white font-semibold text-lg py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/40"
            >
              Verify
            </Button>

            <p className="text-center text-sm text-white/70 mt-4">
              Didn’t receive the code?{" "}
              <span
                className="text-orange-400 font-semibold hover:underline cursor-pointer"
                onClick={() => alert('Resend OTP logic will be added soon!')}
              >
                Resend OTP
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpPage;
