import React from 'react';
import { Employee } from '@/contexts/EmployeeProvider';
import LogoPlaceholder from './LogoPlaceholder';

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

const ReceiptContent: React.FC<ReceiptTemplateProps> = ({ employee, value, serviceDate, t }) => {
  const formattedValue = formatCurrency(value);
  const valueInWords = numberToWords(value);
  
  const date = new Date(serviceDate);
  const day = date.getDate();
  const month = date.toLocaleDateString('pt-BR', { month: 'long' });
  const year = date.getFullYear();

  // Helper component for underlined text
  const UnderlinedText: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <span className={`inline-block border-b border-black px-1 ${className}`}>
      {children}
    </span>
  );

  return (
    <div className="p-6 border border-gray-300 bg-white text-black max-w-xl mx-auto print:border-none print:p-0 text-sm">
      
      {/* Header: RECIBO R$: ________ */}
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold">{t('receipt.receiptTitle')}</h2>
        <div className="text-xl font-bold flex items-center">
          R$: 
          <UnderlinedText className="min-w-[100px] text-right text-lg font-extrabold">
            {formattedValue.replace('R$', '').trim()}
          </UnderlinedText>
        </div>
      </div>

      {/* Body Text */}
      <p className="leading-relaxed mb-4">
        {t('receipt.receivedBy')} 
        <UnderlinedText className="w-full text-base font-bold">
          {employee.fullName.toUpperCase()}
        </UnderlinedText>
      </p>
      
      <p className="leading-relaxed mb-4">
        {t('receipt.cpfHolder')} 
        <UnderlinedText className="min-w-[150px] text-base font-bold">
          {employee.cpf}
        </UnderlinedText>
        {' '}
        {t('receipt.receivedFrom')}
      </p>
      
      <p className="leading-relaxed mb-4">
        <UnderlinedText className="w-full text-base font-bold">
          {valueInWords.toUpperCase()}
        </UnderlinedText>,
        <br />
        {t('receipt.serviceReference')}
        {' '}
        {t('receipt.serviceDateLabel')}
        <UnderlinedText className="min-w-[100px] text-base font-bold">
          {new Date(serviceDate).toLocaleDateString('pt-BR')}
        </UnderlinedText>.
      </p>

      {/* Note */}
      <p className="font-semibold italic mt-6 mb-6">
        {t('receipt.note')}
      </p>

      {/* Footer: Logo and Date/Location */}
      <div className="flex items-end justify-between mt-10">
        <div className="flex flex-col items-center">
          <LogoPlaceholder className="w-20 h-20" />
          <div className="mt-8 border-t border-black pt-2 w-full">
            {/* Signature line */}
            <UnderlinedText className="w-full min-h-[1.5em] block">{''}</UnderlinedText>
          </div>
        </div>
        
        <div className="text-right text-sm">
          <p className="mb-2">
            {t('receipt.location')} 
            <UnderlinedText className="min-w-[20px]">{day}</UnderlinedText>, 
            <UnderlinedText className="min-w-[80px]">{month.toUpperCase()}</UnderlinedText> DE 
            <UnderlinedText className="min-w-[40px]">{year}</UnderlinedText>
          </p>
          <div className="mt-8 border-t border-black pt-2">
            {/* Signature line */}
            <UnderlinedText className="w-full min-h-[1.5em] block">{''}</UnderlinedText>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReceiptTemplate = React.forwardRef<HTMLDivElement, ReceiptTemplateProps>((props, ref) => {
  return (
    <div 
      ref={ref} 
      className="w-full max-w-xl mx-auto shadow-lg print:shadow-none print:w-auto print:max-w-none"
    >
      {/* Primeira Via */}
      <ReceiptContent {...props} />

      {/* Linha de Corte (Apenas visível na impressão) */}
      <div className="hidden print:block my-8 border-t border-dashed border-gray-500 text-center text-xs text-gray-500">
        --- {props.t('receipt.receiptTitle')} (Corte Aqui) ---
      </div>

      {/* Segunda Via */}
      <ReceiptContent {...props} />
    </div>
  );
});

ReceiptTemplate.displayName = 'ReceiptTemplate';

export default ReceiptTemplate;