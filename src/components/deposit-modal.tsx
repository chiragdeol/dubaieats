import { useState } from "react";
import { X, ShieldCheck, CreditCard, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { EnrichedRestaurant } from "@/lib/restaurants-enriched";

interface DepositModalProps {
  restaurant: EnrichedRestaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ restaurant, isOpen, onClose }: DepositModalProps) {
  const [guestCount, setGuestCount] = useState(2);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("20:00");
  const [gateway, setGateway] = useState<"stripe" | "telr">("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !restaurant) return null;

  const depositPerGuest = restaurant.priceMin > 300 ? 150 : 50;
  const totalDeposit = depositPerGuest * guestCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden text-left relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">VIP Table Deposit & Guarantee</h3>
              <p className="text-xs text-white/80">Secured via Stripe / Telr UAE Gateway</p>
            </div>
          </div>
          <button onClick={resetAndClose} className="p-1 text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-extrabold text-foreground">Deposit Confirmed!</h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Your VIP table deposit of <strong className="text-foreground">AED {totalDeposit}</strong> for <strong className="text-foreground">{restaurant.name}</strong> has been secured. Confirmation sent via SMS & WhatsApp.
            </p>
            <div className="bg-muted/50 p-4 rounded-2xl border border-border text-xs text-left space-y-1">
              <p><strong>Venue:</strong> {restaurant.name} ({restaurant.district})</p>
              <p><strong>Guests:</strong> {guestCount} Guests</p>
              <p><strong>Time:</strong> {bookingDate || "Today"} at {bookingTime}</p>
              <p><strong>Ref Code:</strong> DXB-VIP-{(Math.random()*899999+100000).toFixed(0)}</p>
            </div>
            <button
              onClick={resetAndClose}
              className="w-full bg-primary text-primary-foreground font-bold text-xs py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Done & Return to Explorer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-2xl border border-border">
              <img src={restaurant.image} alt={restaurant.name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-extrabold text-sm text-foreground">{restaurant.name}</p>
                <p className="text-xs text-muted-foreground">{restaurant.cuisine} · {restaurant.district}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Number of Guests
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                    <option key={num} value={num}>{num} Guests</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Preferred Time
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground outline-none"
                >
                  {["12:30", "13:00", "19:00", "20:00", "21:30", "22:00"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Booking Date
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground outline-none"
              />
            </div>

            {/* Payment Gateway Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Payment Gateway Provider
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGateway("stripe")}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                    gateway === "stripe"
                      ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> Stripe International</span>
                  {gateway === "stripe" && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => setGateway("telr")}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                    gateway === "telr"
                      ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Telr UAE Gateway</span>
                  {gateway === "telr" && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted/60 p-3.5 rounded-2xl border border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Total Refundable Deposit</p>
                <p className="text-[10px] text-muted-foreground">Adjusted against your final dining bill</p>
              </div>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">AED {totalDeposit}</p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>Processing Secure Payment...</>
              ) : (
                <><Sparkles className="w-4 h-4 fill-white" /> Secure VIP Table with AED {totalDeposit} Deposit</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
