import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  featured?: boolean;
  logo?: string;
}

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer bg-gradient-card border-border hover:border-primary/50"
      onClick={() => navigate(`/job/${job.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {job.featured && (
                <Badge className="bg-accent text-accent-foreground">Featured</Badge>
              )}
              <Badge variant="secondary">{job.type}</Badge>
            </div>
            <CardTitle className="text-xl mb-1 text-foreground hover:text-primary transition-colors">
              {job.title}
            </CardTitle>
            <p className="text-muted-foreground font-medium">{job.company}</p>
          </div>
          {job.logo && (
            <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-2xl font-bold text-primary">
              {job.logo}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Posted {job.posted}</span>
          </div>
        </div>
        <p className="text-sm text-foreground/80 line-clamp-2 mb-4">
          {job.description}
        </p>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/job/${job.id}`);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
