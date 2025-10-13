import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { JobCard } from "@/components/JobCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { sampleJobs } from "@/data/sampleJobs";
import { Briefcase, TrendingUp, Users, Zap } from "lucide-react";

const Index = () => {
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs);

  const handleSearch = (keyword: string, location: string) => {
    const filtered = sampleJobs.filter((job) => {
      const matchesKeyword = keyword
        ? job.title.toLowerCase().includes(keyword.toLowerCase()) ||
          job.company.toLowerCase().includes(keyword.toLowerCase()) ||
          job.description.toLowerCase().includes(keyword.toLowerCase())
        : true;
      
      const matchesLocation = location
        ? job.location.toLowerCase().includes(location.toLowerCase())
        : true;

      return matchesKeyword && matchesLocation;
    });
    setFilteredJobs(filtered);
  };

  const handleFilterChange = (filters: any) => {
    // Filter logic will be implemented here
    console.log("Filters changed:", filters);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Discover opportunities from thousands of companies worldwide
            </p>
          </div>
          <SearchBar onSearch={handleSearch} />
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Briefcase className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-1">10,000+</div>
              <div className="text-white/80">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-1">5,000+</div>
              <div className="text-white/80">Companies</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-1">98%</div>
              <div className="text-white/80">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Zap className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-1">Real-time</div>
              <div className="text-white/80">Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </aside>

            {/* Job Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {filteredJobs.length} Jobs Found
                </h2>
                <p className="text-muted-foreground">
                  Browse through our latest job openings
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <div className="text-center py-16">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    No jobs found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
