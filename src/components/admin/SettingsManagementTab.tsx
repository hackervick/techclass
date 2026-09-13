import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldAlert,
  Save,
  RotateCcw,
  CreditCard,
  Building,
  Mail,
  Smartphone,
  Globe,
  Bell,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface SettingsManagementTabProps {
  token: string | null;
  onActionNotification: (msg: string, isError?: boolean) => void;
}

export const SettingsManagementTab: React.FC<SettingsManagementTabProps> = ({
  token,
  onActionNotification
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Settings state
  const [siteName, setSiteName] = useState('TechClass');
  const [siteTagline, setSiteTagline] = useState('Your Digital Classroom for Government Exam Preparation');
  const [brandParent, setBrandParent] = useState('DynoDazzle');
  const [siteDomain, setSiteDomain] = useState('https://techclass.dynodazzle.in');
  const [contactEmail, setContactEmail] = useState('dynodazzle@gmail.com');
  const [whatsappSupport, setWhatsappSupport] = useState('+91 7770032149');
  const [upiId, setUpiId] = useState('dynodazzle@ybl');
  const [passPrice, setPassPrice] = useState('2999');
  const [freeTestLimit, setFreeTestLimit] = useState('3');
  const [freePdfLimit, setFreePdfLimit] = useState('2');
  const [freeCourseLimit, setFreeCourseLimit] = useState('2');
  const [announcementText, setAnnouncementText] = useState('🔥 MPSC State Services 2026 Prelims Fastrack Batch & Mock Papers Live Now!');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Reset confirmation modal
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const loadSettings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load system settings');
      const data = await res.json();
      if (data) {
        if (data.site_name) setSiteName(data.site_name);
        if (data.site_tagline) setSiteTagline(data.site_tagline);
        if (data.brand_parent) setBrandParent(data.brand_parent);
        if (data.site_domain) setSiteDomain(data.site_domain);
        if (data.contact_email) setContactEmail(data.contact_email);
        if (data.whatsapp_support) setWhatsappSupport(data.whatsapp_support);
        if (data.upi_id) setUpiId(data.upi_id);
        if (data.pass_price !== undefined) setPassPrice(String(data.pass_price));
        if (data.free_test_limit !== undefined) setFreeTestLimit(String(data.free_test_limit));
        if (data.free_pdf_limit !== undefined) setFreePdfLimit(String(data.free_pdf_limit));
        if (data.free_course_limit !== undefined) setFreeCourseLimit(String(data.free_course_limit));
        if (data.announcement_text !== undefined) setAnnouncementText(data.announcement_text);
        if (data.maintenance_mode !== undefined) setMaintenanceMode(Boolean(data.maintenance_mode));
      }
    } catch (err: any) {
      onActionNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [token]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);

    try {
      const payload = {
        site_name: siteName,
        site_tagline: siteTagline,
        brand_parent: brandParent,
        site_domain: siteDomain,
        contact_email: contactEmail,
        whatsapp_support: whatsappSupport,
        upi_id: upiId,
        pass_price: parseFloat(passPrice) || 2999,
        free_test_limit: parseInt(freeTestLimit) || 3,
        free_pdf_limit: parseInt(freePdfLimit) || 2,
        free_course_limit: parseInt(freeCourseLimit) || 2,
        announcement_text: announcementText,
        maintenance_mode: maintenanceMode
      };

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      onActionNotification('System configurations and platform settings updated successfully!');
    } catch (err: any) {
      onActionNotification(err.message, true);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!token) return;
    setIsResetting(true);
    try {
      const res = await fetch('/api/admin/settings/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset settings');

      onActionNotification('Platform settings reset to factory defaults.');
      setResetModalOpen(false);
      loadSettings();
    } catch (err: any) {
      onActionNotification(err.message, true);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Platform Configuration & Global Controls</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">System Settings & Layout</h2>
          <p className="text-xs text-slate-400">
            Control platform branding, live UPI payment handles, Annual Pass pricing, trial usage limits, and site-wide maintenance modes.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Factory Reset</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Branding & Identity */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Building className="w-4 h-4 text-cyan-400" />
            <span>Brand Identity & Domain Mapping</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Parent Brand / Entity</label>
              <input
                type="text"
                value={brandParent}
                onChange={(e) => setBrandParent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">Primary Production Domain URL</label>
              <input
                type="text"
                value={siteDomain}
                onChange={(e) => setSiteDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: UPI & Pricing */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>UPI Gateway & Pass Monetization</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Merchant UPI ID (VPA)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="dynodazzle@ybl"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Generated QR code and payment intent use this VPA.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">365-Day Annual Pass Fee (₹ INR)</label>
              <input
                type="number"
                value={passPrice}
                onChange={(e) => setPassPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Default price displayed on checkout page.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Support */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Mail className="w-4 h-4 text-indigo-400" />
            <span>Candidate Support Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Official Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">WhatsApp Helpdesk Number</label>
              <input
                type="text"
                value={whatsappSupport}
                onChange={(e) => setWhatsappSupport(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Freemium Limits & Announcements */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Trial Restrictions & Dynamic Banner</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Free Tests Allowed</label>
              <input
                type="number"
                value={freeTestLimit}
                onChange={(e) => setFreeTestLimit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Free PDF Notes Allowed</label>
              <input
                type="number"
                value={freePdfLimit}
                onChange={(e) => setFreePdfLimit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Free Course Lessons Allowed</label>
              <input
                type="number"
                value={freeCourseLimit}
                onChange={(e) => setFreeCourseLimit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-300 mb-1">Top Announcement Banner Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Notice displayed at the top of all pages..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">System Maintenance Mode</div>
              <p className="text-[11px] text-slate-400">
                When activated, non-admin visitors will see a maintenance notice while admins retain full access.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving System Changes...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={resetModalOpen}
        title="Reset All Settings to Factory Defaults?"
        message="Are you sure you want to reset all site settings (pricing, UPI ID, trial limits, banner) back to default values? This cannot be undone."
        confirmLabel="Yes, Reset Settings"
        confirmVariant="warning"
        isLoading={isResetting}
        onConfirm={handleConfirmReset}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
};
