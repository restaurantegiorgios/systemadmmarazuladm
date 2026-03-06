import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEmployees, Employee } from '@/contexts/EmployeeProvider';
import { employeeSchema, EmployeeFormValues } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Loader2, Trash2 } from 'lucide-react';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { positions } from '@/lib/positions';
import { cn, capitalizeName } from '@/lib/utils';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ isOpen, onClose, employee }) => {
  const { t } = useLanguage();
  const { addEmployee, updateEmployee } = useEmployees();
  const isEdit = !!employee;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullName: '',
      cpf: '',
      position: 'garcom',
      admissionDate: '',
      birthDate: '',
      gender: 'male',
      interviewDate: '',
      testDate: '',
      workSchedule: 'escala 6x1',
      email: '',
      phone: '',
      address: '',
      status: 'active',
      photo: null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit && employee) {
        form.reset({ ...employee, photo: employee.photo || null });
      } else {
        form.reset({
          fullName: '',
          cpf: '',
          position: 'garcom',
          admissionDate: '',
          birthDate: '',
          gender: 'male',
          interviewDate: '',
          testDate: '',
          workSchedule: 'escala 6x1',
          email: '',
          phone: '',
          address: '',
          status: 'active',
          photo: null,
        });
      }
    }
  }, [employee, isEdit, isOpen, form]);

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
        form.setValue('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: EmployeeFormValues) => {
    setIsSubmitting(true);

    const employeeDataToSave = {
      ...data,
      fullName: capitalizeName(data.fullName),
      photo: data.photo,
    };

    const onSettled = () => {
      toast.success(t('form.success'));
      setIsSubmitting(false);
      onClose();
    };

    if (isEdit && employee) {
      updateEmployee({ id: employee.id, data: employeeDataToSave }, { onSettled });
    } else {
      addEmployee(employeeDataToSave, { onSettled });
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 820); // Duração da animação
  };

  const onError = () => {
    triggerShake();
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };

  const photoValue = form.watch('photo');
  const fullNameValue = form.watch('fullName');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[625px]", shake && "animate-shake")}>
        <DialogHeader>
          <DialogTitle>{isEdit ? t('form.title.edit') : t('form.title.new')}</DialogTitle>
          <DialogDescription>{t('form.personalData')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
            <div className="max-h-[70vh] overflow-y-auto p-1 pr-4 -mr-4 space-y-4">
              <div className="flex flex-col items-center space-y-2 mb-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={photoValue || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                    {getInitials(fullNameValue)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-4">
                  <Label htmlFor="employee-photo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{t('userProfile.changePhoto')} ({t('form.optional')})</span>
                    </div>
                    <Input id="employee-photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </Label>
                  {photoValue && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => form.setValue('photo', null)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('userProfile.removePhoto')}
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.fullName')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          onBlur={(e) => {
                            field.onChange(capitalizeName(e.target.value));
                            field.onBlur();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="cpf" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.cpf')}</FormLabel>
                    <FormControl>
                      <Input {...field} onChange={e => field.onChange(formatCPF(e.target.value))} maxLength={14} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="birthDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.birthDate')}</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="gender" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.gender')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="male">{t('gender.male')}</SelectItem>
                        <SelectItem value="female">{t('gender.female')}</SelectItem>
                        <SelectItem value="other">{t('gender.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="position" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.position')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {positions.map(pos => (
                          <SelectItem key={pos} value={pos}>{t(`position.${pos}`)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="interviewDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.interviewDate')}</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="testDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.testDate')}</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="admissionDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.admissionDate')}</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="workSchedule" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.workSchedule')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="escala 6x1">{t('schedule.escala 6x1')}</SelectItem>
                        <SelectItem value="escala 5x2">{t('schedule.escala 5x2')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.email')}</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.phone')}</FormLabel>
                    <FormControl>
                      <Input {...field} onChange={e => field.onChange(formatPhone(e.target.value))} maxLength={15} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.status')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="active">{t('dashboard.active')}</SelectItem>
                        <SelectItem value="inactive">{t('dashboard.inactive')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="md:col-span-2">
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.address')}</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>{t('form.cancel')}</Button>
              <Button type="submit" className="bg-gradient-to-r from-primary to-accent" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('form.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormModal;