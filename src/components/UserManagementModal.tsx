import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Pencil,
  Trash2,
  ShieldCheck,
  User as UserIcon,
  Save,
  Loader2,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useToast } from './Toast';
import { SafeUser, UserRole } from '../utils/auth';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  id: string | null;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const EMPTY_FORM: FormState = {
  id: null,
  name: '',
  email: '',
  password: '',
  role: 'user',
};

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, addUser, editUser, removeUser } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const isEditing = form.id !== null;

  const resetForm = () => setForm(EMPTY_FORM);

  const startEdit = (user: SafeUser) => {
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      showToast('Nama dan email wajib diisi.', 'info');
      return;
    }
    if (!isEditing && !form.password) {
      showToast('Password wajib diisi untuk akun baru.', 'info');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing && form.id) {
        await editUser(form.id, {
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password || undefined,
        });
        showToast('Akun berhasil diperbarui.', 'success');
      } else {
        await addUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        showToast('Akun baru berhasil ditambahkan.', 'success');
      }
      resetForm();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal menyimpan akun.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (user: SafeUser) => {
    if (user.id === currentUser?.id) {
      showToast('Anda tidak dapat menghapus akun sendiri.', 'error');
      return;
    }
    const confirmed = window.confirm(
      `Hapus akun "${user.name}" (${user.email})? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    try {
      removeUser(user.id);
      showToast('Akun berhasil dihapus.', 'success');
      if (form.id === user.id) resetForm();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal menghapus akun.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-600 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/80 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Kelola Akun Pengguna</h3>
              <p className="text-xs text-emerald-100">Tambah, edit, atau hapus akun (khusus admin)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup kelola akun"
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-emerald-700/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Form tambah/edit */}
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              {isEditing ? <Pencil className="w-4 h-4 text-emerald-600" /> : <UserPlus className="w-4 h-4 text-emerald-600" />}
              {isEditing ? 'Edit Akun' : 'Tambah Akun Baru'}
            </h4>

            <div>
              <label htmlFor="um-name" className="block text-xs font-medium text-slate-700 mb-1">Nama</label>
              <input
                id="um-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama lengkap"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden text-slate-900"
              />
            </div>

            <div>
              <label htmlFor="um-email" className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input
                id="um-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nama@perusahaan.com"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden text-slate-900"
              />
            </div>

            <div>
              <label htmlFor="um-password" className="block text-xs font-medium text-slate-700 mb-1">
                Password {isEditing && <span className="text-slate-400 font-normal">(kosongkan bila tidak diubah)</span>}
              </label>
              <input
                id="um-password"
                type="text"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={isEditing ? '••••••••' : 'Password akun'}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden text-slate-900"
              />
            </div>

            <div>
              <label htmlFor="um-role" className="block text-xs font-medium text-slate-700 mb-1">Peran</label>
              <select
                id="um-role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden text-slate-900"
              >
                <option value="user">User (hanya edit kartu)</option>
                <option value="admin">Admin (kelola akun)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isEditing ? 'Simpan' : 'Tambah'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                >
                  Batal
                </button>
              )}
            </div>
          </form>

          {/* Daftar user */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold text-slate-800 mb-2">
              Daftar Akun <span className="text-slate-400 font-medium">({users.length})</span>
            </h4>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-2 p-3 hover:bg-slate-50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        user.role === 'admin'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {user.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                            user.role === 'admin'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {user.role}
                        </span>
                        {user.id === currentUser?.id && (
                          <span className="text-[10px] text-slate-400">(Anda)</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(user)}
                      aria-label={`Edit akun ${user.name}`}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      aria-label={`Hapus akun ${user.name}`}
                      className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <p className="p-4 text-sm text-slate-400 text-center">Belum ada akun.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
