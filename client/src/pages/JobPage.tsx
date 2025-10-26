import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import JobSearchBar from "../components/JobSearchBar";
import JobFiltersSidebar from "../components/JobFilterSidebar";
import JobList from "../components/JobList";
import { Job } from "../components/JobPost";
import { Button } from "@/components/ui/button";

// ✅ Helper to decode JWT safely
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

// ✅ Helper: Extract full first name (truncate only if over 15 chars)
const formatDisplayName = (name: string | undefined): string => {
  if (!name) return "User";
  let displayName = name.includes("@") ? name.split("@")[0] : name.trim().split(" ")[0];
  displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  if (displayName.length > 15) displayName = displayName.slice(0, 15) + "...";
  return displayName;
};

const JobPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email?: string; username?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Decode and verify token
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
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          JoltQ
        </h1>

        {/* ✅ User Dropdown */}
        <div className="relative flex items-center gap-4" ref={dropdownRef}>
          {user && (
            <div>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 text-gray-700 font-medium focus:outline-none"
              >
                <span>Welcome, {formatDisplayName(user.username || user.email)}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50 transition-all duration-200 ease-in-out transform origin-top">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    🧑‍💻 Profile
                  </button>
                  <button
                    onClick={() => navigate("/settings")}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    ⚙️ Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ✅ Main Page Content */}
      <main className="p-6 flex flex-col gap-6 flex-1">
        {/* ✅ Search Bar */}
        <JobSearchBar
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {/* ✅ Jobs & Filters */}
        <div className="flex gap-6">
          <JobFiltersSidebar />
          <JobList jobs={jobs} />
        </div>
      </main>
    </div>
  );
};

export default JobPage;
