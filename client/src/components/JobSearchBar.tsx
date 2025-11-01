import React from "react";

interface Filters {
  keyword: string;
  location: string;
  category: string;
  mode: string;
  jobTypes: string[];
  salary: number | null;
  experience: string[];
}

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onSearch: (value: string) => void;
  onClear: () => void;
}

const JobSearchBar: React.FC<Props> = ({ filters, setFilters, onSearch, onClear }) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-wrap gap-4 flex-grow">
        <input
          type="text"
          placeholder="Job title or keyword"
          className="border border-gray-300 rounded-lg p-2 w-60 focus:ring focus:ring-blue-300"
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          className="border border-gray-300 rounded-lg p-2 w-48 focus:ring focus:ring-blue-300"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          className="border border-gray-300 rounded-lg p-2 w-48 focus:ring focus:ring-blue-300"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClear}
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Clear
        </button>
        <button
          onClick={() => onSearch(filters.keyword)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default JobSearchBar;
