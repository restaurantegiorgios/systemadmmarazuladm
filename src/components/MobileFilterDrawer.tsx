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
import { Drawer } from 'vaul';
import { Filter, Search, X } from 'lucide-react';

type StatusFilter = 'all' | 'active' | 'inactive';

interface MobileFilterDrawerProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  positionFilter: string;
  setPositionFilter: (position: string) => void;
}

const statusOptions: { value: StatusFilter; labelKey: string }[] = [
  { value: 'all', labelKey: 'dashboard.allStatus' },
  { value: 'active', labelKey: 'dashboard.active' },
  { value: 'inactive', labelKey: 'dashboard.inactive' },
];

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  positionFilter,
  setPositionFilter,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPositionFilter('all');
    setIsOpen(false);
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger asChild>
        <Button variant="outline" size="icon" className="flex-shrink-0 md:hidden">
          <Filter className="h-5 w-5" />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 flex flex-col rounded-t-[10px] h-[80%] bg-card z-[60]">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mt-3" />
          
          {/* Substituindo Drawer.Header e Drawer.Title por div e h2 */}
          <div className="p-4 pb-0">
            <h2 className="text-xl font-bold flex justify-between items-center">
              {t('dashboard.filters')}
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-1" />
                {t('form.cancel')}
              </Button>
            </h2>
          </div>
          
          <div className="p-4 overflow-y-auto space-y-6">
            
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('dashboard.search')}</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('dashboard.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Position Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('form.position')}</label>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('form.position')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('dashboard.allPositions')}</SelectItem>
                  {positions.map(pos => (
                    <SelectItem key={pos} value={pos}>{t(`position.${pos}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('dashboard.status')}</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={statusFilter === option.value ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(option.value)}
                    className="flex-1 min-w-[100px]"
                  >
                    {t(option.labelKey)}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={() => setIsOpen(false)} 
              className="w-full bg-gradient-to-r from-primary to-accent mt-6"
            >
              {t('form.save')}
            </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MobileFilterDrawer;