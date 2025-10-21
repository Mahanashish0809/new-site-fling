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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-[#0A2540]">
            Verify OTP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="otp">Enter the 6-digit code sent to your email</Label>
              <Input
                id="otp"
                name="otp"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Verify
            </Button>

            <p className="text-center text-sm text-gray-500 mt-3">
              Didn’t receive the code?{" "}
              <span
                className="text-blue-600 font-medium hover:underline cursor-pointer"
                onClick={() => alert("Resend OTP logic will be added soon!")}
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