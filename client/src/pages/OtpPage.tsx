import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";

const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          setEmailSent(true);
          alert(`Verification link sent to ${email}. Please check your inbox.`);
        })
        .catch((err) => alert("Failed to send verification email: " + err.message));
    }
  }, []);

  const handleContinue = async () => {
    await auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified) {
      alert("✅ Email verified successfully!");
      navigate("/login");
    } else {
      alert("Email not verified yet. Please verify and try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0A0F1C] text-white">
      <Card className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 z-10 text-white">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-white">
            Verify Your Email
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-white/80">
            {emailSent
              ? `A verification link has been sent to ${email}.`
              : "Sending verification link..."}
          </p>

          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white font-semibold text-lg py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/40"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpPage;
