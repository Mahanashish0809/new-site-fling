import React from "react";
import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import JobList from "../components/JobList";

// Match backend structure
export interface Job {
  job_id: number;
  title: string;
  company_name: string;
  location: string;
  job_url: string;
  updated_at: string;
}

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  // Calculate days since update
  const updatedDate = new Date(job.updated_at);
  const today = new Date();
  const diffTime = today.getTime() - updatedDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      className="bg-white p-5 rounded-xl shadow-md flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer"
      whileHover={{ scale: 1.01 }}
      onClick={() => window.open(job.job_url, "_blank")}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{job.title}</h3>
      </div>

      <p className="text-sm text-gray-600">{job.company_name}</p>

      <div className="text-sm text-gray-600 flex gap-4 items-center">
        <MapPin size={16} /> {job.location}
      </div>

      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">
          Updated {diffDays} days ago
        </span>

        <ExternalLink size={16} className="text-blue-500" />
      </div>
    </motion.div>
  );
};

export default JobCard;
