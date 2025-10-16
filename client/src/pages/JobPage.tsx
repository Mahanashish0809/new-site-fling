import React, { useState } from "react";
import JobSearchBar from "../components/JobSearchBar";
import JobFiltersSidebar from "../components/JobFilterSidebar";
import JobList from "../components/JobList";
import { Job } from "../components/JobPost";

const JobPage: React.FC = () => {
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

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
  };

  const handleClear = () => {
    setFilters({ keyword: "", location: "", category: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6">
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
    </div>
  );
};

export default JobPage;
