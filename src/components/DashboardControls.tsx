import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { positions } from '@/lib/positions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import MobileFilterDrawer from '@/components/MobileFilterDrawer';

type StatusFilter = 'all' | 'active' | 'inactive';
type ViewMode = 'table' | 'cards';

interface DashboardControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  positionFilter: string;
  setPositionFilter: (position: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const statusOptions: { value: StatusFilter; labelKey: string }[] = [
  { value: 'all', labelKey: 'dashboard.allStatus' },
  { value: 'active', labelKey: 'dashboard.active' },
  { value: 'inactive', labelKey: 'dashboard.inactive' },
];

const DashboardControls: React.FC<DashboardControlsProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  positionFilter,
  setPositionFilter,
  viewMode,
  setViewMode,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-lg shadow-soft p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        
        {/* Desktop Search and Filters */}
        <div className="hidden md:flex flex-1 relative w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="p-0 bg-transparent border-none text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <Input
            placeholder={t('dashboard.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="hidden md:flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder={t('form.position')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('dashboard.allPositions')}</SelectItem>
              {positions.map(pos => (
                <SelectItem key={pos} value={pos}>{t(`position.${pos}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map(option => (
              <Button
                key={option.value}
                variant={statusFilter === option.value ? 'default' : 'outline'}
                onClick={() => setStatusFilter(option.value)}
              >
                {t(option.labelKey)}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Mobile Filter Button (replaces the entire filter block) */}
        <div className="flex md:hidden w-full justify-between items-center gap-2">
          <MobileFilterDrawer
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            positionFilter={positionFilter}
            setPositionFilter={setPositionFilter}
          />
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('table')}
                  aria-label="Table view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Visualização em Tabela</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('cards')}
                  aria-label="Card view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Visualização em Cards</p></TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Desktop View Mode Toggle */}
        <div className="hidden md:flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('table')}
                aria-label="Table view"
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Visualização em Tabela</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('cards')}
                aria-label="Card view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Visualização em Cards</p></TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default DashboardControls;