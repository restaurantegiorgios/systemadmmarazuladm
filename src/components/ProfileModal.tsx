import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const [photoPreview, setPhotoPreview] = useState(profile?.avatar_url || '');

  const profileSchema = z.object({
    first_name: z.string().min(1, t('userProfile.error.required')),
    last_name: z.string().min(1, t('userProfile.error.required')),
    avatar_url: z.string().optional(),
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

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url || '',
      });
      setPhotoPreview(profile.avatar_url || '');
    }
  }, [profile, reset, isOpen]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setValue('avatar_url', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    // Update profile table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        avatar_url: data.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      toast.error(profileError.message);
      return;
    }

    // Update password if provided
    if (data.password) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (passwordError) {
        toast.error(passwordError.message);
        return;
      }
    }

    toast.success(t('userProfile.success'));
    onClose();
  };
  
  const currentFirstName = watch('first_name');
  const currentLastName = watch('last_name');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('profile')}</DialogTitle>
          <DialogDescription>{t('form.personalData')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-h-[70vh] overflow-y-auto p-1 pr-4 -mr-4 space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="w-24 h-24">
                <AvatarImage src={photoPreview} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                  {currentFirstName?.[0]}{currentLastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{t('userProfile.changePhoto')}</span>
                </div>
                <Input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">{t('userProfile.firstName')}</Label>
                <Input id="first_name" {...register('first_name')} />
                {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">{t('userProfile.lastName')}</Label>
                <Input id="last_name" {...register('last_name')} />
                {errors.last_name && <p className="text-sm text-destructive">{errors.last_name.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t('forgotPassword.newPassword')}</Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('forgotPassword.confirmNewPassword')}</Label>
                <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter className="pt-6">
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent">{t('form.save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;