import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Save, X, Edit } from 'lucide-react';
import { Employee } from '@/contexts/EmployeeProvider';

interface EmployeeProfileHeaderProps {
  employee: Employee;
  editableData: Partial<Employee>;
  isEditing: boolean;
  t: (key: string) => string;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  getInitials: (fullName: string) => string;
}

const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({
  employee,
  editableData,
  isEditing,
  t,
  onEditToggle,
  onSave,
  onCancel,
  getInitials,
}) => {
  const currentPhoto = editableData.photo || employee.photo;
  const currentFullName = editableData.fullName || employee.fullName;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <Avatar className="w-20 h-20 shadow-md">
          <AvatarImage src={currentPhoto} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
            {getInitials(currentFullName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold mb-1">{currentFullName}</h1>
          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
            {t(`dashboard.${employee.status}`)}
          </Badge>
        </div>
      </div>
      
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              {t('form.cancel')}
            </Button>
            <Button onClick={onSave} className="bg-gradient-to-r from-primary to-accent">
              <Save className="mr-2 h-4 w-4" />
              {t('form.save')}
            </Button>
          </>
        ) : (
          <Button onClick={onEditToggle}>
            <Edit className="mr-2 h-4 w-4" />
            {t('dashboard.edit')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfileHeader;