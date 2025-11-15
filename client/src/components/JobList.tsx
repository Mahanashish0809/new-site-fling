import React, { useEffect, useState } from "react";
import {JobCard, Job } from "./JobCard";

interface JobListProps {
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

const JobList: React.FC<JobListProps> = ({ filters }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        let rawJobs: any[] = [];

        if (Array.isArray(data)) rawJobs = data;
        else if (Array.isArray(data.jobs)) rawJobs = data.jobs;
        else console.error("Invalid API response format");

        // Map backend → JobCard interface
        const mappedJobs: Job[] = rawJobs.map((r: any) => ({
          id: String(r.job_id),
          title: r.title,
          company: r.company_name,
          location: r.location,

          // Fields backend doesn't provide → fallback values
          category: "General",
          type: "Full-Time",
          salary: "Not specified",
          posted: r.updated_at,
          description: "No description provided.",
          featured: false,
          logo: r.company_name ? r.company_name[0].toUpperCase() : "",
          mode: "On-site",
          experience: "Any",
        }));

        setJobs(mappedJobs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const keywordMatch =
      !filters.keyword ||
      job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.keyword.toLowerCase());

    const locationMatch =
      !filters.location ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    return keywordMatch && locationMatch;
  });

  if (loading) {
    return (
      <p className="text-gray-600 text-center py-6">Loading jobs...</p>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))
      ) : (
        <p className="text-gray-500 text-center py-8">
          No jobs found.
        </p>
      )}
    </div>
  );
};

export default JobList;
