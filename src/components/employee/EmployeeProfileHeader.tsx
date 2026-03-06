import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Save, X, Edit } from 'lucide-react';
import { Employee } from '@/contexts/EmployeeProvider';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '@/lib/validators';

interface EmployeeProfileHeaderProps {
  employee: Employee;
  isEditing: boolean;
  t: (key: string) => string;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  getInitials: (fullName: string) => string;
  form: UseFormReturn<EmployeeFormValues>;
}

const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({
  employee,
  isEditing,
  t,
  onEditToggle,
  onSave,
  onCancel,
  getInitials,
  form,
}) => {
  // Watch form values for real-time updates in the header
  const currentPhoto = form.watch('photo');
  const currentFullName = form.watch('fullName');
  const currentStatus = form.watch('status');

  // Fallback to employee data if form hasn't loaded or is empty (shouldn't happen if form.reset is used correctly)
  const displayPhoto = currentPhoto || employee.photo;
  const displayFullName = currentFullName || employee.fullName;
  const displayStatus = currentStatus || employee.status;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <Avatar className="w-20 h-20 shadow-md">
          <AvatarImage src={displayPhoto || undefined} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
            {getInitials(displayFullName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold mb-1">{displayFullName}</h1>
          <Badge variant={displayStatus === 'active' ? 'default' : 'secondary'}>
            {t(`dashboard.${displayStatus}`)}
          </Badge>
        </div>
      </div>
      
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              {t('form.cancel')}
            </Button>
            {/* O botão de salvar agora é um submit do formulário */}
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
              <Save className="mr-2 h-4 w-4" />
              {t('form.save')}
            </Button>
          </>
        ) : (
          <Button type="button" onClick={onEditToggle}>
            <Edit className="mr-2 h-4 w-4" />
            {t('dashboard.edit')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfileHeader;