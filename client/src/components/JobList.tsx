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
  const filteredJobs = jobs.filter((job) => {
    // ✅ Keyword search (title, company, description)
    const keywordMatch =
      !filters.keyword ||
      job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.keyword.toLowerCase());

    // ✅ Location filter
    const locationMatch =
      !filters.location ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    // ✅ Job type filter
    const jobTypeMatch =
      filters.jobTypes.length === 0 ||
      filters.jobTypes.includes(job.type);

    // ✅ Experience filter
    const experienceMatch =
      filters.experience.length === 0 ||
      filters.experience.includes(job.experience);

    // ✅ Mode filter
    const modeMatch =
      !filters.mode || job.mode === filters.mode;

    // ✅ Salary filter
    let salaryMatch = true;
    if (filters.salary !== null) {
      // Extract numeric salary ranges
      const match = job.salary.match(/\$?(\d+)/g);
      if (match && match.length >= 1) {
        const numbers = match.map((s) => parseInt(s.replace(/\D/g, ""), 10));
        const minSalary = Math.min(...numbers);
        const maxSalary = Math.max(...numbers);
        salaryMatch =
          filters.salary >= minSalary * 1000 && filters.salary <= maxSalary * 1000;
      }
    }

    // ✅ Combine all filters
    return (
      keywordMatch &&
      locationMatch &&
      jobTypeMatch &&
      experienceMatch &&
      modeMatch &&
      salaryMatch
    );
  });

  return (
    <div className="flex-1 flex flex-col gap-4">
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
      ) : (
        <p className="text-gray-500 text-center py-8">No jobs found.</p>
      )}
    </div>
  );
};

export default JobList;
