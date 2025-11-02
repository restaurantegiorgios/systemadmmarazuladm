import React from 'react';
import { Employee } from '@/contexts/EmployeeProvider';
import { cn } from '@/lib/utils';

interface ReceiptPassageTemplateProps {
  employee: Employee;
  value: number;
  serviceStartDate: string; // New: Used for date realized
  serviceEndDate: string;   // New: Not explicitly used in text, but passed for consistency
  days: string;
  paymentMethod: string;
  otherPaymentMethod: string;
  origin: string;
  destination: string;
  passageValue: number;
  t: (key: string) => string;
}

// Utility function to convert number to currency format (R$)
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const ReceiptPassageContent: React.FC<ReceiptPassageTemplateProps> = ({
  employee,
  value,
  serviceStartDate,
  days,
  paymentMethod,
  otherPaymentMethod,
  origin,
  destination,
  passageValue,
  t,
}) => {
  const formattedValue = formatCurrency(value);
  const formattedPassageValue = formatCurrency(passageValue);
  
  // Use serviceStartDate as the date realized
  const date = new Date(serviceStartDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  // Helper component for underlined text
  const UnderlinedText: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <span className={cn("inline-block border-b border-black px-1", className)}>
      {children}
    </span>
  );
  
  const renderPaymentMethod = (method: string) => {
    const methods = ['cash', 'pix', 'transfer'];
    if (methods.includes(method)) {
      return (
        <>
          ( {method === paymentMethod ? 'X' : ' ' } ) {t(`receipt.passage.paymentMethod.${method}`)}
        </>
      );
    } else if (method === 'other') {
      return (
        <>
          ( {method === paymentMethod ? 'X' : ' ' } ) {t('receipt.passage.paymentMethod.other')} 
          <UnderlinedText className="min-w-[100px]">{otherPaymentMethod}</UnderlinedText>
        </>
      );
    }
    return null;
  };

  return (
    <div className="p-6 border border-gray-300 bg-white text-black mx-auto print:border-none print:p-0 text-sm w-full">
      
      {/* Header */}
      <h2 className="text-xl font-bold text-center mb-6">{t('receipt.passage.declarationTitle')}</h2>

      {/* Body Text */}
      <p className="leading-relaxed mb-4">
        {t('receipt.passage.receivedBy')} 
        <UnderlinedText className="w-full text-base font-bold">
          {employee.fullName.toUpperCase()}
        </UnderlinedText>, 
        {' '}
        {t('receipt.passage.cpfHolder')} 
        <UnderlinedText className="min-w-[120px] text-base font-bold">
          {employee.cpf}
        </UnderlinedText>, 
        {' '}
        {t('receipt.passage.receivedFrom')}
        <UnderlinedText className="min-w-[100px] text-base font-bold">
          {formattedValue.replace('R$', '').trim()}
        </UnderlinedText>
        {' '}
        {t('receipt.passage.amount')}
        <UnderlinedText className="min-w-[100px] text-base font-bold">
          {formattedValue.replace('R$', '').trim()}
        </UnderlinedText>
        {' '}
        {t('receipt.passage.dateRealized')}
        <UnderlinedText className="min-w-[20px]">{day}</UnderlinedText>/
        <UnderlinedText className="min-w-[20px]">{month}</UnderlinedText>/
        <UnderlinedText className="min-w-[40px]">{year}</UnderlinedText>
        {t('receipt.passage.reference')}
        <UnderlinedText className="w-full text-base font-bold">
          {days}
        </UnderlinedText>.
      </p>

      {/* Payment Method */}
      <div className="mb-4 space-y-2">
        <p className="font-semibold">{t('receipt.passage.paymentMethod')}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {renderPaymentMethod('cash')}
          {renderPaymentMethod('pix')}
          {renderPaymentMethod('transfer')}
          {renderPaymentMethod('other')}
        </div>
      </div>

      {/* Origin, Destination, Passage Value */}
      <div className="space-y-2 mb-6">
        <p className="leading-relaxed">
          {t('receipt.passage.origin')} 
          <UnderlinedText className="min-w-[150px]">{origin}</UnderlinedText>
        </p>
        <p className="leading-relaxed">
          {t('receipt.passage.destination')} 
          <UnderlinedText className="min-w-[150px]">{destination}</UnderlinedText>
        </p>
        <p className="leading-relaxed">
          {t('receipt.passage.passageValue')} 
          <UnderlinedText className="min-w-[100px] text-base font-bold">
            {formattedPassageValue.replace('R$', '').trim()}
          </UnderlinedText>
        </p>
      </div>

      {/* Full Discharge Declaration */}
      <p className="italic text-center mb-10">
        {t('receipt.passage.fullDischarge')}
      </p>

      {/* Signature Lines */}
      <div className="grid grid-cols-2 gap-8 mt-10">
        <div className="flex flex-col items-center">
          <div className="border-t border-black w-full"></div>
          <p className="text-xs mt-1">{t('receipt.passage.receiver')}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="border-t border-black w-full"></div>
          <p className="text-xs mt-1">{t('receipt.passage.responsible')}</p>
        </div>
      </div>
    </div>
  );
};

const ReceiptPassageTemplate = React.forwardRef<HTMLDivElement, ReceiptPassageTemplateProps>((props, ref) => {
  return (
    <div 
      ref={ref} 
      className="w-full mx-auto shadow-lg print:shadow-none print:w-auto print:max-w-none"
    >
      {/* Primeira Via */}
      <ReceiptPassageContent {...props} />

      {/* Linha de Corte (Apenas visível na impressão) */}
      <div className="hidden print:block my-8 border-t border-dashed border-gray-500 text-center text-xs text-gray-500">
        --- {props.t('receipt.type.passage')} (Corte Aqui) ---
      </div>

      {/* Segunda Via */}
      <ReceiptPassageContent {...props} />
    </div>
  );
});

ReceiptPassageTemplate.displayName = 'ReceiptPassageTemplate';

export default ReceiptPassageTemplate;