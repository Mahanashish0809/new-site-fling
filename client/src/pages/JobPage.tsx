import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import JobSearchBar from "../components/JobSearchBar";
import JobFiltersSidebar from "../components/JobFilterSidebar";
import JobList from "../components/JobList";
import { Job } from "../components/JobCard";

// ✅ Decode JWT safely
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

// ✅ Helper: Format username
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

  // ✅ Decode user token
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

  // ✅ Filters (includes salary dropdown + experience)
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    mode: "",
    jobTypes: [] as string[],
    salary: null as number | null, // in thousands
    experience: [] as string[],
  });

  // ✅ Job data (sample)
  const [jobs] = useState<Job[]>([
    {
      id: "1",
      title: "Full Stack Developer",
      company: "Google",
      location: "San Francisco, CA",
      type: "Full-Time",
      salary: "$100k - $120k",
      posted: "3 days ago",
      description: "Design and build scalable web applications using React and Node.js.",
      mode: "Remote",
      experience: "Senior Level",
    },
    {
      id: "2",
      title: "Backend Engineer",
      company: "Amazon",
      location: "Austin, TX",
      type: "CO-OP",
      salary: "$90k - $110k",
      posted: "5 days ago",
      description: "Develop and maintain backend services and APIs in a cloud environment.",
      mode: "Hybrid",
      experience: "Mid Level",
    },
    {
      id: "3",
      title: "Data Analyst",
      company: "Meta",
      location: "New York, NY",
      type: "Internship",
      salary: "$25/hr",
      posted: "2 days ago",
      description: "Analyze business data and provide insights for product teams.",
      mode: "On-site",
      experience: "Entry Level",
    },
  ]);

  const handleClear = () =>
    setFilters({
      keyword: "",
      location: "",
      category: "",
      mode: "",
      jobTypes: [],
      salary: null,
      experience: [],
    });

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, keyword: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ Navbar */}
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
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

      {/* ✅ Main Page */}
      <main className="p-6 flex flex-col gap-6 flex-1">
        <JobSearchBar
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        <div className="flex gap-6">
          <JobFiltersSidebar filters={filters} setFilters={setFilters} />
          <JobList jobs={jobs} filters={filters} />
        </div>
      </main>
    </div>
  );
};

export default JobPage;
