import React from "react";
import { JobCard, Job } from "./JobCard";

interface JobListProps {
  jobs: Job[];
  filters: {
    keyword: string;
    location: string;
    category: string;
    mode: string;
    jobTypes: string[];
    salary: number | null;
    experience: string[];
  };
}

const JobList: React.FC<JobListProps> = ({ jobs, filters }) => {
  const [sortOption, setSortOption] = React.useState("Recommended");

  const filteredJobs = jobs.filter((job) => {
    const keywordMatch =
      filters.keyword === "" ||
      job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.keyword.toLowerCase());

    const locationMatch =
      filters.location === "" ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    const experienceMatch =
      filters.experience.length === 0 ||
      filters.experience.includes(job.experience);

    return keywordMatch && locationMatch && experienceMatch;
  });

  const sortedJobs = React.useMemo(() => {
    const sorted = [...filteredJobs];
    if (sortOption === "Recent") {
      sorted.sort((a, b) => a.posted.localeCompare(b.posted));
    } else if (sortOption === "TopMatched") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [sortOption, filteredJobs]);

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

      {sortedJobs.length > 0 ? (
        sortedJobs.map((job) => <JobCard key={job.id} job={job} />)
      ) : (
        <p className="text-gray-500 text-center py-8">No jobs found.</p>
      )}
    </div>
  );
};

export default JobList;
