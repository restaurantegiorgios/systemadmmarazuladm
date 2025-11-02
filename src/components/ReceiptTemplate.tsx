import React from 'react';
import { Employee } from '@/contexts/EmployeeProvider';
import { cn } from '@/lib/utils';

interface ReceiptTemplateProps {
  employee: Employee;
  value: number;
  serviceStartDate: string; // Changed from serviceDate
  serviceEndDate: string;   // New field
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
  if (value < 0) return 'Valor negativo não suportado';
  if (value === 0) return 'zero reais';

  // Limite de 999.999,99
  if (value >= 1000000) {
    return `VALOR EXCEDIDO (${formatCurrency(value)})`;
  }

  const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const teens = ['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  const integerPart = Math.floor(value);
  const decimalPart = Math.round((value - integerPart) * 100);

  const convertGroup = (n: number, suffix: string = ''): string => {
    if (n === 0) return '';
    
    let result = '';
    const h = Math.floor(n / 100);
    const t = n % 100;

    if (h > 0) {
      if (h === 1 && t === 0) {
        result += 'cem';
      } else {
        result += hundreds[h];
      }
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
    
    if (result) {
      result += suffix;
    }
    return result;
  };

  let result = '';
  let tempInteger = integerPart;

  // Milhares (up to 999)
  const thousands = Math.floor(tempInteger / 1000);
  tempInteger %= 1000;

  if (thousands > 0) {
    if (thousands === 1) {
      result += 'mil';
    } else {
      result += convertGroup(thousands) + ' mil';
    }
    if (tempInteger > 0) {
      // Adiciona 'e' se o restante for menor que 100, ou 'e' se for maior que 100
      if (tempInteger < 100) {
        result += ' e ';
      } else {
        result += ' e '; // Mantendo a regra de 'e' entre grupos
      }
    }
  }

  // Centenas (up to 999)
  if (tempInteger > 0) {
    result += convertGroup(tempInteger);
  }
  
  // Adicionar a moeda (reais)
  if (integerPart > 0) {
    const reais = integerPart === 1 ? 'real' : 'reais';
    result += ' ' + reais;
  }

  // Adicionar centavos
  if (decimalPart > 0) {
    const centavos = decimalPart === 1 ? 'centavo' : 'centavos';
    const centavosWords = convertGroup(decimalPart);
    
    if (integerPart > 0) {
      result += ' e ';
    }
    result += centavosWords + ' ' + centavos;
  }
  
  // Limpeza final e capitalização
  return result.trim();
};

// Função para corrigir o problema de fuso horário ao criar datas a partir de strings 'YYYY-MM-DD'
const parseLocalDate = (dateString: string): Date => {
  if (!dateString) return new Date(); // Fallback para segurança
  const [year, month, day] = dateString.split('-').map(Number);
  // O mês no construtor de Date do JavaScript é 0-indexado (0 para Janeiro)
  return new Date(year, month - 1, day);
};

const ReceiptContent: React.FC<ReceiptTemplateProps> = ({ employee, value, serviceStartDate, serviceEndDate, t }) => {
  const formattedValue = formatCurrency(value);
  const valueOnly = formattedValue.replace('R$', '').trim(); // Valor sem o R$
  const valueInWords = capitalizeWords(numberToWords(value));
  
  // Usa a função parseLocalDate para evitar problemas de fuso horário
  const date = parseLocalDate(serviceEndDate);
  const day = date.getDate();
  const month = date.toLocaleDateString('pt-BR', { month: 'long' });
  const year = date.getFullYear();
  
  const formattedStartDate = parseLocalDate(serviceStartDate).toLocaleDateString('pt-BR');
  const formattedEndDate = parseLocalDate(serviceEndDate).toLocaleDateString('pt-BR');
  const servicePeriod = `${formattedStartDate} a ${formattedEndDate}`;

  // Helper component for underlined text (used only for body text now)
  const UnderlinedText: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <span className={cn("border-b border-black px-1", className)}>
      {children}
    </span>
  );

  return (
    <div className="p-6 border border-black bg-white text-black mx-auto print:border print:p-6 text-sm w-full">
      
      {/* Header: RECIBO R$: ________ */}
      <div className="relative flex justify-center items-end mb-6">
        <h2 className="text-2xl font-bold">{t('receipt.service.receiptTitle')}</h2>
        <div className="absolute right-0 bottom-0 text-2xl font-bold flex items-center">
          R$: <span className="text-2xl font-extrabold ml-1">{valueOnly}</span>
        </div>
      </div>

      {/* Body Text - Employee Name */}
      <p className="leading-relaxed mb-4">
        {t('receipt.service.receivedBy')} 
        <UnderlinedText className="w-full text-base font-bold">
          {employee.fullName.toUpperCase()}
        </UnderlinedText>
      </p>
      
      {/* Body Text - CPF and Value in Words */}
      <p className="leading-relaxed mb-4">
        {t('receipt.service.cpfHolder')} 
        <UnderlinedText className="min-w-[120px] text-base font-bold">
          {employee.cpf}
        </UnderlinedText>
        {' '}
        {t('receipt.service.receivedFrom')}
        <UnderlinedText className="text-base font-bold">
          {valueInWords}
        </UnderlinedText>,
        {' '}
        {t('receipt.service.serviceReference')}
        {' '}
        {t('receipt.service.serviceDateLabel')}
        <UnderlinedText className="min-w-[180px] text-base font-bold">
          {servicePeriod}
        </UnderlinedText>.
      </p>

      {/* Note */}
      <p className="font-semibold italic mt-4 mb-4">
        {t('receipt.service.note')}
      </p>

      {/* Footer: Logo and Date/Location (Same Line) */}
      <div className="flex items-center justify-between mt-7 mb-7">
        {/* Left Side: Logo */}
        <div className="flex items-center w-1/3">
          {/* Using the static path for the logo */}
          <img src="/logo_rodape.png" alt="Logo Giorgio's Mar Azul" className="w-24 h-auto" />
        </div>
        
        {/* Right Side: Date/Location */}
        <div className="text-right text-sm w-2/3">
          {/* Corrigindo o espaçamento para a formatação correta */}
          <p className="mb-2 whitespace-nowrap">
            {t('receipt.service.location')}{' '}
            <UnderlinedText className="min-w-[20px]">{day}</UnderlinedText>,{' '}
            <UnderlinedText className="min-w-[80px]">{month.toUpperCase()}</UnderlinedText> DE{' '}
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
      className="w-full mx-auto shadow-lg print:shadow-none print:w-auto print:max-w-none"
    >
      {/* Primeira Via */}
      <ReceiptContent {...props} />

      {/* Linha de Corte (Apenas visível na impressão) */}
      <div className="hidden print:block my-8 relative left-[-2cm] w-[calc(100%+4cm)]">
        <div className="border-t border-dashed border-gray-500"></div>
      </div>

      {/* Segunda Via */}
      <ReceiptContent {...props} />

      {/* Linha de Corte Adicional (Apenas visível na impressão) */}
      <div className="hidden print:block my-8 relative left-[-2cm] w-[calc(100%+4cm)]">
        <div className="border-t border-dashed border-gray-500"></div>
      </div>
    </div>
  );
});

ReceiptTemplate.displayName = 'ReceiptTemplate';

export default ReceiptTemplate;