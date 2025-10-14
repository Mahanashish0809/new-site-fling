import { Header } from "@/components/Header";
import { Briefcase, TrendingUp, Users, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-6xl md:text-7xl font-bold mb-2 tracking-tight">
                <span className="text-[#0A2540]">Jolt</span>
                <span className="text-[#FF6B35]">Q</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-medium">
                The Cutting Edge Job Search
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 mt-8">
              Find Your Dream Job
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Discover opportunities from thousands of companies worldwide
            </p>
          </div>
          
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
    </div>
  );
};

export default Index;
