import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Globe, Upload } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ForgotPasswordModal from '@/components/ForgotPasswordModal'; // Import the new modal

const Login = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState<string>('');
  
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false); // NEW State

  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { login, register } = useUser();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error(t('login.error'));
      return;
    }

    const success = login(loginEmail, loginPassword);
    
    if (success) {
      toast.success(t('login.success'));
      setTimeout(() => navigate('/dashboard'), 500);
    } else {
      toast.error('Email ou senha incorretos');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !registerEmail || !registerPassword) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (registerPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const result = register({
      firstName,
      lastName,
      email: registerEmail,
      password: registerPassword,
      photo
    });

    if (result.success) {
      toast.success('Cadastro realizado com sucesso!');
      setFirstName('');
      setLastName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      setPhoto('');
    } else {
      toast.error(result.error || 'Erro ao cadastrar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-primary p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
      
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card z-50">
            <DropdownMenuItem onClick={() => setLanguage('pt-BR')} className={language === 'pt-BR' ? 'bg-secondary' : ''}>
              🇧🇷 Português
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('en-US')} className={language === 'en-US' ? 'bg-secondary' : ''}>
              🇺🇸 English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="w-full max-w-md shadow-2xl relative z-10 animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          {/* Aumentando o tamanho do container da logo: w-32 h-20 */}
          <div className="mx-auto w-32 h-20 flex items-center justify-center mb-4">
            <img 
              src="/logo_giorgios_centralizada.png" 
              alt="Logo Giorgio's Mar Azul" 
              className="h-full w-auto"
            />
          </div>
          <CardTitle className="text-3xl font-bold">{t('login.title')}</CardTitle>
          <CardDescription className="text-lg">{t('login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t('login.email')}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="admin@giorgiomar.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t('login.password')}</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="transition-all"
                  />
                </div>
                
                <div className="text-right">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-sm p-0 h-auto text-primary hover:text-accent"
                    onClick={() => setIsForgotPasswordModalOpen(true)} // Open modal
                  >
                    {t('forgotPassword.link')}
                  </Button>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all">
                  {t('login.button')}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={photo} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                      {firstName?.[0]}{lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Label htmlFor="photo" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Foto (Opcional)</span>
                    </div>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email *</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha *</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha *</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all">
                  Cadastrar
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <ForgotPasswordModal 
        isOpen={isForgotPasswordModalOpen} 
        onClose={() => setIsForgotPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default Login;