import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEmployees, Employee } from '@/contexts/EmployeeProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ isOpen, onClose, employee }) => {
  const { t } = useLanguage();
  const { addEmployee, updateEmployee } = useEmployees();
  const isEdit = !!employee;

  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    position: 'waiter',
    admissionDate: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (isEdit && employee) {
      setFormData({
        fullName: employee.fullName,
        cpf: employee.cpf,
        position: employee.position,
        admissionDate: employee.admissionDate,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        status: employee.status,
      });
    } else {
      setFormData({
        fullName: '',
        cpf: '',
        position: 'waiter',
        admissionDate: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
      });
    }
  }, [employee, isEdit, isOpen]);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && employee) {
      updateEmployee(employee.id, formData);
    } else {
      addEmployee(formData);
    }
    
    toast.success(t('form.success'));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('form.title.edit') : t('form.title.new')}</DialogTitle>
          <DialogDescription>{t('form.personalData')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('form.fullName')}</Label>
              <Input id="fullName" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">{t('form.cpf')}</Label>
              <Input id="cpf" required value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })} maxLength={14} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">{t('form.position')}</Label>
              <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="waiter">{t('position.waiter')}</SelectItem>
                  <SelectItem value="chef">{t('position.chef')}</SelectItem>
                  <SelectItem value="souschef">{t('position.souschef')}</SelectItem>
                  <SelectItem value="cook">{t('position.cook')}</SelectItem>
                  <SelectItem value="dishwasher">{t('position.dishwasher')}</SelectItem>
                  <SelectItem value="manager">{t('position.manager')}</SelectItem>
                  <SelectItem value="host">{t('position.host')}</SelectItem>
                  <SelectItem value="bartender">{t('position.bartender')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionDate">{t('form.admissionDate')}</Label>
              <Input id="admissionDate" type="date" required value={formData.admissionDate} onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('form.email')}</Label>
              <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('form.phone')}</Label>
              <Input id="phone" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })} maxLength={15} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">{t('form.address')}</Label>
              <Input id="address" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">{t('form.status')}</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('dashboard.active')}</SelectItem>
                  <SelectItem value="inactive">{t('dashboard.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>{t('form.cancel')}</Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent">{t('form.save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormModal;