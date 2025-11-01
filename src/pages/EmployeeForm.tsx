import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEmployees } from '@/contexts/EmployeeProvider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const EmployeeForm = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { addEmployee, updateEmployee, getEmployeeById } = useEmployees();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    position: 'waiter',
    admissionDate: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (isEdit && id) {
      const employee = getEmployeeById(id);
      if (employee) {
        setFormData({
          fullName: employee.fullName,
          cpf: employee.cpf,
          position: employee.position,
          admissionDate: employee.admissionDate,
          email: employee.email,
          phone: employee.phone,
          address: employee.address,
          status: employee.status,
        });
      }
    }
  }, [id, isEdit, getEmployeeById]);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && id) {
      updateEmployee(id, formData);
    } else {
      addEmployee(formData);
    }
    
    toast.success(t('form.success'));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('form.cancel')}
        </Button>

        <Card className="max-w-4xl mx-auto shadow-elegant">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-6">
              {isEdit ? t('form.title.edit') : t('form.title.new')}
            </h1>

            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="personal">{t('form.personalData')}</TabsTrigger>
                  <TabsTrigger value="documents">{t('form.documents')}</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t('form.fullName')}</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">{t('form.cpf')}</Label>
                      <Input
                        id="cpf"
                        required
                        value={formData.cpf}
                        onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                        maxLength={14}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">{t('form.position')}</Label>
                      <Select
                        value={formData.position}
                        onValueChange={(value) => setFormData({ ...formData, position: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card z-50">
                          <SelectItem value="waiter">{t('position.waiter')}</SelectItem>
                          <SelectItem value="chef">{t('position.chef')}</SelectItem>
                          <SelectItem value="souschef">{t('position.souschef')}</SelectItem>
                          <SelectItem value="cook">{t('position.cook')}</SelectItem>
                          <SelectItem value="dishwasher">{t('position.dishwasher')}</SelectItem>
                          <SelectItem value="manager">{t('position.manager')}</SelectItem>
                          <SelectItem value="host">{t('position.host')}</SelectItem>
                          <SelectItem value="bartender">{t('position.bartender')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admissionDate">{t('form.admissionDate')}</Label>
                      <Input
                        id="admissionDate"
                        type="date"
                        required
                        value={formData.admissionDate}
                        onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('form.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('form.phone')}</Label>
                      <Input
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                        maxLength={15}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">{t('form.address')}</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">{t('form.status')}</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card z-50">
                          <SelectItem value="active">{t('dashboard.active')}</SelectItem>
                          <SelectItem value="inactive">{t('dashboard.inactive')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="text-center py-12 text-muted-foreground">
                    <p>{t('profile.noDocuments')}</p>
                    <p className="text-sm mt-2">Use o perfil do funcionário para fazer upload de documentos</p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  {t('form.cancel')}
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
                  {t('form.save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmployeeForm;
