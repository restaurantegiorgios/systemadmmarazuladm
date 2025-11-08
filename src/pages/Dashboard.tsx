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
import { Plus, Search, Edit, Trash2, Eye, X, ArrowUp, ArrowDown, User, Download, LayoutGrid, List, FileSearch, UserPlus, Filter } from 'lucide-react';
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
import { formatBrazilianDate } from '@/lib/utils';
import EmployeeCard from '@/components/EmployeeCard';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import EmptyState from '@/components/EmptyState';
import MobileFilterDrawer from '@/components/MobileFilterDrawer';
import { cn } from '@/lib/utils';

type SortKey = 'fullName' | 'position' | 'email' | 'phone' | 'status';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive';
type ViewMode = 'table' | 'cards';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const Dashboard = () => {
  const { t } = useLanguage();
  const { employees, deleteEmployee, isLoading } = useEmployees();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [positionFilter, setPositionFilter] = useState<'all' | string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (localStorage.getItem('viewMode') as ViewMode) || 'table'
  );
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'fullName', direction: 'asc' });

  // Read filters from URL on initial load
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    setStatusFilter((searchParams.get('status') as StatusFilter) || 'all');
    setPositionFilter(searchParams.get('position') || 'all');
    
    const viewFromUrl = searchParams.get('view') as ViewMode;
    if (viewFromUrl && ['table', 'cards'].includes(viewFromUrl)) {
      setViewMode(viewFromUrl);
    }
  }, []);

  // Sync filters with URL and save viewMode to localStorage
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (positionFilter !== 'all') params.set('position', positionFilter);
    if (viewMode !== 'table') params.set('view', viewMode);
    
    localStorage.setItem('viewMode', viewMode);
    
    setSearchParams(params, { replace: true });
  }, [searchTerm, statusFilter, positionFilter, viewMode, setSearchParams]);

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

  const getLogoBase64 = async (): Promise<string> => {
    const response = await fetch('/logo_rodape.png');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleExport = async (format: 'excel' | 'pdf', columns: EmployeeColumn[]) => {
    setExportDialogOpen(false);

    const formatValue = (emp: Employee, col: EmployeeColumn) => {
      const value = emp[col];
      if (['birthDate', 'interviewDate', 'testDate', 'admissionDate'].includes(col)) {
        return formatBrazilianDate(value as string);
      }
      if (col === 'position') return t(`position.${value}`);
      if (col === 'status') return t(`dashboard.${value}`);
      if (col === 'gender') return t(`gender.${value}`);
      if (col === 'workSchedule') return t(`schedule.${value}`);
      return value;
    };

    const dataToExport = sortedEmployees.map(emp => {
      const row: { [key: string]: any } = {};
      columns.forEach(col => {
        row[t(allColumns.find(c => c.id === col)!.labelKey)] = formatValue(emp, col);
      });
      return row;
    });

    if (format === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        
        // --- XLSX Formatting Enhancements ---
        
        const headerKeys = columns.map(col => t(allColumns.find(c => c.id === col)!.labelKey));
        
        // 1. Define Column Widths
        const columnWidths = columns.map(col => {
            switch (col) {
                case 'fullName':
                case 'address':
                    return { wch: 30 };
                case 'email':
                    return { wch: 35 };
                case 'phone':
                    return { wch: 18 };
                case 'position':
                case 'workSchedule':
                    return { wch: 20 };
                case 'cpf':
                    return { wch: 18 };
                case 'status':
                case 'gender':
                    return { wch: 12 };
                default: // Dates
                    return { wch: 15 };
            }
        });
        worksheet['!cols'] = columnWidths;

        // 2. Apply Header Formatting (Bold, Border, Alignment)
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
        const headerRowIndex = range.s.r; // 0 for the first row

        headerKeys.forEach((key, index) => {
            const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: index });
            const cell = worksheet[cellAddress];
            
            if (cell) {
                cell.s = {
                    font: { bold: true },
                    border: {
                        bottom: { style: "thin", color: { auto: 1 } }
                    },
                    alignment: { horizontal: "left", vertical: "center" }
                };
            }
        });
        
        // --- End Formatting Enhancements ---

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Funcionários');
        XLSX.writeFile(workbook, 'funcionarios.xlsx');
    } else if (format === 'pdf') {
        const logoBase64 = await getLogoBase64();
        const generationDate = new Date().toLocaleDateString('pt-BR');

        const element = document.createElement('div');
        element.innerHTML = `
            <html>
            <head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                    body { 
                        font-family: 'Inter', sans-serif;
                        color: #333;
                        font-size: 10px;
                        margin: 0;
                        padding: 0;
                    }
                    
                    /* Define margens e rodapé para todas as páginas */
                    @page {
                        margin: 0.5in 0.5in 0.75in 0.5in; /* Top Right Bottom Left */
                        @bottom-center {
                            content: element(pdf-footer);
                        }
                    }

                    .pdf-container {
                        padding: 0;
                    }
                    .pdf-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 2px solid #0a0a0a;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }
                    .pdf-header img {
                        width: 80px;
                        height: auto;
                    }
                    .pdf-header .title-section {
                        text-align: right;
                    }
                    .pdf-header h1 {
                        margin: 0;
                        font-size: 24px;
                        color: #0a0a0a;
                        font-weight: 700;
                    }
                    .pdf-header p {
                        margin: 0;
                        font-size: 12px;
                        color: #555;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 20px;
                    }
                    th, td { 
                        border: 1px solid #ddd; 
                        padding: 10px; 
                        text-align: left; 
                        font-size: 9px;
                        word-break: break-word;
                    }
                    th { 
                        background-color: #f2f2f2;
                        color: #333;
                        font-weight: 600;
                        text-transform: uppercase;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    
                    /* Rodapé fixo para o PDF */
                    .pdf-footer {
                        position: running(pdf-footer);
                        text-align: center;
                        font-size: 8px;
                        color: #777;
                        border-top: 1px solid #eee;
                        padding-top: 5px;
                        width: 100%;
                    }
                </style>
            </head>
            <body>
                <div class="pdf-container">
                    <div class="pdf-header">
                        <img src="${logoBase64}" alt="Logo">
                        <div class="title-section">
                            <h1>${t('dashboard.title')}</h1>
                            <p>${t('login.subtitle')}</p>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                ${columns.map(col => `<th>${t(allColumns.find(c => c.id === col)!.labelKey)}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedEmployees.map(emp => `
                                <tr>
                                    ${columns.map(col => `<td>${formatValue(emp, col) || ''}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="pdf-footer">
                    Relatório gerado em ${generationDate}
                </div>
            </body>
            </html>
        `;
        
        html2pdf().from(element).set({
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'funcionarios.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        }).save();
    }
  };

  const isFiltered = searchTerm || statusFilter !== 'all' || positionFilter !== 'all';
  const showEmptyState = !isLoading && filteredEmployees.length === 0;
  const showNoResults = showEmptyState && isFiltered;
  const showNoEmployees = showEmptyState && !isFiltered;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
          <div className="flex flex-wrap gap-2 justify-end items-center">
            <Button onClick={() => setExportDialogOpen(true)} className="hidden md:flex">
              <Download className="mr-2 h-4 w-4" />
              {t('dashboard.export')}
            </Button>
            <Button 
              onClick={handleAddNew}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 hidden md:flex"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboard.addNew')}
            </Button>
          </div>
        </div>
        
        {/* Stats and Filters Section */}
        {isLoading ? (
          <DashboardSkeleton viewMode={viewMode} />
        ) : (
          <>
            <DashboardStats employees={employees} />

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
          </>
        )}

        {/* Employee List/Empty State */}
        {isLoading ? (
          null
        ) : showNoEmployees ? (
          <EmptyState
            title="Nenhum Funcionário Cadastrado"
            description="Comece adicionando o primeiro funcionário para gerenciar seus dados e documentos."
            icon={UserPlus}
            actionButton={{
              label: t('dashboard.addNew'),
              onClick: handleAddNew,
            }}
            className="mt-12"
          />
        ) : showNoResults ? (
          <EmptyState
            title="Nenhum Resultado Encontrado"
            description={`Não encontramos funcionários que correspondam aos filtros e termos de busca: "${searchTerm}". Tente ajustar os filtros.`}
            icon={FileSearch}
            className="mt-12"
          />
        ) : (
          <div key={viewMode} className="animate-fade-in">
            {viewMode === 'table' ? (
              <div className="bg-card rounded-lg shadow-elegant overflow-hidden">
                {/* Adicionando scroll horizontal para garantir que a tabela não quebre o layout mobile */}
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
                            <div className="flex justify-end gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(`/employee/${employee.id}`)}
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
                                    onClick={() => handleEdit(employee)}
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
                                    onClick={() => setDeleteId(employee.id)}
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedEmployees.map((employee, index) => (
                  <div key={employee.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <EmployeeCard
                      employee={employee}
                      t={t}
                      onView={(id) => navigate(`/employee/${id}`)}
                      onEdit={handleEdit}
                      onDelete={setDeleteId}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Floating Action Button (FAB) for Mobile */}
      <div className={cn(
        "fixed bottom-6 left-6 z-50 md:hidden transition-transform duration-300",
        isLoading ? "scale-0" : "scale-100"
      )}>
        <Button 
          onClick={handleAddNew}
          size="lg"
          className="rounded-full h-14 w-14 shadow-xl bg-gradient-to-r from-primary to-accent hover:opacity-90"
          aria-label={t('dashboard.addNew')}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

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