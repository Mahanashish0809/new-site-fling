import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { sampleJobs } from "@/data/sampleJobs";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Share2,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = sampleJobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Job not found</h1>
          <Button onClick={() => navigate("/")}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    toast.success("Application submitted successfully!");
  };

  const handleSave = () => {
    toast.success("Job saved to your favorites!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Job link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-8 px-4">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex gap-6">
              {job.logo && (
                <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center text-3xl font-bold text-primary shrink-0">
                  {job.logo}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {job.featured && (
                    <Badge className="bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {job.type}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
                <p className="text-xl text-white/90">{job.company}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSave}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-foreground/80 leading-relaxed">
                  {job.description}
                </p>
                
                <h3 className="text-foreground font-semibold mt-6 mb-3">Responsibilities</h3>
                <ul className="text-foreground/80 space-y-2">
                  <li>Design and implement robust, scalable applications</li>
                  <li>Collaborate with cross-functional teams to define and ship new features</li>
                  <li>Write clean, maintainable code following best practices</li>
                  <li>Participate in code reviews and mentor junior developers</li>
                  <li>Stay up-to-date with emerging technologies and industry trends</li>
                </ul>

                <h3 className="text-foreground font-semibold mt-6 mb-3">Requirements</h3>
                <ul className="text-foreground/80 space-y-2">
                  <li>5+ years of experience in software development</li>
                  <li>Strong proficiency in modern web technologies</li>
                  <li>Experience with agile development methodologies</li>
                  <li>Excellent problem-solving and communication skills</li>
                  <li>Bachelor's degree in Computer Science or related field</li>
                </ul>

                <h3 className="text-foreground font-semibold mt-6 mb-3">Benefits</h3>
                <ul className="text-foreground/80 space-y-2">
                  <li>Competitive salary and equity package</li>
                  <li>Comprehensive health, dental, and vision insurance</li>
                  <li>401(k) matching and retirement benefits</li>
                  <li>Flexible work arrangements and unlimited PTO</li>
                  <li>Professional development opportunities</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-card sticky top-4">
              <CardContent className="pt-6">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-4 h-12 text-lg"
                  onClick={handleApply}
                >
                  Apply Now
                </Button>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-foreground mb-1">Location</div>
                      <div className="text-sm text-muted-foreground">{job.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-foreground mb-1">Salary Range</div>
                      <div className="text-sm text-muted-foreground">{job.salary}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-foreground mb-1">Job Type</div>
                      <div className="text-sm text-muted-foreground">{job.type}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-foreground mb-1">Posted</div>
                      <div className="text-sm text-muted-foreground">{job.posted}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-foreground mb-1">Company</div>
                      <div className="text-sm text-muted-foreground">{job.company}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
