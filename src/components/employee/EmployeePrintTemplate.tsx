import React from 'react';
import { Employee, Document } from '@/contexts/EmployeeProvider';
import { cn } from '@/lib/utils';
import { FileText, User } from 'lucide-react';

interface EmployeePrintTemplateProps {
  employee: Employee;
  t: (key: string) => string;
  getInitials: (fullName: string) => string;
}

// Utility function to format date
const formatDate = (dateString: string, t: (key: string) => string) => {
  if (!dateString) return t('form.notAvailable');
  try {
    return new Date(dateString).toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
};

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
  
  const renderDetail = (labelKey: string, value: string | undefined, formatter?: (v: string) => string) => {
    const displayValue = value ? (formatter ? formatter(value) : value) : t('form.notAvailable');
    return (
      <div className="flex justify-between border-b border-gray-200 py-2">
        <span className="font-medium text-gray-600">{t(labelKey)}:</span>
        <span className="font-semibold text-gray-800">{displayValue}</span>
      </div>
    );
  };

  // Document rendering function is no longer needed, but keeping the structure clean.
  // const renderDocument = (doc: Document) => (...);

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

      {/* Employee Summary */}
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

      {/* Personal Details */}
      <h3 className="text-lg font-bold mb-4 border-b pb-1">{t('form.personalData')}</h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-8">
        <div className="col-span-2">
          {renderDetail('form.address', employee.address)}
        </div>
        {renderDetail('form.cpf', employee.cpf, formatCPF)}
        {renderDetail('form.phone', employee.phone, formatPhone)}
        {renderDetail('form.email', employee.email)}
        {renderDetail('form.workSchedule', t(`schedule.${employee.workSchedule}`))}
        {renderDetail('form.interviewDate', employee.interviewDate, (v) => formatDate(v, t))}
        {renderDetail('form.testDate', employee.testDate, (v) => formatDate(v, t))}
        {renderDetail('form.admissionDate', employee.admissionDate, (v) => formatDate(v, t))}
      </div>

      {/* Documents section removed as requested */}
      
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