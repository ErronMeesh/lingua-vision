import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import type { User } from '../types/index';

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    api.getProfile()
      .then(data => {
        setUser(data);
        setNickname(data.nickname || '');
      })
      .catch(() => toast.error('Ошибка загрузки профиля'))
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading('Сохраняем изменения...');
    
    try {
      const result = await api.updateProfile(nickname, selectedFile || undefined, newPassword);
      setNewPassword('');
      if (user) {
        setUser({ ...user, nickname: result.nickname, avatarUrl: result.avatarUrl });
      }
      toast.success(result.message, { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Не удалось сохранить', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return {
    user,
    nickname,
    setNickname,
    newPassword,
    setNewPassword,
    showPassword,
    setShowPassword,
    loading,
    saving,
    fileInputRef,
    previewUrl,
    handleFileChange,
    handleSave
  };
};