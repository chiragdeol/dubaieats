import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Flag, CheckCircle2, ShieldCheck, Info } from "lucide-react";
import { toast } from "sonner";

export function PrivilegeCommunityVerify({
  restaurantName,
  initialUpvotes = 24,
  initialDownvotes = 1,
  className = ""
}: {
  restaurantName: string;
  initialUpvotes?: number;
  initialDownvotes?: number;
  className?: string;
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [reported, setReported] = useState(false);

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) return;

    if (type === "up") {
      setUpvotes((prev) => prev + 1);
      if (userVote === "down") setDownvotes((prev) => Math.max(0, prev - 1));
      setUserVote("up");
      toast.success("Thank you! Your verification helps fellow Dubai diners.");
    } else {
      setDownvotes((prev) => prev + 1);
      if (userVote === "up") setUpvotes((prev) => Math.max(0, prev - 1));
      setUserVote("down");
      toast.info("Feedback recorded. Our data team will review this venue's active offers.");
    }
  };

  const handleReport = () => {
    if (reported) return;
    setReported(true);
    toast.success("Report submitted for review. Thank you for keeping Dubai Eat accurate!");
  };

  return (
    <div className={`rounded-2xl border border-[#E5E7EB] bg-[#F8F9FA] p-4 text-left font-sans ${className}`}>
      
      {/* Top row: Community Verification Status & Votes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3.5 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-xs text-[#111827]">
              Community Verified Privileges
            </h4>
            <p className="text-[11px] text-[#6B7280]">
              Did you receive this discount at {restaurantName}?
            </p>
          </div>
        </div>

        {/* Voting & Report Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => handleVote("up")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              userVote === "up"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white hover:bg-emerald-50 text-[#111827] border border-[#E5E7EB] hover:border-emerald-300"
            }`}
            title="Yes, the discount / privilege worked for me"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110" />
            <span>Works ({upvotes})</span>
          </button>

          <button
            onClick={() => handleVote("down")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              userVote === "down"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-white hover:bg-red-50 text-[#111827] border border-[#E5E7EB] hover:border-red-300"
            }`}
            title="No, the discount was not honored"
          >
            <ThumbsDown className="w-3.5 h-3.5 text-red-500" />
            <span>Didn't Work ({downvotes})</span>
          </button>

          <button
            onClick={handleReport}
            disabled={reported}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-heading font-medium transition-colors cursor-pointer border ${
              reported
                ? "bg-slate-100 text-[#9CA3AF] border-transparent"
                : "bg-white hover:bg-slate-100 text-[#6B7280] hover:text-[#111827] border-[#E5E7EB]"
            }`}
            title="Report inaccurate or expired privilege"
          >
            <Flag className="w-3 h-3 text-[#9CA3AF]" />
            <span>{reported ? "Reported" : "Report Outdated Deal"}</span>
          </button>
        </div>
      </div>

      {/* Global Safety & Terms Disclaimer */}
      <div className="flex items-start gap-2 text-[11px] text-[#6B7280] leading-relaxed">
        <Info className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#111827] font-semibold">Dining Safety & Privilege Disclaimer:</strong> Privilege card listings (Esaad, Fazaa, UAE Bank Cards, Entertainer, Hotel Loyalty) are based on public partner directories and crowd feedback. Offers may be subject to blackout dates, minimum spend, or management discretion. Please verify with venue staff upon arrival.
        </p>
      </div>

    </div>
  );
}
