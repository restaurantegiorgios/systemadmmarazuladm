import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEmployees } from '@/contexts/EmployeeProvider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Trash2, FileText } from 'lucide-react';

const EmployeeProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { getEmployeeById, addDocument, deleteDocument } = useEmployees();
  const navigate = useNavigate();
  const employee = id ? getEmployeeById(id) : null;

  const [docType, setDocType] = useState('rg');
  const [fileName, setFileName] = useState('');

  if (!employee) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl">Funcionário não encontrado</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      toast.error('Selecione um arquivo');
      return;
    }
    
    addDocument(employee.id, {
      type: docType,
      fileName: fileName,
    });
    
    toast.success('Documento enviado com sucesso!');
    setFileName('');
  };

  const handleDeleteDoc = (docId: string) => {
    deleteDocument(employee.id, docId);
    toast.success(t('profile.docDeleted'));
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
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{employee.fullName}</h1>
                <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                  {t(`dashboard.${employee.status}`)}
                </Badge>
              </div>
              <Button onClick={() => navigate(`/employee/edit/${employee.id}`)}>
                {t('dashboard.edit')}
              </Button>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="details">{t('profile.details')}</TabsTrigger>
                <TabsTrigger value="documents">{t('profile.documents')}</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-muted-foreground">{t('form.fullName')}</Label>
                    <p className="text-lg font-medium">{employee.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t('form.cpf')}</Label>
                    <p className="text-lg font-medium">{employee.cpf}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t('form.position')}</Label>
                    <p className="text-lg font-medium">{t(`position.${employee.position}`)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t('form.admissionDate')}</Label>
                    <p className="text-lg font-medium">
                      {new Date(employee.admissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t('form.email')}</Label>
                    <p className="text-lg font-medium">{employee.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t('form.phone')}</Label>
                    <p className="text-lg font-medium">{employee.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-muted-foreground">{t('form.address')}</Label>
                    <p className="text-lg font-medium">{employee.address}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <Card className="bg-secondary/50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{t('form.uploadDoc')}</h3>
                    <form onSubmit={handleUpload} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="docType">{t('form.docType')}</Label>
                        <Select value={docType} onValueChange={setDocType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card z-50">
                            <SelectItem value="rg">{t('docType.rg')}</SelectItem>
                            <SelectItem value="cpf">{t('docType.cpf')}</SelectItem>
                            <SelectItem value="medical">{t('docType.medical')}</SelectItem>
                            <SelectItem value="contract">{t('docType.contract')}</SelectItem>
                            <SelectItem value="other">{t('docType.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="file">{t('form.selectFile')}</Label>
                        <Input
                          id="file"
                          type="text"
                          placeholder="nome_do_arquivo.pdf"
                          value={fileName}
                          onChange={(e) => setFileName(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                        <Upload className="mr-2 h-4 w-4" />
                        {t('form.upload')}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('profile.uploadedDocs')}</h3>
                  {employee.documents.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      {t('profile.noDocuments')}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {employee.documents.map((doc) => (
                        <Card key={doc.id} className="hover:shadow-soft transition-shadow">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <p className="font-medium">{doc.fileName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {t(`docType.${doc.type}`)} • {new Date(doc.uploadDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDoc(doc.id)}
                              title={t('profile.deleteDoc')}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmployeeProfile;
