import React from 'react';
import { Employee } from '@/contexts/EmployeeProvider';
import { cn } from '@/lib/utils';
import { formatBrazilianDate } from '@/lib/utils';

interface EmployeePrintTemplateProps {
  employee: Employee;
  t: (key: string) => string;
  getInitials: (fullName: string) => string;
}

// Utility function to format CPF
const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// Utility function to format Phone
const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

const EmployeePrintTemplate = React.forwardRef<HTMLDivElement, EmployeePrintTemplateProps>(({ employee, t, getInitials }, ref) => {
  
  // New render function for the desired block format
  const renderDetailBlock = (labelKey: string, value: string | undefined, formatter?: (v: string) => string, fullWidth: boolean = false) => {
    const displayValue = value ? (formatter ? formatter(value) : value) : t('form.notAvailable');
    
    return (
      <div className={cn("space-y-1 pb-3", fullWidth ? "col-span-2" : "col-span-1")}>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t(labelKey)}</p>
        <p className="text-base font-semibold text-gray-900">{displayValue}</p>
      </div>
    );
  };

  return (
    <div 
      ref={ref} 
      className="p-8 bg-white text-black w-[210mm] min-h-[297mm] mx-auto shadow-xl print:shadow-none print:p-0 print:w-auto print:min-h-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold uppercase">{t('profile.title')}</h1>
        <div className="text-sm text-right">
          <p className="font-semibold">{t('login.subtitle')}</p>
          <p>{t('login.title')}</p>
        </div>
      </div>

      {/* Employee Summary (Photo and Status) */}
      <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        {employee.photo ? (
          <img 
            src={employee.photo} 
            alt={employee.fullName} 
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
            {getInitials(employee.fullName)}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold">{employee.fullName}</h2>
          <p className="text-sm text-gray-600">{t(`position.${employee.position}`)}</p>
          <p className={cn("text-sm font-semibold", employee.status === 'active' ? 'text-green-600' : 'text-red-600')}>
            {t(`dashboard.${employee.status}`)}
          </p>
        </div>
      </div>

      {/* Personal Details in Block Format */}
      <h3 className="text-lg font-bold mb-4 border-b pb-1">{t('form.personalData')}</h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
        
        {/* Full Name (Full Width) */}
        {renderDetailBlock('form.fullName', employee.fullName, undefined, true)}
        
        {/* CPF and Birth Date */}
        {renderDetailBlock('form.cpf', employee.cpf, formatCPF)}
        {renderDetailBlock('form.birthDate', employee.birthDate, formatBrazilianDate)}
        
        {/* Position and Schedule */}
        {renderDetailBlock('form.position', t(`position.${employee.position}`))}
        {renderDetailBlock('form.workSchedule', t(`schedule.${employee.workSchedule}`))}
        
        {/* Dates */}
        {renderDetailBlock('form.interviewDate', employee.interviewDate, formatBrazilianDate)}
        {renderDetailBlock('form.testDate', employee.testDate, formatBrazilianDate)}
        {renderDetailBlock('form.admissionDate', employee.admissionDate, formatBrazilianDate)}
        
        {/* Email */}
        {renderDetailBlock('form.email', employee.email)}
        
        {/* Phone and Address (Side by Side) */}
        {renderDetailBlock('form.phone', employee.phone, formatPhone)}
        {renderDetailBlock('form.address', employee.address)}
      </div>
      
      {/* Footer / Print Date */}
      <div className="mt-12 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
        <p>
          {t('receipt.service.location')} - {new Date().toLocaleDateString('pt-BR')}
        </p>
        <p>
          {t('dashboard.title')} - {t('login.subtitle')}
        </p>
      </div>
    </div>
  );
});

EmployeePrintTemplate.displayName = 'EmployeePrintTemplate';

export default EmployeePrintTemplate;