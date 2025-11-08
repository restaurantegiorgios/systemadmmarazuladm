import React from 'react';
import { Employee } from '@/contexts/EmployeeProvider';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Eye, User, Phone, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface EmployeeCardProps {
  employee: Employee;
  t: (key: string) => string;
  onView: (id: string) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, t, onView, onEdit, onDelete }) => {
  
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${t(fieldName)} copiado!`);
    }).catch(() => {
      toast.error("Falha ao copiar.");
    });
  };

  const handleWhatsAppRedirect = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/55${cleanPhone}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <Card className="flex flex-col justify-between shadow-soft hover:shadow-elegant transition-shadow duration-300 h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={employee.photo} />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg leading-tight">{employee.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">{t(`position.${employee.position}`)}</p>
          </div>
        </div>
        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
          {t(`dashboard.${employee.status}`)}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
            <div 
                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleWhatsAppRedirect(employee.phone)}
                title="Abrir no WhatsApp"
            >
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{employee.phone}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => handleCopy(employee.phone, 'dashboard.phone')}>
                <Copy className="h-3 w-3" />
            </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 pt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(employee.id)}
          title={t('dashboard.view')}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(employee)}
          title={t('dashboard.edit')}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(employee.id)}
          title={t('dashboard.delete')}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmployeeCard;