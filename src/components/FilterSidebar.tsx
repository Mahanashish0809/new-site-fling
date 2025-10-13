import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

export const FilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"];
  const salaryRanges = ["$0 - $50k", "$50k - $100k", "$100k - $150k", "$150k+"];

  return (
    <Card className="sticky top-4 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Job Type</h3>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={type} />
                <Label
                  htmlFor={type}
                  className="text-sm font-normal cursor-pointer text-foreground/80"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Experience Level</h3>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox id={level} />
                <Label
                  htmlFor={level}
                  className="text-sm font-normal cursor-pointer text-foreground/80"
                >
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Salary Range</h3>
          <div className="space-y-2">
            {salaryRanges.map((range) => (
              <div key={range} className="flex items-center space-x-2">
                <Checkbox id={range} />
                <Label
                  htmlFor={range}
                  className="text-sm font-normal cursor-pointer text-foreground/80"
                >
                  {range}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
