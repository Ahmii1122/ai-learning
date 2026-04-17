import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import { User, Mail, Lock, ShieldCheck, Key } from "lucide-react";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Profile Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Password Form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await authService.updateProfile({ username, email });
      if (setUser && response.data) {
          setUser(response.data);
      }
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await authService.changePassword({ oldPassword, newPassword });
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
       toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile and security preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Information Section */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
                 <User className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-slate-800">Profile Details</h2>
                 <p className="text-sm font-medium text-slate-400">Update your personal information</p>
              </div>
           </div>

           <form onSubmit={handleUpdateProfile} className="space-y-5">
             <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
             </div>

             <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
             </div>

             <div className="pt-4">
                <Button type="submit" disabled={saving} className="w-full h-11 bg-teal-600 hover:bg-teal-700 shadow-teal-500/25 font-bold">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
             </div>
           </form>
        </div>

        {/* Password & Security Section */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                 <ShieldCheck className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-slate-800">Security</h2>
                 <p className="text-sm font-medium text-slate-400">Update your password</p>
              </div>
           </div>

           <form onSubmit={handleChangePassword} className="space-y-5">
             <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
             </div>

             <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
             </div>

             <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
             </div>

             <div className="pt-4">
                <Button type="submit" disabled={saving || !oldPassword || !newPassword || !confirmPassword} className="w-full h-11 bg-amber-500 hover:bg-amber-600 shadow-amber-500/25 font-bold">
                  {saving ? "Updating..." : "Update Password"}
                </Button>
             </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
