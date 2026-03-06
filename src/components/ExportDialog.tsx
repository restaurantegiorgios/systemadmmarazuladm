import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Employee } from '@/contexts/EmployeeProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { File, FileSpreadsheet } from 'lucide-react';

// Define the type for available columns
export type EmployeeColumn = keyof Omit<Employee, 'id' | 'documents' | 'photo'>;

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'excel' | 'pdf', columns: EmployeeColumn[]) => void;
  allColumns: { id: EmployeeColumn; labelKey: string }[];
}

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose, onExport, allColumns }) => {
  const { t } = useLanguage();

  const [selectedColumns, setSelectedColumns] = useState<EmployeeColumn[]>(
    allColumns.map(c => c.id)
  );

  const handleColumnToggle = (columnId: EmployeeColumn) => {
    setSelectedColumns(prev =>
      prev.includes(columnId) ? prev.filter(id => id !== columnId) : [...prev, columnId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedColumns(checked ? allColumns.map(c => c.id) : []);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('dashboard.exportTitle')}</DialogTitle>
          <DialogDescription>{t('dashboard.exportDescription')}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all-columns"
              checked={selectedColumns.length === allColumns.length}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all-columns" className="font-semibold">
              {t('dashboard.selectAllColumns')}
            </Label>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
            {allColumns.map(column => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  id={column.id}
                  checked={selectedColumns.includes(column.id)}
                  onCheckedChange={() => handleColumnToggle(column.id)}
                />
                <Label htmlFor={column.id}>{t(column.labelKey)}</Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="sm:justify-start gap-2">
          <Button onClick={() => onExport('excel', selectedColumns)} disabled={selectedColumns.length === 0}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button onClick={() => onExport('pdf', selectedColumns)} disabled={selectedColumns.length === 0}>
            <File className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;