import React from 'react';
import { FilterIcon } from './icons';

interface FilterBarProps {
  filter: {
    start: string;
    end: string;
  };
  onFilterChange: (filter: { start: string; end: string }) => void;
  onClear: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filter, onFilterChange, onClear }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filter, [name]: value });
  };
  
  const hasFilter = filter.start || filter.end;

  return (
    <div className="mb-4 p-4 bg-white dark:bg-neutral-dark rounded-lg shadow-sm border border-neutral-medium dark:border-neutral-darkest">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 font-semibold">
          <FilterIcon className="h-5 w-5 text-brand-primary" />
          <span>Filtrar por data de criação:</span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="start" className="text-sm">De:</label>
          <input
            type="date"
            id="start"
            name="start"
            value={filter.start}
            onChange={handleInputChange}
            className="px-2 py-1 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="end" className="text-sm">Até:</label>
          <input
            type="date"
            id="end"
            name="end"
            value={filter.end}
            onChange={handleInputChange}
            className="px-2 py-1 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        {hasFilter && (
            <button 
                onClick={onClear} 
                className="px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
                Limpar Filtro
            </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
