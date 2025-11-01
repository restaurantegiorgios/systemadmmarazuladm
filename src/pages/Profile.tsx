import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/contexts/UserContext';
import type { User } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { t } = useLanguage();
  const { currentUser, updateUser } = useUser();
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState(currentUser?.photo || '');

  const profileSchema = z.object({
    firstName: z.string().min(1, t('userProfile.error.required')),
    lastName: z.string().min(1, t('userProfile.error.required')),
    email: z.string().email(t('userProfile.error.invalidEmail')),
    photo: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  }).refine(data => {
    if (data.password && data.password.length < 6) return false;
    return true;
  }, {
    message: t('userProfile.error.passwordLength'),
    path: ['password'],
  }).refine(data => data.password === data.confirmPassword, {
    message: t('userProfile.error.passwordMismatch'),
    path: ['confirmPassword'],
  });

  type ProfileFormValues = z.infer<typeof profileSchema>;

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      photo: currentUser?.photo || '',
    }
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setValue('photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    if (!currentUser) return;

    const updateData: Partial<Omit<User, 'id'>> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      photo: data.photo,
    };

    if (data.password) {
      updateData.password = data.password;
    }

    const result = updateUser(currentUser.id, updateData);

    if (result.success) {
      toast.success(t('userProfile.success'));
    } else {
      toast.error(result.error ? t(result.error) : t('userProfile.error'));
    }
  };
  
  const currentFirstName = watch('firstName');
  const currentLastName = watch('lastName');

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <Card className="max-w-2xl mx-auto shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{t('userProfile.title')}</CardTitle>
            <CardDescription>{t('userProfile.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={photoPreview} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                    {currentFirstName?.[0]}{currentLastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Label htmlFor="photo" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{t('userProfile.changePhoto')}</span>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('userProfile.firstName')}</Label>
                  <Input id="firstName" {...register('firstName')} />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('userProfile.lastName')}</Label>
                  <Input id="lastName" {...register('lastName')} />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('login.email')}</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t('userProfile.newPassword')}</Label>
                  <Input id="password" type="password" {...register('password')} />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('userProfile.confirmNewPassword')}</Label>
                  <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
                  {t('userProfile.save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;