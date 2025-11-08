import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEmployees, Employee } from '@/contexts/EmployeeProvider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, Edit, Trash2, Eye, X, ArrowUp, ArrowDown, User, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import EmployeeFormModal from '@/components/EmployeeFormModal';
import DashboardStats from '@/components/DashboardStats';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { positions } from '@/lib/positions';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import ExportDialog, { EmployeeColumn } from '@/components/ExportDialog';

type SortKey = 'fullName' | 'position' | 'email' | 'phone' | 'status';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const Dashboard = () => {
  const { t } = useLanguage();
  const { employees, deleteEmployee } = useEmployees();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [positionFilter, setPositionFilter] = useState<'all' | string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'fullName', direction: 'asc' });

  // Read filters from URL on initial load
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    setStatusFilter((searchParams.get('status') as StatusFilter) || 'all');
    setPositionFilter(searchParams.get('position') || 'all');
  }, []);

  // Sync filters with URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (positionFilter !== 'all') params.set('position', positionFilter);
    setSearchParams(params, { replace: true });
  }, [searchTerm, statusFilter, positionFilter, setSearchParams]);

  const statusOptions: { value: StatusFilter; labelKey: string }[] = [
    { value: 'all', labelKey: 'dashboard.allStatus' },
    { value: 'active', labelKey: 'dashboard.active' },
    { value: 'inactive', labelKey: 'dashboard.inactive' },
  ];

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t(`position.${emp.position}`).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
      const matchesPosition = positionFilter === 'all' || emp.position === positionFilter;
      return matchesSearch && matchesStatus && matchesPosition;
    });
  }, [employees, searchTerm, statusFilter, positionFilter, t]);


  const sortedEmployees = useMemo(() => {
    let sortableItems = [...filteredEmployees];
    
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredEmployees, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const SortableHeader = ({ children, sortKey, className = '' }: { children: React.ReactNode, sortKey: SortKey, className?: string }) => (
    <TableHead className={className}>
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

  const handleDelete = () => {
    if (deleteId) {
      deleteEmployee(deleteId);
      toast.success(t('dashboard.deleteSuccess'));
      setDeleteId(null);
    }
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setFormModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t('dashboard.shareSuccess'));
  };

  const allColumns: { id: EmployeeColumn; labelKey: string }[] = [
    { id: 'fullName', labelKey: 'form.fullName' },
    { id: 'cpf', labelKey: 'form.cpf' },
    { id: 'birthDate', labelKey: 'form.birthDate' },
    { id: 'gender', labelKey: 'form.gender' },
    { id: 'position', labelKey: 'form.position' },
    { id: 'workSchedule', labelKey: 'form.workSchedule' },
    { id: 'interviewDate', labelKey: 'form.interviewDate' },
    { id: 'testDate', labelKey: 'form.testDate' },
    { id: 'admissionDate', labelKey: 'form.admissionDate' },
    { id: 'email', labelKey: 'form.email' },
    { id: 'phone', labelKey: 'form.phone' },
    { id: 'address', labelKey: 'form.address' },
    { id: 'status', labelKey: 'form.status' },
  ];

  const handleExport = (format: 'excel' | 'csv' | 'pdf', columns: EmployeeColumn[]) => {
    setExportDialogOpen(false);

    const dataToExport = sortedEmployees.map(emp => {
        const row: { [key: string]: any } = {};
        columns.forEach(col => {
            let value = emp[col];
            if (col === 'position') value = t(`position.${value}`);
            else if (col === 'status') value = t(`dashboard.${value}`);
            else if (col === 'gender') value = t(`gender.${value}`);
            else if (col === 'workSchedule') value = t(`schedule.${value}`);
            row[t(allColumns.find(c => c.id === col)!.labelKey)] = value;
        });
        return row;
    });

    if (format === 'excel' || format === 'csv') {
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        if (format === 'excel') {
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Funcionários');
            XLSX.writeFile(workbook, 'funcionarios.xlsx');
        } else {
            const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([`\uFEFF${csvOutput}`], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'funcionarios.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } else if (format === 'pdf') {
        const element = document.createElement('div');
        element.innerHTML = `
            <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }
                th { background-color: #f2f2f2; }
            </style>
            <h1>${t('dashboard.title')}</h1>
            <table>
                <thead>
                    <tr>
                        ${columns.map(col => `<th>${t(allColumns.find(c => c.id === col)!.labelKey)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${sortedEmployees.map(emp => `
                        <tr>
                            ${columns.map(col => {
                                let value = emp[col];
                                if (col === 'position') value = t(`position.${value}`);
                                else if (col === 'status') value = t(`dashboard.${value}`);
                                else if (col === 'gender') value = t(`gender.${value}`);
                                else if (col === 'workSchedule') value = t(`schedule.${value}`);
                                return `<td>${value || ''}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.body.appendChild(element);
        html2pdf(element, {
            margin: 1,
            filename: 'funcionarios.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        }).then(() => {
            document.body.removeChild(element);
        });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
          <div className="flex flex-wrap gap-2 justify-end">
            <Button onClick={handleShare} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              {t('dashboard.shareView')}
            </Button>
            <Button onClick={() => setExportDialogOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              {t('dashboard.export')}
            </Button>
            <Button 
              onClick={handleAddNew}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboard.addNew')}
            </Button>
          </div>
        </div>
        
        <DashboardStats employees={employees} />

        <div className="bg-card rounded-lg shadow-soft p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
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
        </div>

        <div className="bg-card rounded-lg shadow-elegant overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">{t('dashboard.photo')}</TableHead>
                  <SortableHeader sortKey="fullName">{t('dashboard.name')}</SortableHeader>
                  <SortableHeader sortKey="position" className="hidden md:table-cell">{t('dashboard.position')}</SortableHeader>
                  <SortableHeader sortKey="email" className="hidden lg:table-cell">{t('dashboard.email')}</SortableHeader>
                  <SortableHeader sortKey="phone" className="hidden lg:table-cell">{t('dashboard.phone')}</SortableHeader>
                  <SortableHeader sortKey="status">{t('dashboard.status')}</SortableHeader>
                  <TableHead className="text-right">{t('dashboard.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEmployees.map((employee) => (
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
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/employee/${employee.id}`)}
                          title={t('dashboard.view')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(employee)}
                          title={t('dashboard.edit')}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(employee.id)}
                          title={t('dashboard.delete')}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('form.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {t('dashboard.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EmployeeFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setFormModalOpen(false)}
        employee={editingEmployee}
      />
      
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={handleExport}
        allColumns={allColumns}
      />
      
      <ScrollToTopButton />
    </div>
  );
};

export default Dashboard;