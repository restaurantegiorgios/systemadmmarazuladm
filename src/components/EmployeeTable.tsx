import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Employee } from '@/contexts/EmployeeProvider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, User, Edit, Trash2, Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type SortKey = 'fullName' | 'position' | 'email' | 'phone' | 'status';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface EmployeeTableProps {
  employees: Employee[];
  sortConfig: SortConfig;
  requestSort: (key: SortKey) => void;
  onView: (id: string) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  sortConfig,
  requestSort,
  onView,
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage();
  
  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const SortableHeader = ({ children, sortKey, className = '' }: { children: React.ReactNode, sortKey: SortKey, className?: string }) => (
    <TableHead scope="col" className={className}>
      <Button
        variant="ghost"
        className="p-0 h-auto hover:bg-transparent text-foreground/80 hover:text-foreground font-semibold"
        onClick={() => requestSort(sortKey)}
      >
        {children}
        {getSortIcon(sortKey)}
      </Button>
    </TableHead>
  );
  
  const handleWhatsAppRedirect = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/55${cleanPhone}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="bg-card rounded-lg shadow-elegant overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col" className="w-[50px]">{t('dashboard.photo')}</TableHead>
              <SortableHeader sortKey="fullName">{t('dashboard.name')}</SortableHeader>
              <SortableHeader sortKey="position" className="hidden md:table-cell">{t('dashboard.position')}</SortableHeader>
              <SortableHeader sortKey="email" className="hidden lg:table-cell">{t('dashboard.email')}</SortableHeader>
              <SortableHeader sortKey="phone" className="hidden lg:table-cell">{t('dashboard.phone')}</SortableHeader>
              <SortableHeader sortKey="status">{t('dashboard.status')}</SortableHeader>
              <TableHead scope="col" className="text-right">{t('dashboard.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={employee.photo} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {employee.photo ? '' : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{employee.fullName}</TableCell>
                <TableCell className="hidden md:table-cell">{t(`position.${employee.position}`)}</TableCell>
                <TableCell className="hidden lg:table-cell">{employee.email}</TableCell>
                <TableCell 
                  className="hidden lg:table-cell text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                  onClick={() => handleWhatsAppRedirect(employee.phone)}
                >
                  {employee.phone}
                </TableCell>
                <TableCell>
                  <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                    {t(`dashboard.${employee.status}`)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(employee.id)}
                          className="transition-transform hover:scale-125"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>{t('dashboard.view')}</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(employee)}
                          className="transition-transform hover:scale-125"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>{t('dashboard.edit')}</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(employee.id)}
                          className="transition-transform hover:scale-125"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>{t('dashboard.delete')}</p></TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeTable;