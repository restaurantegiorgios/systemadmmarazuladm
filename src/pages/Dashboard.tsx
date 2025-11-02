import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Plus, Search, Edit, Trash2, Eye, X, ArrowUp, ArrowDown, User } from 'lucide-react';
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
import DashboardStats from '@/components/DashboardStats'; // Import the new component
import ScrollToTopButton from '@/components/ScrollToTopButton'; // Import the new component

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [positionFilter, setPositionFilter] = useState<'all' | string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'fullName', direction: 'asc' });

  const positions = [
    'waiter', 'chef', 'souschef', 'cook', 
    'dishwasher', 'manager', 'host', 'bartender'
  ];

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
        // Use string comparison for all fields
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
    // Remove todos os caracteres não numéricos e adiciona o código do país (55 para Brasil)
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
          <Button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('dashboard.addNew')}
          </Button>
        </div>
        
        {/* Dashboard Stats Cards */}
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
      
      <ScrollToTopButton />
    </div>
  );
};

export default Dashboard;