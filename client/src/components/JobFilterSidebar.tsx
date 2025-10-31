import React from "react";

interface JobFiltersSidebarProps {
  filters: {
    keyword: string;
    location: string;
    category: string;
    mode: string;
    jobTypes: string[];
    salary: number;
    experience: string[];
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      keyword: string;
      location: string;
      category: string;
      mode: string;
      jobTypes: string[];
      salary: number;
      experience: string[];
    }>
  >;
}

const JobFiltersSidebar: React.FC<JobFiltersSidebarProps> = ({ filters, setFilters }) => {
  const jobTypes = ["Full-Time", "Part-Time", "Internship", "Contract"];
  const experiences = ["Entry Level", "Mid Level", "Senior Level"];

  const handleJobTypeChange = (type: string) => {
    const updated = filters.jobTypes.includes(type)
      ? filters.jobTypes.filter((t) => t !== type)
      : [...filters.jobTypes, type];
    setFilters({ ...filters, jobTypes: updated });
  };

  const handleExperienceChange = (exp: string) => {
    const updated = filters.experience.includes(exp)
      ? filters.experience.filter((e) => e !== exp)
      : [...filters.experience, exp];
    setFilters({ ...filters, experience: updated });
  };

  return (
    <div className="w-1/4 bg-white p-5 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-3">Filters</h3>

      {/* ✅ Job Type Filter */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Job Type</h4>
        {jobTypes.map((type) => (
          <label key={type} className="block text-sm mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.jobTypes.includes(type)}
              onChange={() => handleJobTypeChange(type)}
              className="mr-2 accent-blue-600 cursor-pointer"
            />
            {type}
          </label>
        ))}
      </div>

      {/* ✅ Salary Dropdown with 'All' option */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Minimum Salary</h4>
        <select
          value={filters.salary || ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              salary: e.target.value ? Number(e.target.value) : null, // null means “no filter”
            })
          }
          className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Salaries</option> {/* 👈 Blank Option */}
          {[40, 50, 60, 70, 80, 90, 100,110,120,130,140,150,160].map((val) => (
            <option key={val} value={val}>
              ${val}k
            </option>
          ))}
        </select>

        <p className="text-sm text-blue-600 font-semibold mt-1">
          {filters.salary ? `Showing jobs above $${filters.salary}k` : "Showing all jobs"}
        </p>
      </div>


      {/* ✅ Experience Filter */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Experience</h4>
        {experiences.map((exp) => (
          <label key={exp} className="block text-sm mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.experience.includes(exp)}
              onChange={() => handleExperienceChange(exp)}
              className="mr-2 accent-blue-600 cursor-pointer"
            />
            {exp}
          </label>
        ))}
      </div>

      {/* ✅ Mode of Work */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Mode of Work</h4>
        <select
          value={filters.mode}
          onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
          className="border border-gray-300 rounded-lg p-2 w-full"
        >
          <option value="">All</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>
      </div>
    </div>
  );
};

export default JobFiltersSidebar;
