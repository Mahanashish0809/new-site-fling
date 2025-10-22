import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobSearchBar from "../components/JobSearchBar";
import JobFiltersSidebar from "../components/JobFilterSidebar";
import JobList from "../components/JobList";
import { Job } from "../components/JobPost";
import { Button } from "@/components/ui/button";

// Optional helper to decode JWT payload safely
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const JobPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email?: string; username?: string } | null>(null);

  // ✅ Redirect if not logged in and extract user info from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = decodeToken(token);
    if (decoded) {
      setUser({ email: decoded.email, username: decoded.username });
    } else {
      // Invalid token — logout
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
  });

  const [jobs] = useState<Job[]>([
    {
      title: "Full Stack Developer",
      type: "Full-Time",
      location: "San Francisco, CA",
      salary: "$100k - $120k",
      daysLeft: 5,
    },
    {
      title: "Backend Engineer",
      type: "Remote",
      location: "Austin, TX",
      salary: "$90k - $110k",
      daysLeft: 12,
    },
    {
      title: "Data Analyst",
      type: "Internship",
      location: "New York, NY",
      salary: "$25/hr",
      daysLeft: 2,
    },
  ]);

  const handleSearch = () => console.log("Searching with filters:", filters);
  const handleClear = () => setFilters({ keyword: "", location: "", category: "" });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ Top Menubar */}
      <header className="w-full bg-white shadow-md py-3 px-6 flex justify-between items-center border-b border-gray-200">
        <h1
          onClick={() => navigate("/jobPage")}
          className="text-xl font-bold text-[#0A2540] cursor-pointer"
        >
          Job Aggregator
        </h1>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-gray-700 font-medium">
              Welcome, {user.username || user.email}
            </span>
          )}
          <Button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* ✅ Main Page Content */}
      <main className="p-6 flex flex-col gap-6 flex-1">
        <JobSearchBar
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        <div className="flex gap-6">
          <JobFiltersSidebar />
          <JobList jobs={jobs} />
        </div>
      </main>
    </div>
  );
};

export default JobPage;
