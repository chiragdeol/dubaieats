import React, { useState } from "react";
import { X, Building2, CheckCircle2, ShieldCheck, Mail, Phone, User, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function ClaimListingModal({
  isOpen,
  onClose,
  restaurantName,
  restaurantAddress
}: {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  restaurantAddress: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    phoneNumber: "",
    role: "Manager",
    tradeLicense: "",
    notes: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.workEmail || !formData.phoneNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitted(true);
    toast.success(`Claim submitted for ${restaurantName}. Our verification team will contact you within 24 hours.`);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 text-left"
      onClick={handleResetAndClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E5E7EB] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#111827] text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full font-heading">
              Official Venue Claim
            </span>
          </div>

          <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
            Claim "{restaurantName}"
          </h3>
          <p className="text-xs text-white/70 mt-1 font-sans truncate">
            {restaurantAddress}
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-bold text-xl text-[#111827]">
              Claim Request Received!
            </h4>
            <p className="text-xs text-[#6B7280] leading-relaxed max-w-sm mx-auto font-sans">
              Thank you for verifying your ownership of <strong>{restaurantName}</strong>. Our partner onboarding specialist will reach out to <strong>{formData.workEmail}</strong> with access credentials to manage your offers, menu, and reservations.
            </p>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="btn-action-primary w-full py-3 text-sm cursor-pointer"
              >
                Close & Return to Venue
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans text-xs">
            <p className="text-[#4B5563] leading-relaxed">
              Verify your management rights to update opening hours, curate accepted privilege cards (Fazaa, Esaad, ENBD), and configure direct zero-commission table reservations.
            </p>

            <div className="space-y-1.5">
              <label className="font-heading font-bold text-[#111827] text-xs">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Al Mansoori"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:border-[#D9381E] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-heading font-bold text-[#111827] text-xs">Work / Business Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="manager@restaurant.com"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:border-[#D9381E] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-heading font-bold text-[#111827] text-xs">Direct Mobile / WhatsApp *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+971 50 123 4567"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:border-[#D9381E] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-heading font-bold text-[#111827] text-xs">Your Role at Venue</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] bg-white focus:border-[#D9381E] outline-none"
              >
                <option value="General Manager">General Manager / Operations</option>
                <option value="Marketing Director">Marketing & PR Director</option>
                <option value="Owner / Partner">Owner / Managing Partner</option>
                <option value="Head Chef / F&B Director">Head Chef / F&B Director</option>
                <option value="Authorized Agency">Authorized PR / Digital Agency</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-action-primary w-full py-3 text-sm font-heading font-bold cursor-pointer"
              >
                Submit Ownership Claim
              </button>
              <p className="text-[10px] text-center text-[#6B7280] mt-2 font-sans">
                Official verified owners receive complimentary access to the Dubai Eat merchant dashboard.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
