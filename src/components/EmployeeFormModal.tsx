import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEmployees, Employee } from '@/contexts/EmployeeProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';
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
  
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    position: 'waiter',
    admissionDate: today,
    interviewDate: today, // NEW
    testDate: today,      // NEW
    workSchedule: 'escala 6x1' as 'escala 6x1' | 'escala 5x2', // NEW
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive',
    photo: '' as string | undefined,
  });

  useEffect(() => {
    if (isEdit && employee) {
      setFormData({
        fullName: employee.fullName,
        cpf: employee.cpf,
        position: employee.position,
        admissionDate: employee.admissionDate,
        interviewDate: employee.interviewDate, // Load existing data
        testDate: employee.testDate,           // Load existing data
        workSchedule: employee.workSchedule,   // Load existing data
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        status: employee.status,
        photo: employee.photo,
      });
    } else {
      setFormData({
        fullName: '',
        cpf: '',
        position: 'waiter',
        admissionDate: today,
        interviewDate: today, // Default for new
        testDate: today,      // Default for new
        workSchedule: 'escala 6x1', // Default for new
        email: '',
        phone: '',
        address: '',
        status: 'active',
        photo: undefined,
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
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation check for required fields
    if (!formData.fullName || !formData.cpf || !formData.admissionDate || !formData.email || !formData.phone || !formData.address || !formData.interviewDate || !formData.testDate || !formData.workSchedule) {
        toast.error(t('form.error'));
        return;
    }

    const employeeDataToSave = {
        ...formData,
        // Ensure photo is undefined if empty string, as per Employee interface
        photo: formData.photo || undefined,
    };

    if (isEdit && employee) {
      updateEmployee(employee.id, employeeDataToSave);
    } else {
      addEmployee(employeeDataToSave);
    }
    
    toast.success(t('form.success'));
    onClose();
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('form.title.edit') : t('form.title.new')}</DialogTitle>
          <DialogDescription>{t('form.personalData')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          
          {/* Photo Upload Section */}
          <div className="flex flex-col items-center space-y-2 mb-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={formData.photo} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                {getInitials(formData.fullName)}
              </AvatarFallback>
            </Avatar>
            <Label htmlFor="employee-photo-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Upload className="w-4 h-4" />
                <span>{t('userProfile.changePhoto')} ({t('form.optional')})</span>
              </div>
              <Input 
                id="employee-photo-upload" 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
            </Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
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
            
            {/* NEW DATE FIELDS */}
            <div className="space-y-2">
              <Label htmlFor="interviewDate">{t('form.interviewDate')}</Label>
              <Input id="interviewDate" type="date" required value={formData.interviewDate} onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testDate">{t('form.testDate')}</Label>
              <Input id="testDate" type="date" required value={formData.testDate} onChange={(e) => setFormData({ ...formData, testDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionDate">{t('form.admissionDate')}</Label>
              <Input id="admissionDate" type="date" required value={formData.admissionDate} onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })} />
            </div>
            
            {/* NEW SCHEDULE FIELD */}
            <div className="space-y-2">
              <Label htmlFor="workSchedule">{t('form.workSchedule')}</Label>
              <Select value={formData.workSchedule} onValueChange={(value: 'escala 6x1' | 'escala 5x2') => setFormData({ ...formData, workSchedule: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="escala 6x1">{t('schedule.escala 6x1')}</SelectItem>
                  <SelectItem value="escala 5x2">{t('schedule.escala 5x2')}</SelectItem>
                </SelectContent>
              </Select>
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