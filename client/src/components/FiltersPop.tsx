import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface FiltersPopupProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  onClear: () => void;
}

const FiltersPopup: React.FC<FiltersPopupProps> = ({
  filters,
  setFilters,
  onClear,
}) => {
  const jobTypes = ["Full-Time", "Part-Time", "Internship", "Contract", "CO-OP"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level"];
  const modes = ["Remote", "Hybrid", "On-site"];

  return (
    <Dialog>
      {/* Button to open filters */}
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl font-medium flex items-center gap-2">
          ⚙️ Filters
        </Button>
      </DialogTrigger>

      {/* ✅ Right-side drawer */}
      <DialogContent
        className="
          fixed inset-y-0 right-0
          h-full w-[380px] max-w-[90vw]
          bg-white shadow-2xl border-l border-gray-200
          flex flex-col justify-between
          p-0
          animate-slideIn
        "
        style={{
          transform: "none", // override default centering
          top: 0,
          left: "auto",
        }}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Filter Jobs
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable filter content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm text-gray-700">
          {/* Job Type */}
          <section className="space-y-3">
            <h4 className="font-semibold text-gray-800 text-sm">Job Type</h4>
            <div className="grid grid-cols-2 gap-2">
              {jobTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filters.jobTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters((prev: any) => ({
                          ...prev,
                          jobTypes: [...prev.jobTypes, type],
                        }));
                      } else {
                        setFilters((prev: any) => ({
                          ...prev,
                          jobTypes: prev.jobTypes.filter((t: string) => t !== type),
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={type} className="text-sm text-gray-700">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Salary */}
          <section className="space-y-3">
            <h4 className="font-semibold text-gray-800 text-sm">Minimum Salary</h4>
            <div>
              <span className="text-blue-600 font-medium">
                ${filters.salary?.toLocaleString() || 0}
              </span>
            </div>
            <Slider
              value={[filters.salary || 0]}
              min={0}
              max={200000}
              step={5000}
              onValueChange={(value) =>
                setFilters((prev: any) => ({ ...prev, salary: value[0] }))
              }
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>$200k+</span>
            </div>
          </section>

          <Separator />

          {/* Experience */}
          <section className="space-y-3">
            <h4 className="font-semibold text-gray-800 text-sm">Experience</h4>
            <div className="grid grid-cols-2 gap-2">
              {experienceLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={level}
                    checked={filters.experience.includes(level)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters((prev: any) => ({
                          ...prev,
                          experience: [...prev.experience, level],
                        }));
                      } else {
                        setFilters((prev: any) => ({
                          ...prev,
                          experience: prev.experience.filter((l: string) => l !== level),
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={level} className="text-sm text-gray-700">
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Mode of Work */}
          <section className="space-y-3">
            <h4 className="font-semibold text-gray-800 text-sm">Mode of Work</h4>
            <div className="grid grid-cols-3 gap-2">
              {modes.map((mode) => (
                <div key={mode} className="flex items-center space-x-2">
                  <Checkbox
                    id={mode}
                    checked={filters.mode === mode}
                    onCheckedChange={(checked) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        mode: checked ? mode : "",
                      }))
                    }
                  />
                  <Label htmlFor={mode} className="text-sm text-gray-700">
                    {mode}
                  </Label>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer buttons */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between bg-white">
          <Button variant="secondary" onClick={onClear}>
            Clear All
          </Button>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Apply Filters
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FiltersPopup;
