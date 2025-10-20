import React from 'react';
import { Target, Users, Sparkles, Code, Linkedin, Github, Twitter } from 'lucide-react';

// A reusable component for team member cards
const TeamMemberCard = ({ name, role, bio, imageUrl }) => (
  <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg">
    <img 
      src={imageUrl} 
      alt={`Portrait of ${name}`}
      className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-700 object-cover"
    />
    <h3 className="text-xl font-semibold text-white">{name}</h3>
    <p className="text-orange-400 mb-3">{role}</p>
    <p className="text-gray-400 text-sm flex-grow">{bio}</p>
    <div className="flex justify-center gap-4 mt-5">
      <a href="#" aria-label={`${name}'s Twitter`} className="text-gray-400 hover:text-orange-500 transition-colors"><Twitter className="w-5 h-5" /></a>
      <a href="#" aria-label={`${name}'s LinkedIn`} className="text-gray-400 hover:text-orange-500 transition-colors"><Linkedin className="w-5 h-5" /></a>
      <a href="#" aria-label={`${name}'s GitHub`} className="text-gray-400 hover:text-orange-500 transition-colors"><Github className="w-5 h-5" /></a>
    </div>
  </div>
);

// A reusable component for displaying company values
const ValueCard = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="bg-slate-800/80 p-3 rounded-full border border-slate-700">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-lg text-white">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    </div>
);


const AboutPage = () => {
  return (
    <div className="relative min-h-screen bg-slate-900 text-white overflow-x-hidden p-4 sm:p-8 md:p-12">
      
      {/* Background glowing spheres */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-20 -right-4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto z-10 space-y-20">

        {/* Header Section */}
        <header className="text-center pt-16 pb-8">
          <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500 pb-2">
            About JoltQ
          </h1>
          <p className="text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
            We are a team of passionate innovators dedicated to building the future of technology, one line of code at a time.
          </p>
        </header>

        {/* Mission and Values Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 shadow-2xl rounded-3xl p-8 md:p-10">
                <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                    Our MISSION IS MISSION IMPOSSIBLE 2025
                </p>
                <p className="text-gray-300 leading-relaxed">
                    MI by IGC/MAB
                </p>
            </div>
            <div className="space-y-8">
               <ValueCard 
                    icon={<Target className="w-6 h-6 text-orange-400" />}
                    title="Purpose-Driven"
                    description="We build products that solve real-world problems and make a tangible impact."
               />
               <ValueCard 
                    icon={<Users className="w-6 h-6 text-cyan-400" />}
                    title="Customer-Centric"
                    description="Our users are at the heart of everything we do. Their success is our success."
               />
               <ValueCard 
                    icon={<Sparkles className="w-6 h-6 text-purple-400" />}
                    title="Innovation & Quality"
                    description="We are committed to continuous learning and excellence in every detail."
               />
            </div>
        </section>

        {/* Our Story Section */}
        <section className="text-center bg-slate-800/50 backdrop-blur-lg border border-slate-700 shadow-2xl rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
            <p className="text-gray-300 leading-relaxed max-w-4xl mx-auto">
                Founded in 2021 by a group of friends in a garage, JoltQ started with a simple idea: to help make people get good paying jobs.
            </p>
        </section>


        {/* Team Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white">Meet the Team</h2>
            <p className="text-gray-400 mt-3 text-lg">The brilliant minds behind our success.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <TeamMemberCard 
              name="MAB" 
              role="CHAIRMAN" 
              bio="MODEL MODEL SUPER MODEL." 
              imageUrl="https://placehold.co/200x200/1e293b/fb923c?text=AM"
            />
            <TeamMemberCard 
              name="IGC" 
              role="CEO" 
              bio="OKA VISION OKA CLARITY UNNODU." 
              imageUrl="https://placehold.co/200x200/1e293b/67e8f9?text=JL"
            />
            <TeamMemberCard 
              name="DJT" 
              role="INVESTER" 
              bio="MENTAL😁" 
              imageUrl="https://placehold.co/200x200/1e293b/c084fc?text=SC"
            />
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
