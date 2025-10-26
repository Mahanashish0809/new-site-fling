import React from "react";
import JobCard, { Job } from "./JobPost";

interface Props {
  jobs: Job[];
}

const JobList: React.FC<Props> = ({ jobs }) => {
  const [sortOption, setSortOption] = React.useState("Recommended");
  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex justify-end mb-2">
        <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="Recommended">Recommended</option>
            <option value="Recent">Recent</option>
            <option value="TopMatched">Top Matched</option>
          </select>
        </div>

      {jobs.map((job, idx) => (
        <JobCard key={idx} job={job} />
      ))}
    </div>
  );
};

export default JobList;
