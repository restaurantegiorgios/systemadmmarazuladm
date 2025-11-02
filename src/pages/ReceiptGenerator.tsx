import React, { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEmployees, Employee } from '@/contexts/EmployeeProvider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Printer, FileText } from 'lucide-react';
import { toast } from 'sonner';
import ReceiptTemplate from '@/components/ReceiptTemplate';
import ReceiptPassageTemplate from '@/components/ReceiptPassageTemplate';

type ReceiptType = 'service' | 'passage';

interface ServiceReceiptData {
  type: 'service';
  employee: Employee;
  value: number;
  serviceStartDate: string; // Updated
  serviceEndDate: string;   // New
}

interface PassageReceiptData {
  type: 'passage';
  employee: Employee;
  value: number;
  serviceStartDate: string; // Changed from serviceDate
  serviceEndDate: string;   // New
  paymentMethod: string;
  otherPaymentMethod: string;
  origin: string;
  destination: string;
  passageValue: number;
}

type GeneratedReceipt = ServiceReceiptData | PassageReceiptData | null;

const ReceiptGenerator = () => {
  const { t } = useLanguage();
  const { employees, getEmployeeById } = useEmployees();
  const receiptRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().split('T')[0];

  const [receiptType, setReceiptType] = useState<ReceiptType>('service');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [paymentValue, setPaymentValue] = useState<string>('');
  
  // Common Date States (used for both types)
  const [serviceStartDate, setServiceStartDate] = useState<string>(today);
  const [serviceEndDate, setServiceEndDate] = useState<string>(today);
  
  // Passage Receipt specific states
  const [passagePaymentMethod, setPassagePaymentMethod] = useState('');
  const [passageOtherPaymentMethod, setPassageOtherPaymentMethod] = useState('');
  const [passageOrigin, setPassageOrigin] = useState('');
  const [passageDestination, setPassageDestination] = useState('');
  const [passageValueInput, setPassageValueInput] = useState<string>('');

  const [generatedReceipt, setGeneratedReceipt] = useState<GeneratedReceipt>(null);

  const selectedEmployee = selectedEmployeeId ? getEmployeeById(selectedEmployeeId) : null;

  const handleReceiptTypeChange = (value: ReceiptType) => {
    setReceiptType(value);
    setGeneratedReceipt(null); // Clear generated receipt when type changes
  };

  const formatCurrencyInput = (value: string): string => {
    let cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 0) return '';
    
    const cents = parseInt(cleanValue, 10);
    const reais = (cents / 100).toFixed(2).replace('.', ',');
    
    // Add thousands separator
    const parts = reais.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return parts.join(',');
  };

  const cleanCurrencyValue = (value: string): number => {
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentValue(formatCurrencyInput(e.target.value));
  };
  
  const handlePassageValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassageValueInput(formatCurrencyInput(e.target.value));
  };
  
  const validateDates = (start: string, end: string) => {
    if (!start || !end) {
      toast.error(t('receipt.error.invalidDate'));
      return false;
    }
    if (new Date(start) > new Date(end)) {
      toast.error("A data de início não pode ser posterior à data de fim.");
      return false;
    }
    return true;
  }

  const handleGenerateReceipt = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee) {
      toast.error(t('receipt.error.selectEmployee'));
      setGeneratedReceipt(null);
      return;
    }

    const numericValue = cleanCurrencyValue(paymentValue);

    if (isNaN(numericValue) || numericValue <= 0) {
      toast.error(t('receipt.error.invalidValue'));
      setGeneratedReceipt(null);
      return;
    }
    
    if (!validateDates(serviceStartDate, serviceEndDate)) {
      setGeneratedReceipt(null);
      return;
    }
    
    if (receiptType === 'service') {
      setGeneratedReceipt({
        type: 'service',
        employee: selectedEmployee,
        value: numericValue,
        serviceStartDate: serviceStartDate,
        serviceEndDate: serviceEndDate,
      });
    } else if (receiptType === 'passage') {
      const numericPassageValue = cleanCurrencyValue(passageValueInput);

      if (!passageOrigin) {
        toast.error(t('receipt.passage.error.originRequired'));
        return;
      }
      if (!passageDestination) {
        toast.error(t('receipt.passage.error.destinationRequired'));
        return;
      }
      if (!passagePaymentMethod) {
        toast.error(t('receipt.passage.error.paymentMethodRequired'));
        return;
      }
      if (passagePaymentMethod === 'other' && !passageOtherPaymentMethod) {
        toast.error(t('receipt.passage.error.paymentMethodRequired'));
        return;
      }
      if (isNaN(numericPassageValue) || numericPassageValue <= 0) {
        toast.error(t('receipt.error.invalidValue'));
        return;
      }

      setGeneratedReceipt({
        type: 'passage',
        employee: selectedEmployee,
        value: numericValue,
        serviceStartDate: serviceStartDate,
        serviceEndDate: serviceEndDate,
        paymentMethod: passagePaymentMethod,
        otherPaymentMethod: passageOtherPaymentMethod,
        origin: passageOrigin,
        destination: passageDestination,
        passageValue: numericPassageValue,
      });
    }
  };

  const handlePrint = () => {
    if (generatedReceipt && receiptRef.current) {
      const printContent = receiptRef.current.innerHTML;
      const printWindow = window.open('', '', 'height=600,width=800');
      
      if (printWindow) {
        printWindow.document.write('<html><head><title>Recibo</title>');
        // Include the application\'s CSS for Tailwind print styles to work
        printWindow.document.write('<link rel="stylesheet" href="/src/index.css" />');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<style>');
        // CSS para tentar suprimir cabeçalhos/rodapés e garantir fundo branco
        printWindow.document.write(`
          @media print { 
            /* Define margens mínimas para a página */
            @page { 
              margin: 0 2cm !important; /* Margem de 2cm apenas nas laterais */
            }
            body { 
              margin: 0; 
              -webkit-print-color-adjust: exact; /* Força a impressão de cores/fundos */
              print-color-adjust: exact;
              background-color: white !important;
            } 
            .print-only { 
              display: block !important; 
            } 
            /* Tenta forçar a impressão de fundos e cores */
            * {
              color: #000 !important;
              background: transparent !important;
              box-shadow: none !important;
              text-shadow: none !important;
            }
          }
        `);
        printWindow.document.write('</style>');
        // Remove o padding do container principal na impressão para usar a margem definida no @page
        printWindow.document.write('<div class="print:p-0">'); 
        printWindow.document.write(printContent);
        printWindow.document.write('</div>');
        printWindow.document.write('</body></html>');
        
        printWindow.document.close();
        
        printWindow.onload = () => {
          printWindow.print();
        };
      } else {
        toast.error("Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está ativo.");
      }
    }
  };

  const renderReceiptTemplate = () => {
    if (!generatedReceipt) return (
      <div className="p-12 text-center text-muted-foreground border border-dashed rounded-lg w-full max-w-xl">
        {t('receipt.generate')}
      </div>
    );

    if (generatedReceipt.type === 'service') {
      return (
        <ReceiptTemplate 
          ref={receiptRef}
          employee={generatedReceipt.employee}
          value={generatedReceipt.value}
          serviceStartDate={generatedReceipt.serviceStartDate}
          serviceEndDate={generatedReceipt.serviceEndDate}
          t={t}
        />
      );
    }

    if (generatedReceipt.type === 'passage') {
      return (
        <ReceiptPassageTemplate 
          ref={receiptRef}
          employee={generatedReceipt.employee}
          value={generatedReceipt.value}
          serviceStartDate={generatedReceipt.serviceStartDate} // Pass start date
          serviceEndDate={generatedReceipt.serviceEndDate}     // Pass end date
          paymentMethod={generatedReceipt.paymentMethod}
          otherPaymentMethod={generatedReceipt.otherPaymentMethod}
          origin={generatedReceipt.origin}
          destination={generatedReceipt.destination}
          passageValue={generatedReceipt.passageValue}
          t={t}
        />
      );
    }
    return null;
  };
  
  const renderServiceDateFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="service-start-date">{t('receipt.serviceDate')} (Início)</Label>
        <Input
          id="service-start-date"
          type="date"
          value={serviceStartDate}
          onChange={(e) => setServiceStartDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="service-end-date">{t('receipt.serviceDate')} (Fim)</Label>
        <Input
          id="service-end-date"
          type="date"
          value={serviceEndDate}
          onChange={(e) => setServiceEndDate(e.target.value)}
          required
        />
      </div>
    </div>
  );

  const renderPassageFields = () => (
    <>
      {/* Date Realized Field (using serviceStartDate) */}
      <div className="space-y-2">
        <Label htmlFor="passage-date">{t('receipt.passage.dateRealizedLabel')}</Label>
        <Input
          id="passage-date"
          type="date"
          value={serviceStartDate}
          onChange={(e) => setServiceStartDate(e.target.value)}
          required
        />
      </div>
      
      {/* Service Period Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="service-start-date">{t('receipt.serviceDate')} (Início)</Label>
          <Input
            id="service-start-date"
            type="date"
            value={serviceStartDate}
            onChange={(e) => setServiceStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-end-date">{t('receipt.serviceDate')} (Fim)</Label>
          <Input
            id="service-end-date"
            type="date"
            value={serviceEndDate}
            onChange={(e) => setServiceEndDate(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>{t('receipt.passage.paymentMethod')}</Label>
        <RadioGroup 
          value={passagePaymentMethod} 
          onValueChange={setPassagePaymentMethod}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash">{t('receipt.passage.paymentMethod.cash')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pix" id="pix" />
            <Label htmlFor="pix">{t('receipt.passage.paymentMethod.pix')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="transfer" id="transfer" />
            <Label htmlFor="transfer">{t('receipt.passage.paymentMethod.transfer')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">{t('receipt.passage.paymentMethod.other')}</Label>
          </div>
        </RadioGroup>
        {passagePaymentMethod === 'other' && (
          <Input 
            placeholder="Especifique a forma de pagamento"
            value={passageOtherPaymentMethod}
            onChange={(e) => setPassageOtherPaymentMethod(e.target.value)}
            className="mt-2"
            required
          />
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="passage-origin">{t('receipt.passage.origin')}</Label>
          <Input 
            id="passage-origin" 
            value={passageOrigin} 
            onChange={(e) => setPassageOrigin(e.target.value)} 
            placeholder={t('receipt.passage.originPlaceholder')}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passage-destination">{t('receipt.passage.destination')}</Label>
          <Input 
            id="passage-destination" 
            value={passageDestination} 
            onChange={(e) => setPassageDestination(e.target.value)} 
            placeholder={t('receipt.passage.destinationPlaceholder')}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="passage-value-input">{t('receipt.passage.passageValue')}</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
          <Input
            id="passage-value-input"
            type="text"
            value={passageValueInput}
            onChange={handlePassageValueChange}
            placeholder="0,00"
            className="pl-10 text-right"
            required
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('receipt.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Control Panel */}
          <Card className="lg:col-span-1 h-fit shadow-soft print:hidden">
            <CardHeader>
              <CardTitle>{t('receipt.generate')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateReceipt} className="space-y-4">
                
                {/* Receipt Type Selection */}
                <div className="space-y-2">
                  <Label>{t('receipt.type')}</Label>
                  <Select value={receiptType} onValueChange={handleReceiptTypeChange}>
                    <SelectTrigger id="receipt-type-select">
                      <SelectValue placeholder={t('receipt.type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">{t('receipt.type.service')}</SelectItem>
                      <SelectItem value="passage">{t('receipt.type.passage')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Employee Select */}
                <div className="space-y-2">
                  <Label htmlFor="employee-select">{t('receipt.selectEmployee')}</Label>
                  <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                    <SelectTrigger id="employee-select">
                      <SelectValue placeholder={t('receipt.selectEmployee')} />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.fullName} ({t(`position.${emp.position}`)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Common Fields */}
                <div className="space-y-2">
                  <Label htmlFor="payment-value">{t('receipt.value')}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      id="payment-value"
                      type="text"
                      value={paymentValue}
                      onChange={handleValueChange}
                      placeholder="0,00"
                      className="pl-10 text-right"
                      required
                    />
                  </div>
                </div>

                {/* Date Fields based on Receipt Type */}
                {receiptType === 'service' ? (
                  renderServiceDateFields()
                ) : (
                  renderPassageFields()
                )}
                
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                  <FileText className="mr-2 h-4 w-4" />
                  {t('receipt.generate')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Receipt Preview */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-elegant print:hidden">
              <CardHeader>
                <CardTitle>{t('receipt.receiptTemplate')}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                {renderReceiptTemplate()}
              </CardContent>
            </Card>
            
            {generatedReceipt && (
              <div className="flex justify-end print:hidden">
                <Button onClick={handlePrint} variant="secondary">
                  <Printer className="mr-2 h-4 w-4" />
                  {t('receipt.print')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReceiptGenerator;