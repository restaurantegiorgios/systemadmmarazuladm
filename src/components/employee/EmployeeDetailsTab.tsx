import React from 'react';
import { Employee } from '@/contexts/EmployeeProvider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, MapPin, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { positions } from '@/lib/positions';

interface EmployeeDetailsTabProps {
  employee: Employee;
  editableData: Partial<Employee>;
  isEditing: boolean;
  t: (key: string) => string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (id: keyof Employee, value: string) => void;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getInitials: (fullName: string) => string;
}

const schedules = ['escala 6x1', 'escala 5x2'];

const EmployeeDetailsTab: React.FC<EmployeeDetailsTabProps> = ({
  employee,
  editableData,
  isEditing,
  t,
  handleInputChange,
  handleSelectChange,
  handlePhotoUpload,
  getInitials,
}) => {
  const currentPhoto = editableData.photo || employee.photo;
  const currentFullName = editableData.fullName || employee.fullName;

  const handleOpenMap = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };
  
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${t(fieldName)} copiado!`, {
        description: text,
      });
    }).catch(() => {
      toast.error("Falha ao copiar para a área de transferência.");
    });
  };
  
  const handleWhatsAppRedirect = (phone: string) => {
    // Remove todos os caracteres não numéricos e adiciona o código do país (55 para Brasil)
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/55${cleanPhone}`;
    window.open(whatsappLink, '_blank');
  };

  const renderField = (id: keyof Employee, labelKey: string, type: string = 'text', maxLength?: number) => {
    // CORREÇÃO: Verifica se o valor existe em editableData (mesmo que seja '') antes de usar o valor original.
    const value = (editableData[id] !== undefined ? editableData[id] : employee[id]) as string;
    
    const isCopyable = ['fullName', 'email', 'address', 'cpf', 'phone'].includes(id);
    const isPhoneField = id === 'phone';
    
    // Base classes for action buttons
    const actionButtonClasses = "opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-muted-foreground hover:bg-muted hover:text-primary";

    if (!isEditing) {
      let displayValue = value;
      
      if (id === 'position') {
        displayValue = t(`position.${value}`);
      } else if (id === 'status') {
        displayValue = t(`dashboard.${value}`);
      } else if (id === 'workSchedule') {
        displayValue = t(`schedule.${value}`);
      } else if (['admissionDate', 'interviewDate', 'testDate', 'birthDate'].includes(id) && typeof value === 'string') {
        displayValue = new Date(value).toLocaleDateString();
      }
      
      return (
        <div className="group">
          <Label htmlFor={id} className="text-muted-foreground">{t(labelKey)}</Label>
          <div className="flex items-center gap-1">
            <p 
              className={`text-lg font-medium ${isPhoneField ? 'cursor-pointer group-hover:underline' : ''}`}
              onClick={isPhoneField ? () => handleWhatsAppRedirect(displayValue) : undefined}
            >
              {displayValue}
            </p>
            
            <div className="flex items-center gap-1">
              {/* Copy Icon */}
              {isCopyable && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(displayValue, labelKey)}
                  title={t('dashboard.copy')}
                  className={actionButtonClasses}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}

              {/* Map Pin Icon (only for address) */}
              {id === 'address' && displayValue && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleOpenMap(displayValue)}
                  title="Ver no Google Maps"
                  className={actionButtonClasses}
                >
                  <MapPin className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Editing mode
    if (id === 'position') {
      return (
        <div>
          <Label htmlFor={id}>{t(labelKey)}</Label>
          <Select 
            value={String(value)} 
            onValueChange={(val) => handleSelectChange(id, val)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {positions.map(option => (
                <SelectItem key={option} value={option}>
                  {t(`position.${option}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    
    if (id === 'workSchedule') {
      const selectOptions = schedules;
      
      return (
        <div>
          <Label htmlFor={id}>{t(labelKey)}</Label>
          <Select 
            value={String(value)} 
            onValueChange={(val) => handleSelectChange(id, val)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {selectOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {t(`schedule.${option}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (id === 'status') {
      const selectOptions = ['active', 'inactive'];
      
      return (
        <div>
          <Label htmlFor={id}>{t(labelKey)}</Label>
          <Select 
            value={String(value)} 
            onValueChange={(val) => handleSelectChange(id, val)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {selectOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {t(`dashboard.${option}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div>
        <Label htmlFor={id}>{t(labelKey)}</Label>
        <Input 
          id={id} 
          type={type} 
          value={String(value)} 
          onChange={handleInputChange} 
          maxLength={maxLength}
          required
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {isEditing && (
        <div className="flex flex-col items-center space-y-2 mb-6">
          <Avatar className="w-20 h-20 shadow-md">
            <AvatarImage src={currentPhoto} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
              {getInitials(currentFullName)}
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
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderField('fullName', 'form.fullName')}
        {renderField('cpf', 'form.cpf', 'text', 14)}
        {renderField('birthDate', 'form.birthDate', 'date')} {/* NEW FIELD */}
        {renderField('position', 'form.position')}
        {renderField('workSchedule', 'form.workSchedule')}
        {renderField('interviewDate', 'form.interviewDate', 'date')}
        {renderField('testDate', 'form.testDate', 'date')}
        {renderField('admissionDate', 'form.admissionDate', 'date')}
        {renderField('email', 'form.email', 'email')}
        {renderField('phone', 'form.phone', 'text', 15)}
        <div className="md:col-span-2">
          {renderField('address', 'form.address')}
        </div>
        {renderField('status', 'form.status')}
      </div>
    </div>
  );
};

export default EmployeeDetailsTab;