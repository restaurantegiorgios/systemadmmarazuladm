import React from 'react';
import { Employee } from '@/contexts/EmployeeProvider';
import { cn } from '@/lib/utils';

interface ReceiptPassageTemplateProps {
  employee: Employee;
  value: number;
  serviceStartDate: string; // Used for date realized and period start
  serviceEndDate: string;   // Used for period end
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
  serviceEndDate,
  paymentMethod,
  otherPaymentMethod,
  origin,
  destination,
  passageValue,
  t,
}) => {
  const formattedValue = formatCurrency(value);
  const formattedPassageValue = formatCurrency(passageValue);
  
  // Date Realized (using serviceStartDate)
  const dateRealized = new Date(serviceStartDate);
  const day = dateRealized.getDate().toString().padStart(2, '0');
  const month = (dateRealized.getMonth() + 1).toString().padStart(2, '0');
  const year = dateRealized.getFullYear();
  
  // Service Period
  const formattedStartDate = new Date(serviceStartDate).toLocaleDateString('pt-BR');
  const formattedEndDate = new Date(serviceEndDate).toLocaleDateString('pt-BR');
  const servicePeriod = `${formattedStartDate} a ${formattedEndDate}`;


  // Helper component for underlined text that adapts to content size
  const UnderlinedText: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <span className={cn("inline-block border-b border-black px-1", className)}>
      {children}
    </span>
  );
  
  const renderPaymentMethod = () => {
    if (paymentMethod === 'other') {
      return (
        <p className="leading-relaxed">
          {t('receipt.passage.paymentMethod.other')} 
          <UnderlinedText className="min-w-[100px] text-base font-bold">
            {otherPaymentMethod.toUpperCase()}
          </UnderlinedText>
        </p>
      );
    }
    // If cash, pix, or transfer, display the method name underlined
    return (
      <p className="leading-relaxed">
        {t('receipt.passage.paymentMethod')} 
        <UnderlinedText className="min-w-[100px] text-base font-bold">
          {t(`receipt.passage.paymentMethod.${paymentMethod}`).toUpperCase()}
        </UnderlinedText>
      </p>
    );
  };

  return (
    <div className="p-6 border border-gray-300 bg-white text-black mx-auto print:border-none print:p-0 text-sm w-full">
      
      {/* Header */}
      <h2 className="text-xl font-bold text-center mb-6">{t('receipt.passage.declarationTitle')}</h2>

      {/* Essential Information */}
      <div className="space-y-4 mb-6">
        <p className="leading-relaxed">
          {t('dashboard.name')}: 
          <UnderlinedText className="text-base font-bold">
            {employee.fullName.toUpperCase()}
          </UnderlinedText>
        </p>
        
        <p className="leading-relaxed">
          {t('form.cpf')}: 
          <UnderlinedText className="text-base font-bold">
            {employee.cpf}
          </UnderlinedText>
        </p>
        
        <p className="leading-relaxed">
          {t('receipt.value')}: 
          <UnderlinedText className="text-base font-bold">
            {formattedValue}
          </UnderlinedText>
        </p>
        
        <p className="leading-relaxed">
          {t('receipt.passage.dateRealizedLabel')}: 
          <UnderlinedText className="text-base font-bold">
            {day}/{month}/{year}
          </UnderlinedText>
        </p>
        
        <p className="leading-relaxed">
          {t('receipt.serviceDate')}: 
          <UnderlinedText className="text-base font-bold">
            {servicePeriod}
          </UnderlinedText>
        </p>
        
        <p className="leading-relaxed">
          {t('receipt.passage.origin')}: 
          <UnderlinedText className="text-base font-bold">
            {origin}
          </UnderlinedText>
        </p>
        
        <p className="leading-relaxed">
          {t('receipt.passage.destination')}: 
          <UnderlinedText className="text-base font-bold">
            {destination}
          </UnderlinedText>
        </p>
        
        <p className="leading-relaxed">
          {t('receipt.passage.passageValue')}: 
          <UnderlinedText className="text-base font-bold">
            {formattedPassageValue}
          </UnderlinedText>
        </p>
      </div>

      {/* Payment Method (Simplified) */}
      <div className="mb-10 space-y-2">
        {renderPaymentMethod()}
      </div>

      {/* Signature Lines (Only lines and labels) */}
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