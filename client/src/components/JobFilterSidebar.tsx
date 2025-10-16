import React from "react";

const JobFiltersSidebar: React.FC = () => {
  return (
    <div className="w-1/4 bg-white p-5 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-3">Filters</h3>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Job Type</h4>
        {["Full-Time", "Part-Time", "Remote", "Internship"].map((type) => (
          <label key={type} className="block text-sm mb-1">
            <input type="checkbox" className="mr-2" /> {type}
          </label>
        ))}
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Salary Range</h4>
        <select className="border border-gray-300 rounded-lg p-2 w-full">
          <option>All</option>
          <option>$40k - $60k</option>
          <option>$60k - $80k</option>
          <option>$80k - $100k</option>
        </select>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Experience</h4>
        {["Entry Level", "Mid Level", "Senior Level"].map((exp) => (
          <label key={exp} className="block text-sm mb-1">
            <input type="checkbox" className="mr-2" /> {exp}
          </label>
        ))}
      </div>

      <div>
        <h4 className="font-medium mb-2">Career Level</h4>
        <select className="border border-gray-300 rounded-lg p-2 w-full">
          <option>All</option>
          <option>Junior</option>
          <option>Associate</option>
          <option>Manager</option>
        </select>
      </div>
    </div>
  );
};

export default JobFiltersSidebar;
