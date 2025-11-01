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
import { Upload } from 'lucide-react';

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

const positions = [
  'waiter', 'chef', 'souschef', 'cook', 
  'dishwasher', 'manager', 'host', 'bartender'
];

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

  const renderField = (id: keyof Employee, labelKey: string, type: string = 'text', maxLength?: number) => {
    const value = editableData[id] || employee[id];
    
    if (!isEditing) {
      let displayValue = String(value);
      if (id === 'position') {
        displayValue = t(`position.${value}`);
      } else if (id === 'status') {
        displayValue = t(`dashboard.${value}`);
      } else if (id === 'admissionDate' && typeof value === 'string') {
        displayValue = new Date(value).toLocaleDateString();
      }
      
      return (
        <div>
          <Label htmlFor={id} className="text-muted-foreground">{t(labelKey)}</Label>
          <p className="text-lg font-medium">{displayValue}</p>
        </div>
      );
    }

    // Editing mode
    if (id === 'position' || id === 'status') {
      const selectOptions = id === 'position' ? positions : ['active', 'inactive'];
      
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
                  {t(id === 'position' ? `position.${option}` : `dashboard.${option}`)}
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
        {renderField('position', 'form.position')}
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