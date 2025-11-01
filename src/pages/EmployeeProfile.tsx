import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEmployees, Employee, Document } from '@/contexts/EmployeeProvider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Trash2, FileText, User, Save, X, Edit, Download } from 'lucide-react';

const EmployeeProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { getEmployeeById, updateEmployee, addDocument, deleteDocument } = useEmployees();
  const navigate = useNavigate();
  
  const initialEmployee = id ? getEmployeeById(id) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<Partial<Employee>>({});
  
  const [docType, setDocType] = useState('rg');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialEmployee) {
      setEditableData({
        fullName: initialEmployee.fullName,
        cpf: initialEmployee.cpf,
        position: initialEmployee.position,
        admissionDate: initialEmployee.admissionDate,
        email: initialEmployee.email,
        phone: initialEmployee.phone,
        address: initialEmployee.address,
        status: initialEmployee.status,
        photo: initialEmployee.photo,
      });
    }
  }, [initialEmployee]);

  if (!initialEmployee) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    let formattedValue = value;

    if (id === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (id === 'phone') {
      formattedValue = formatPhone(value);
    }

    setEditableData(prev => ({ ...prev, [id]: formattedValue }));
  };

  const handleSelectChange = (id: keyof Employee, value: string) => {
    setEditableData(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditableData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!id) return;

    // Basic validation check for required fields
    if (!editableData.fullName || !editableData.cpf || !editableData.admissionDate || !editableData.email || !editableData.phone || !editableData.address) {
        toast.error(t('form.error'));
        return;
    }

    updateEmployee(id, editableData);
    toast.success(t('form.success'));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset data to initial state
    setEditableData({
      fullName: initialEmployee.fullName,
      cpf: initialEmployee.cpf,
      position: initialEmployee.position,
      admissionDate: initialEmployee.admissionDate,
      email: initialEmployee.email,
      phone: initialEmployee.phone,
      address: initialEmployee.address,
      status: initialEmployee.status,
      photo: initialEmployee.photo,
    });
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Selecione um arquivo para upload');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const fileData = reader.result as string;
      
      addDocument(initialEmployee.id, {
        type: docType,
        fileName: selectedFile.name,
        fileData: fileData,
      });
      
      toast.success('Documento enviado com sucesso!');
      setSelectedFile(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDeleteDoc = (docId: string) => {
    deleteDocument(initialEmployee.id, docId);
    toast.success(t('profile.docDeleted'));
  };
  
  const handleViewDoc = (doc: Document) => {
    // Abre o Base64 em uma nova aba para visualização/impressão
    if (doc.fileData) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<iframe src="${doc.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        newWindow.document.title = doc.fileName;
      } else {
        toast.error("Não foi possível abrir a nova janela. Verifique se o bloqueador de pop-ups está ativo.");
      }
    } else {
      toast.error("Dados do arquivo não encontrados.");
    }
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };

  const currentPhoto = editableData.photo || initialEmployee.photo;
  const currentFullName = editableData.fullName || initialEmployee.fullName;

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <Avatar className="w-20 h-20 shadow-md">
                  <AvatarImage src={currentPhoto} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                    {getInitials(currentFullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-1">{currentFullName}</h1>
                  <Badge variant={initialEmployee.status === 'active' ? 'default' : 'secondary'}>
                    {t(`dashboard.${initialEmployee.status}`)}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="mr-2 h-4 w-4" />
                      {t('form.cancel')}
                    </Button>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent">
                      <Save className="mr-2 h-4 w-4" />
                      {t('form.save')}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t('dashboard.edit')}
                  </Button>
                )}
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="details">{t('profile.details')}</TabsTrigger>
                <TabsTrigger value="documents">{t('profile.documents')}</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                {isEditing && (
                  <div className="flex flex-col items-center space-y-2 mb-6">
                    <Label htmlFor="employee-photo-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>{t('userProfile.changePhoto')} ({t('form.optional')})</span>
                      </div>
                      <Input 
                        id="employee-photo-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                      />
                    </Label>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName" className="text-muted-foreground">{t('form.fullName')}</Label>
                    {isEditing ? (
                      <Input 
                        id="fullName" 
                        value={editableData.fullName || ''} 
                        onChange={handleInputChange} 
                        required
                      />
                    ) : (
                      <p className="text-lg font-medium">{initialEmployee.fullName}</p>
                    )}
                  </div>
                  
                  {/* CPF */}
                  <div>
                    <Label htmlFor="cpf" className="text-muted-foreground">{t('form.cpf')}</Label>
                    {isEditing ? (
                      <Input 
                        id="cpf" 
                        value={editableData.cpf || ''} 
                        onChange={handleInputChange} 
                        maxLength={14}
                        required
                      />
                    ) : (
                      <p className="text-lg font-medium">{initialEmployee.cpf}</p>
                    )}
                  </div>
                  
                  {/* Position */}
                  <div>
                    <Label htmlFor="position" className="text-muted-foreground">{t('form.position')}</Label>
                    {isEditing ? (
                      <Select 
                        value={editableData.position} 
                        onValueChange={(value) => handleSelectChange('position', value)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
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
                    ) : (
                      <p className="text-lg font-medium">{t(`position.${initialEmployee.position}`)}</p>
                    )}
                  </div>
                  
                  {/* Admission Date */}
                  <div>
                    <Label htmlFor="admissionDate" className="text-muted-foreground">{t('form.admissionDate')}</Label>
                    {isEditing ? (
                      <Input 
                        id="admissionDate" 
                        type="date" 
                        value={editableData.admissionDate || ''} 
                        onChange={handleInputChange} 
                        required
                      />
                    ) : (
                      <p className="text-lg font-medium">
                        {new Date(initialEmployee.admissionDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-muted-foreground">{t('form.email')}</Label>
                    {isEditing ? (
                      <Input 
                        id="email" 
                        type="email" 
                        value={editableData.email || ''} 
                        onChange={handleInputChange} 
                        required
                      />
                    ) : (
                      <p className="text-lg font-medium">{initialEmployee.email}</p>
                    )}
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-muted-foreground">{t('form.phone')}</Label>
                    {isEditing ? (
                      <Input 
                        id="phone" 
                        value={editableData.phone || ''} 
                        onChange={handleInputChange} 
                        maxLength={15}
                        required
                      />
                    ) : (
                      <p className="text-lg font-medium">{initialEmployee.phone}</p>
                    )}
                  </div>
                  
                  {/* Address */}
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-muted-foreground">{t('form.address')}</Label>
                    {isEditing ? (
                      <Input 
                        id="address" 
                        value={editableData.address || ''} 
                        onChange={handleInputChange} 
                        required
                      />
                    ) : (
                      <p className="text-lg font-medium">{initialEmployee.address}</p>
                    )}
                  </div>
                  
                  {/* Status */}
                  <div>
                    <Label htmlFor="status" className="text-muted-foreground">{t('form.status')}</Label>
                    {isEditing ? (
                      <Select 
                        value={editableData.status} 
                        onValueChange={(value: 'active' | 'inactive') => handleSelectChange('status', value)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">{t('dashboard.active')}</SelectItem>
                          <SelectItem value="inactive">{t('dashboard.inactive')}</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-lg font-medium">{t(`dashboard.${initialEmployee.status}`)}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <Card className="bg-secondary/50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{t('form.uploadDoc')}</h3>
                    <form onSubmit={handleUpload} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent" disabled={!selectedFile}>
                        <Upload className="mr-2 h-4 w-4" />
                        {t('form.upload')}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('profile.uploadedDocs')}</h3>
                  {initialEmployee.documents.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      {t('profile.noDocuments')}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {initialEmployee.documents.map((doc) => (
                        <Card key={doc.id} className="hover:shadow-soft transition-shadow">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewDoc(doc)}>
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <p className="font-medium hover:underline">{doc.fileName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {t(`docType.${doc.type}`)} • {new Date(doc.uploadDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDoc(doc)}
                                title="Visualizar Documento"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteDoc(doc.id)}
                                title={t('profile.deleteDoc')}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
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