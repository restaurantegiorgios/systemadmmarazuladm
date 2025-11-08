import React, { useState } from 'react';
import { Employee } from '@/contexts/EmployeeProvider';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Eye, User, Phone, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface EmployeeCardProps {
  employee: Employee;
  t: (key: string) => string;
  onView: (id: string) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, t, onView, onEdit, onDelete }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${t(fieldName)} copiado!`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
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
              {employee.photo ? '' : <User className="h-6 w-6" />}
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
        {/* Novo bloco de informações de contato */}
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
            <div 
                className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary/80 transition-colors"
                onClick={() => handleWhatsAppRedirect(employee.phone)}
                title="Abrir no WhatsApp"
            >
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="truncate font-medium">{employee.phone}</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0 text-muted-foreground hover:text-primary" onClick={() => handleCopy(employee.phone, 'dashboard.phone')}>
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>{t('dashboard.copy')}</p></TooltipContent>
            </Tooltip>
        </div>
        
        {/* Adicionando Email para mais informação */}
        <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-semibold">{t('form.email')}:</span>
            <span className="truncate">{employee.email}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 pt-4 border-t border-border/50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(employee.id)}
              className="transition-transform hover:scale-125"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{t('dashboard.view')}</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(employee)}
              className="transition-transform hover:scale-125"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{t('dashboard.edit')}</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(employee.id)}
              className="transition-transform hover:scale-125"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{t('dashboard.delete')}</p></TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default EmployeeCard;