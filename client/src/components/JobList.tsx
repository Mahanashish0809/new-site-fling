import React from "react";
import JobCard, { Job } from "./JobPost";

interface Props {
  jobs: Job[];
}

const JobList: React.FC<Props> = ({ jobs }) => {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{jobs.length} Jobs Found</h2>
        <div className="flex gap-3">
          {["Recommended", "Recent", "Top Matched"].map((filter) => (
            <button
              key={filter}
              className="px-4 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {jobs.map((job, idx) => (
        <JobCard key={idx} job={job} />
      ))}
    </div>
  );
};

export default JobList;
