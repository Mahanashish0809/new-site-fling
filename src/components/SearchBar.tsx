import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (keyword: string, location: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const keyword = formData.get("keyword") as string;
    const location = formData.get("location") as string;
    onSearch(keyword, location);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3 p-2 bg-card rounded-2xl shadow-hover border border-border">
        <div className="flex-1 flex items-center gap-2 px-4">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            name="keyword"
            placeholder="Job title, keywords, or company"
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent"
          />
        </div>
        <div className="hidden md:block w-px bg-border" />
        <div className="flex-1 flex items-center gap-2 px-4">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <Input
            name="location"
            placeholder="City, state, or remote"
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent"
          />
        </div>
        <Button 
          type="submit" 
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-xl"
        >
          Search Jobs
        </Button>
      </div>
    </form>
  );
};
