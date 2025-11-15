import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { DollarSign, MapPin, Home, Clock } from "lucide-react";

// Job interface is defined here – do NOT import it
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  featured?: boolean;
  logo?: string;
  mode: string;
  experience?: string;
}

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const navigate = useNavigate();

  const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toast.success(`Application submitted for ${job.title}`);
  };

  return (
    <Card
      onClick={() => navigate(`/job/${job.id}`)}
      className="w-full flex flex-col p-5 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {job.featured && (
              <Badge className="bg-accent text-accent-foreground">Featured</Badge>
            )}
            <Badge variant="secondary">{job.type}</Badge>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company}</p>
        </div>

        {job.logo && (
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl font-bold text-primary">
            {job.logo}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-6 mt-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Home className="w-4 h-4 text-gray-500" />
          <span>{job.mode}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>{job.posted}</span>
        </div>
      </div>

      <p className="text-sm text-gray-700 mt-3 line-clamp-2">
        {job.description || "No description provided."}
      </p>

      <div className="flex justify-end gap-3 mt-5">
        <Button
          size="sm"
          variant="outline"
          className="text-sm text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/job/${job.id}`);
          }}
        >
          View Details
        </Button>

        <Button
          size="sm"
          className="text-sm bg-green-600 hover:bg-green-700 text-white"
          onClick={handleApply}
        >
          Apply
        </Button>
      </div>
    </Card>
  );
};
