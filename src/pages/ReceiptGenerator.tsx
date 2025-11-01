import React, { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEmployees, Employee } from '@/contexts/EmployeeProvider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const ReceiptGenerator = () => {
  const { t } = useLanguage();
  const { employees, getEmployeeById } = useEmployees();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [paymentValue, setPaymentValue] = useState<string>('');
  const [serviceDate, setServiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [generatedReceipt, setGeneratedReceipt] = useState<{ employee: Employee, value: number, serviceDate: string } | null>(null);

  const selectedEmployee = selectedEmployeeId ? getEmployeeById(selectedEmployeeId) : null;

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    if (value.length > 0) {
      // Convert to cents, then format as R$ X.XXX,XX
      const cents = parseInt(value, 10);
      const reais = (cents / 100).toFixed(2).replace('.', ',');
      
      // Add thousands separator (optional, but good for display)
      const parts = reais.split(',');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      setPaymentValue(parts.join(','));
    } else {
      setPaymentValue('');
    }
  };

  const handleGenerateReceipt = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee) {
      toast.error(t('receipt.error.selectEmployee'));
      setGeneratedReceipt(null);
      return;
    }

    // Clean value for calculation (convert R$ X.XXX,XX back to number)
    const cleanValue = paymentValue.replace(/\./g, '').replace(',', '.');
    const numericValue = parseFloat(cleanValue);

    if (isNaN(numericValue) || numericValue <= 0) {
      toast.error(t('receipt.error.invalidValue'));
      setGeneratedReceipt(null);
      return;
    }
    
    if (!serviceDate) {
        toast.error(t('receipt.error.invalidDate'));
        setGeneratedReceipt(null);
        return;
    }

    setGeneratedReceipt({
      employee: selectedEmployee,
      value: numericValue,
      serviceDate: serviceDate,
    });
  };

  const handlePrint = () => {
    if (generatedReceipt) {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('receipt.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Control Panel */}
          <Card className="lg:col-span-1 h-fit shadow-soft">
            <CardHeader>
              <CardTitle>{t('receipt.generate')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateReceipt} className="space-y-4">
                
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

                {/* Payment Value Input */}
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

                {/* Service Date Input */}
                <div className="space-y-2">
                  <Label htmlFor="service-date">{t('receipt.serviceDate')}</Label>
                  <Input
                    id="service-date"
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                  <FileText className="mr-2 h-4 w-4" />
                  {t('receipt.generate')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Receipt Preview */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>{t('receipt.receiptTemplate')}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                {generatedReceipt ? (
                  <ReceiptTemplate 
                    ref={receiptRef}
                    employee={generatedReceipt.employee}
                    value={generatedReceipt.value}
                    serviceDate={generatedReceipt.serviceDate}
                    t={t}
                  />
                ) : (
                  <div className="p-12 text-center text-muted-foreground border border-dashed rounded-lg w-full max-w-xl">
                    {t('receipt.generate')}
                  </div>
                )}
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