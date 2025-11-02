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

// Função para corrigir o problema de fuso horário ao criar datas a partir de strings 'YYYY-MM-DD'
const parseLocalDate = (dateString: string): Date => {
  if (!dateString) return new Date(); // Fallback para segurança
  const [year, month, day] = dateString.split('-').map(Number);
  // O mês no construtor de Date do JavaScript é 0-indexado (0 para Janeiro)
  return new Date(year, month - 1, day);
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
  
  // Usa a função parseLocalDate para evitar problemas de fuso horário
  const dateRealized = parseLocalDate(serviceStartDate);
  const day = dateRealized.getDate().toString().padStart(2, '0');
  const month = (dateRealized.getMonth() + 1).toString().padStart(2, '0');
  const year = dateRealized.getFullYear();
  
  // Service Period
  const formattedStartDate = parseLocalDate(serviceStartDate).toLocaleDateString('pt-BR');
  const formattedEndDate = parseLocalDate(serviceEndDate).toLocaleDateString('pt-BR');
  const servicePeriod = `${formattedStartDate} a ${formattedEndDate}`;


  // Helper component for underlined text
  const UnderlinedText: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <span className={cn("border-b border-black px-1", className)}>
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
    <div className="p-6 border border-black bg-white text-black mx-auto print:border print:p-6 text-sm w-full">
      
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
        {/* Applying whitespace-nowrap to the date realization part */}
        <span className="whitespace-nowrap">
          <UnderlinedText className="min-w-[20px]">{day}</UnderlinedText>/
          <UnderlinedText className="min-w-[20px]">{month}</UnderlinedText>/
          <UnderlinedText className="min-w-[40px]">{year}</UnderlinedText>
        </span>
        {t('receipt.passage.reference')}
        <UnderlinedText className="w-full text-base font-bold">
          {servicePeriod}
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
      <div className="space-y-2 mb-2">
        <p className="leading-relaxed">
          {t('receipt.passage.origin')} 
          <UnderlinedText className="min-w-[150px]">{origin}</UnderlinedText>
        </p>
        <p className="leading-relaxed">
          {t('receipt.passage.destination')} 
          <UnderlinedText className="min-w-[150px]">{destination}</UnderlinedText>
        </p>
        
        {/* Passage Value */}
        <p className="leading-relaxed">
          {t('receipt.passage.passageValue')} 
          <UnderlinedText className="min-w-[100px] text-base font-bold">
            {formattedPassageValue.replace('R$', '').trim()}
          </UnderlinedText>
        </p>
      </div>
      
      {/* Declaration and Logo Section */}
      <div className="relative mt-6 mb-4">
        {/* Logo - Positioned absolutely */}
        <div className="absolute right-0" style={{ top: '-9.5rem' }}>
          <img src="/logo_rodape.png" alt="Logo Giorgio's Mar Azul" className="w-24 h-auto" />
        </div>

        {/* Full Discharge Declaration */}
        <p className="italic text-center pt-2">
          {t('receipt.passage.fullDischarge')}
        </p>
      </div>

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
      <div className="hidden print:block my-8 relative left-[-2cm] w-[calc(100%+4cm)]">
        <div className="border-t border-dashed border-gray-500"></div>
      </div>

      {/* Segunda Via */}
      <ReceiptPassageContent {...props} />

      {/* Linha de Corte Adicional (Apenas visível na impressão) */}
      <div className="hidden print:block my-8 relative left-[-2cm] w-[calc(100%+4cm)]">
        <div className="border-t border-dashed border-gray-500"></div>
      </div>
    </div>
  );
});

ReceiptPassageTemplate.displayName = 'ReceiptPassageTemplate';

export default ReceiptPassageTemplate;