import React from "react";
import { JobCard, Job } from "./JobCard";

interface Props {
  jobs: Job[];
}

const JobList: React.FC<Props> = ({ jobs }) => {
  const [sortOption, setSortOption] = React.useState("Recommended");

  // ✅ Sort jobs safely using existing fields
  const sortedJobs = React.useMemo(() => {
    const sorted = [...jobs];

    if (sortOption === "Recent") {
      // Example: sort by 'posted' string (you can adjust if you store timestamps)
      sorted.sort((a, b) => a.posted.localeCompare(b.posted));
    } else if (sortOption === "TopMatched") {
      // Example: alphabetical sort by title
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [sortOption, jobs]);

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* ✅ Sort dropdown aligned right */}
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

      {/* ✅ Job Cards */}
      {sortedJobs.length > 0 ? (
        sortedJobs.map((job) => <JobCard key={job.id} job={job} />)
      ) : (
        <p className="text-gray-500 text-center py-8">No jobs found.</p>
      )}
    </div>
  );
};

export default JobList;
