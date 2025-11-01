import React from 'react';
import { Employee } from '@/contexts/EmployeeProvider';

interface ReceiptTemplateProps {
  employee: Employee;
  value: number;
  serviceDate: string;
  t: (key: string) => string;
}

// Utility function to convert number to currency format (R$)
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// Utility function to convert number to written form (e.g., 100.50 -> cem reais e cinquenta centavos)
// NOTE: This is a complex function, for simplicity and elegance, we will use a placeholder for now.
const numberToWords = (value: number): string => {
  // In a real application, this would use a library or a complex function.
  // For now, we return the formatted currency string as a placeholder for the written amount.
  return formatCurrency(value).replace('R$', '').trim();
};

const ReceiptTemplate = React.forwardRef<HTMLDivElement, ReceiptTemplateProps>(({ employee, value, serviceDate, t }, ref) => {
  const formattedValue = formatCurrency(value);
  const valueInWords = numberToWords(value);
  
  const date = new Date(serviceDate);
  const day = date.getDate();
  const month = date.toLocaleDateString('pt-BR', { month: 'long' });
  const year = date.getFullYear();

  return (
    <div 
      ref={ref} 
      className="p-8 border border-gray-300 bg-white text-black max-w-xl mx-auto shadow-lg print:shadow-none print:border-none print:p-0"
      style={{ minHeight: '300px' }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 tracking-widest">{t('receipt.receiptTitle')}</h2>
        <p className="text-xl font-bold border-b border-black pb-1">
          R$: <span className="underline">{formattedValue.replace('R$', '').trim()}</span>
        </p>
      </div>

      <p className="text-base leading-relaxed mb-4">
        {t('receipt.receivedBy')} <span className="font-bold underline">{employee.fullName.toUpperCase()}</span>
        <br />
        {t('receipt.cpfHolder')} <span className="font-bold underline">{employee.cpf}</span> Recebi de GIORGIOS RESTAURANT LTDA
        a importância de <span className="font-bold underline">{valueInWords.toUpperCase()}</span>,
        referente a OS SERVICOS PRESTADOS NO ESTABELECIMENTO. 
        <br />
        {t('receipt.serviceDateLabel')} <span className="font-bold underline">{new Date(serviceDate).toLocaleDateString('pt-BR')}</span>.
      </p>

      <p className="text-sm font-semibold italic mb-6 border-t border-black pt-2">
        {t('receipt.note')}
      </p>

      <div className="text-center mt-10">
        <p className="text-lg font-bold">Giorgio's Mar Azul RESTAURANTE</p>
        <div className="mt-8 border-t border-black pt-2">
          <p className="text-sm">
            {t('receipt.location')} <span className="underline">{day}</span>, <span className="underline">{month.toUpperCase()}</span> DE <span className="underline">{year}</span>
          </p>
        </div>
      </div>
    </div>
  );
});

ReceiptTemplate.displayName = 'ReceiptTemplate';

export default ReceiptTemplate;