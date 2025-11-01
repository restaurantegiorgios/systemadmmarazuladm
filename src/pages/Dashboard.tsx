import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react';
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

const Dashboard = () => {
  const { t } = useLanguage();
  const { employees, deleteEmployee } = useEmployees();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t(`position.${emp.position}`).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
              >
                {t('dashboard.allStatus')}
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('active')}
              >
                {t('dashboard.active')}
              </Button>
              <Button
                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('inactive')}
              >
                {t('dashboard.inactive')}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-elegant overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('dashboard.name')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('dashboard.position')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t('dashboard.email')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t('dashboard.phone')}</TableHead>
                <TableHead>{t('dashboard.status')}</TableHead>
                <TableHead className="text-right">{t('dashboard.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{employee.fullName}</TableCell>
                  <TableCell className="hidden md:table-cell">{t(`position.${employee.position}`)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{employee.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{employee.phone}</TableCell>
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
    </div>
  );
};

export default Dashboard;