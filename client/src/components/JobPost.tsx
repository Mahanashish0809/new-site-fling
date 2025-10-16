import React from "react";
import { motion } from "framer-motion";
import { MapPin, DollarSign } from "lucide-react";

export interface Job {
  title: string;
  type: string;
  location: string;
  salary: string;
  daysLeft: number;
}

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <motion.div
      className="bg-white p-5 rounded-xl shadow-md flex flex-col gap-2 hover:shadow-lg transition-shadow"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
          {job.type}
        </span>
      </div>
      <div className="text-sm text-gray-600 flex gap-4 items-center">
        <MapPin size={16} /> {job.location}
        <DollarSign size={16} /> {job.salary}
      </div>
      <div className="flex justify-end">
        <span className="text-xs text-gray-500">
          {job.daysLeft} days left to apply
        </span>
      </div>
    </motion.div>
  );
};

export default JobCard;
