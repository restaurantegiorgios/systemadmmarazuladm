import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, User } from '@/contexts/UserContext';
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

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { currentUser, updateUser } = useUser();
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

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ProfileFormValues>();

  useEffect(() => {
    if (currentUser) {
      reset({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        photo: currentUser.photo || '',
      });
      setPhotoPreview(currentUser.photo || '');
    }
  }, [currentUser, reset, isOpen]);

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
      onClose();
    } else {
      toast.error(result.error ? t(result.error) : t('userProfile.error'));
    }
  };
  
  const currentFirstName = watch('firstName');
  const currentLastName = watch('lastName');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('userProfile.title')}</DialogTitle>
          <DialogDescription>{t('userProfile.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
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

          <div className="grid grid-cols-2 gap-4">
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
          <DialogFooter>
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent">{t('userProfile.save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;