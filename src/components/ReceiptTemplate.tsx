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

// Utility function to capitalize the first letter of each word
const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => {
    if (word.length === 0) return '';
    // Handle conjunctions and prepositions that should remain lowercase
    if (['e', 'de', 'do', 'da', 'dos', 'das', 'a', 'o'].includes(word)) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

// Utility function to convert number to written form (e.g., 100.50 -> cem reais e cinquenta centavos)
const numberToWords = (value: number): string => {
  if (value >= 1000) {
    return `VALOR EXCEDIDO (${formatCurrency(value)})`;
  }

  const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const teens = ['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  const integerPart = Math.floor(value);
  const decimalPart = Math.round((value - integerPart) * 100);

  const convertHundreds = (n: number): string => {
    if (n === 0) return '';
    if (n === 100) return 'cem';
    
    let result = '';
    const h = Math.floor(n / 100);
    const t = n % 100;

    if (h > 0) {
      result += hundreds[h];
      if (t > 0) result += ' e ';
    }

    if (t > 0) {
      if (t < 10) {
        result += units[t];
      } else if (t < 20) {
        result += teens[t - 10];
      } else {
        const ten = Math.floor(t / 10);
        const unit = t % 10;
        result += tens[ten];
        if (unit > 0) result += ' e ' + units[unit];
      }
    }
    return result;
  };

  let result = '';
  
  if (integerPart > 0) {
    const reais = integerPart === 1 ? 'real' : 'reais';
    result += convertHundreds(integerPart) + ' ' + reais;
  }

  if (decimalPart > 0) {
    const centavos = decimalPart === 1 ? 'centavo' : 'centavos';
    const centavosWords = convertHundreds(decimalPart);
    
    if (integerPart > 0) {
      result += ' e ';
    }
    result += centavosWords + ' ' + centavos;
  }
  
  if (result === '') return 'zero reais';

  return result;
};

const ReceiptContent: React.FC<ReceiptTemplateProps> = ({ employee, value, serviceDate, t }) => {
  const formattedValue = formatCurrency(value);
  const valueInWords = capitalizeWords(numberToWords(value));
  
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

      {/* Body Text - Employee Name */}
      <p className="leading-relaxed mb-4">
        {t('receipt.receivedBy')} 
        <UnderlinedText className="w-full text-base font-bold">
          {employee.fullName.toUpperCase()}
        </UnderlinedText>
      </p>
      
      {/* Body Text - CPF and Value in Words */}
      <p className="leading-relaxed mb-4">
        {t('receipt.cpfHolder')} 
        <UnderlinedText className="min-w-[120px] text-base font-bold">
          {employee.cpf}
        </UnderlinedText>
        {' '}
        {t('receipt.receivedFrom')}
        <UnderlinedText className="text-base font-bold">
          {valueInWords}
        </UnderlinedText>,
        {' '}
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

      {/* Footer: Logo and Date/Location (Same Line) */}
      <div className="flex items-center justify-between mt-10 mb-10">
        {/* Left Side: Logo */}
        <div className="flex items-center w-1/2">
          <img src="/logo_rodape.png" alt="Logo Giorgio's Mar Azul" className="w-24 h-auto" />
        </div>
        
        {/* Right Side: Date/Location */}
        <div className="text-right text-sm w-1/2">
          <p className="mb-2">
            {t('receipt.location')} 
            <UnderlinedText className="min-w-[20px]">{day}</UnderlinedText>, 
            <UnderlinedText className="min-w-[80px]">{month.toUpperCase()}</UnderlinedText> DE 
            <UnderlinedText className="min-w-[40px]">{year}</UnderlinedText>
          </p>
        </div>
      </div>
      
      {/* Signature Line (Last Line, Centered) */}
      <div className="flex flex-col items-center mt-10">
        <div className="w-full max-w-xs text-center">
          <div className="border-t border-black w-full"></div>
          <p className="text-xs mt-1">Assinatura.:</p>
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