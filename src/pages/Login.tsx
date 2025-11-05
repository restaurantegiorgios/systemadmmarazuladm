import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/PasswordInput';

type View = 'login' | 'register' | 'forgot-password';

const Login = () => {
  const { language, setLanguage, t } = useLanguage();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>('login');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(t('error.invalidCredentials'));
    } else {
      toast.success(t('login.success'));
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(t('userProfile.error.passwordLength'));
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      // Supabase doesn't throw an error for existing users with email confirmation enabled.
      // Instead, a successful response with an empty identities array indicates the user already exists and is confirmed.
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error(t('register.error.emailExists'));
      } else {
        toast.info(t('login.checkEmail'));
        setView('login');
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`, // Or a dedicated password reset page
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.info(t('forgotPassword.checkEmail'));
      setView('login');
    }
    setLoading(false);
  };

  const renderForm = () => {
    switch (view) {
      case 'register':
        return (
          <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('userProfile.firstName')}</Label>
                <Input id="firstName" onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('userProfile.lastName')}</Label>
                <Input id="lastName" onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <PasswordInput id="password" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {t('login.register')}
            </Button>
            <Button variant="link" className="w-full" onClick={() => setView('login')}>
              {t('login.backToLogin')}
            </Button>
          </form>
        );
      case 'forgot-password':
        return (
          <form onSubmit={handleForgotPassword} className="space-y-4 animate-fade-in">
            <CardDescription>{t('forgotPassword.description')}</CardDescription>
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {t('forgotPassword.resetButton')}
            </Button>
            <Button variant="link" className="w-full" onClick={() => setView('login')}>
              {t('login.backToLogin')}
            </Button>
          </form>
        );
      default: // login
        return (
          <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <PasswordInput id="password" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="flex justify-between items-center text-sm">
              <Button variant="link" className="p-0 h-auto" onClick={() => setView('register')}>
                {t('login.register')}
              </Button>
              <Button variant="link" className="p-0 h-auto" onClick={() => setView('forgot-password')}>
                {t('forgotPassword.link')}
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {t('login.button')}
            </Button>
          </form>
        );
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

      <Card className="w-full max-w-md shadow-2xl relative z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center mb-4 bg-white rounded-lg shadow-2xl overflow-hidden">
            <img 
              src="/logo_giorgios_centralizada.png" 
              alt="Logo Giorgio's Mar Azul" 
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-3xl font-bold">
            {view === 'forgot-password' ? t('forgotPassword.title') : t('login.title')}
          </CardTitle>
          <CardDescription className="text-lg">{t('login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderForm()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;