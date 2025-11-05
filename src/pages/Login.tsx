import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { PasswordInput } from '@/components/ui/password-input';

const Login = () => {
  const { language, setLanguage, t } = useLanguage();
  const { session } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      toast.error(t('auth.invalidCredentials'));
    } else {
      toast.success(t('login.success'));
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      toast.error(t('auth.passwordsDoNotMatch'));
      return;
    }
    if (regPassword.length < 6) {
      toast.error(t('auth.passwordMinLength'));
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: {
        data: {
          first_name: regFirstName,
          last_name: regLastName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.info(t('auth.checkEmail'));
      setActiveTab('login'); // Switch to login tab
    }
    setLoading(false);
  };
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.info(t('auth.passwordResetSent'));
      setActiveTab('login');
    }
    setLoading(false);
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
          <div className="mx-auto w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center mb-4 bg-white rounded-lg shadow-2xl overflow-hidden">
            <img 
              src="/logo_giorgios_centralizada.png" 
              alt="Logo Giorgio's Mar Azul" 
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-3xl font-bold">{t('login.title')}</CardTitle>
          <CardDescription className="text-lg">{t('login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">{t('login.button')}</TabsTrigger>
              <TabsTrigger value="register">{t('login.register')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t('login.email')}</Label>
                  <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t('login.password')}</Label>
                  <PasswordInput id="login-password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                </div>
                <div className="text-right">
                  <Button type="button" variant="link" className="p-0 h-auto" onClick={() => setActiveTab('forgotPassword')}>
                    {t('forgotPassword.link')}
                  </Button>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {t('login.button')}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-first-name">{t('userProfile.firstName')}</Label>
                    <Input id="reg-first-name" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-last-name">{t('userProfile.lastName')}</Label>
                    <Input id="reg-last-name" value={regLastName} onChange={(e) => setRegLastName(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">{t('login.email')}</Label>
                  <Input id="reg-email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t('login.password')}</Label>
                  <PasswordInput id="reg-password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm-password">{t('auth.confirmPassword')}</Label>
                  <PasswordInput id="reg-confirm-password" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {t('login.register')}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="forgotPassword">
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <p className="text-sm text-muted-foreground">{t('forgotPassword.description')}</p>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">{t('login.email')}</Label>
                  <Input id="forgot-email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {t('forgotPassword.button')}
                </Button>
                <Button variant="link" className="w-full" onClick={() => setActiveTab('login')}>
                  {t('form.cancel')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;