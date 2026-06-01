import React, { useState, useEffect } from "react";
import { VIDEOGRAPHY_PACKAGES } from "../data";
import { AIBrief } from "../types";
import { Calendar, Mail, User, Phone, MapPin, Calculator, Sparkles, Check, FileText } from "lucide-react";

interface BookingFormProps {
  initialPackageId?: string;
  initialNotes?: string;
  initialAIBrief?: AIBrief | null;
  onBookingSuccess: (bookingId: string) => void;
}

export function BookingForm({
  initialPackageId,
  initialNotes,
  initialAIBrief,
  onBookingSuccess
}: BookingFormProps) {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(initialPackageId || VIDEOGRAPHY_PACKAGES[0].id);
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [shootDate, setShootDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if initial variables mutate
  useEffect(() => {
    if (initialPackageId) setSelectedPkgId(initialPackageId);
  }, [initialPackageId]);

  useEffect(() => {
    if (initialNotes) setNotes(initialNotes);
  }, [initialNotes]);

  const selectedPkg = VIDEOGRAPHY_PACKAGES.find((p) => p.id === selectedPkgId) || VIDEOGRAPHY_PACKAGES[0];

  const basePrice = selectedPkg.basePrice;
  const depositAmount = Math.round(basePrice * 0.3); // 30% standard deposit
  const remainingBalance = basePrice - depositAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !shootDate || !location) {
      setError("Please complete all required fields (*): Name, Email, Date, and Location.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      clientName,
      clientEmail,
      clientPhone,
      packageName: selectedPkg.name,
      packageId: selectedPkg.id,
      totalPrice: basePrice,
      depositAmount,
      shootDate,
      location,
      notes,
      aiBrief: initialAIBrief || undefined
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to register shoot booking. Please check details.");
      }

      const registered = await response.json();
      onBookingSuccess(registered.id);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong creating booking. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="booking-section" className="py-20 bg-neutral-950 text-white relative">
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Column Form */}
          <div className="w-full lg:w-7/12 bg-neutral-900 border border-neutral-850 p-6 md:p-8 rounded-2xl shadow-xl">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-2">
              📅 Production Scheduling
            </span>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-100 flex items-center gap-2">
              Lock in your <span className="font-semibold">Shoot Dates</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1 mb-8">
              Submit your logistics. Once submitted, we will spawn a high-fidelity digital project portal where you can monitor timelines and message your director directly.
            </p>

            {initialAIBrief && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-xs text-amber-400 mb-6 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider block">AI Creative Board Attached</span>
                  Successfully seeded brief concept <strong className="text-white">"{initialAIBrief.theme}"</strong> using our Gemini Creative Consult.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Select Package Grid */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                  1. Choose Production Tier *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VIDEOGRAPHY_PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        selectedPkgId === pkg.id
                          ? "bg-amber-500/10 border-amber-500/55 shadow-md shadow-amber-500/5"
                          : "bg-neutral-950/60 border-neutral-850 hover:border-neutral-800"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          selectedPkgId === pkg.id ? "bg-amber-500 text-neutral-950 font-bold" : "bg-neutral-900 text-neutral-400"
                        }`}>
                          {pkg.category}
                        </span>
                        {selectedPkgId === pkg.id && (
                          <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-neutral-950 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <h4 className="text-sm font-medium tracking-tight">{pkg.name}</h4>
                        <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">{pkg.description}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-neutral-850/40 flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-mono">{pkg.estimatedDuration}</span>
                        <span className="font-semibold text-neutral-200">${pkg.basePrice.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Logistics */}
              <div className="pt-4 border-t border-neutral-850/40">
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-4">
                  2. Logistics & Client Profile *
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Your Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Manas Kumar"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-amber-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="e.g. yourname@example.com"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-amber-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Phone Number (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="e.g. +1 (555) 123-4567"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-amber-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Filming Date Range *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                      <input
                        type="date"
                        required
                        value={shootDate}
                        onChange={(e) => setShootDate(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-amber-500/50 transition-colors text-neutral-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-[11px] font-mono text-neutral-500 mb-1">Primary Shooting Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Big Sur Cliffs trailheads, Downtown Warehouse"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Message Details */}
              <div className="pt-4 border-t border-neutral-850/40">
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                  3. Production Remarks & Visual Cue Notes
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Incorporate any aesthetic requirements, sequence references, drone expectations, or general schedules."
                  className="w-full bg-neutral-950 border border-neutral-805 rounded-xl p-4 text-sm text-neutral-100 placeholder-neutral-600 outline-none focus:border-amber-500/50 transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 text-neutral-950 text-xs font-mono font-bold tracking-widest uppercase py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? "Registering Schedule..." : `Book Portal & Prepare Deposit ($${depositAmount.toLocaleString()})`}
              </button>

            </form>
          </div>

          {/* Right Column Interactive Quote calculator */}
          <div className="w-full lg:w-5/12 space-y-6">
            <div className="bg-neutral-950 p-6 md:p-8 rounded-2xl border border-neutral-850 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-lg font-medium tracking-tight mb-4 flex items-center gap-2 border-b border-neutral-900 pb-3">
                <Calculator className="w-5 h-5 text-amber-500" /> Dynamic Quote & Payment Invoice
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-neutral-900">
                  <span className="text-xs text-neutral-400 font-sans">Selected Tier:</span>
                  <span className="text-xs font-semibold text-neutral-100">{selectedPkg.name}</span>
                </div>

                <div className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl">
                  <h4 className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-amber-500" /> Included Gear Allocation
                  </h4>
                  <ul className="text-[11px] text-neutral-400 space-y-1">
                    {selectedPkg.recommendedGear.map((g, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-500" /> {g}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Base Production Subtotal:</span>
                    <span className="font-mono text-neutral-300">${basePrice.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Deposit Pre-payment (30%):</span>
                    <span className="font-mono text-neutral-300 font-semibold">${depositAmount.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Remaining Post-production Balance:</span>
                    <span className="font-mono text-neutral-300">${remainingBalance.toLocaleString()}.00</span>
                  </div>

                  <div className="flex justify-between items-end border-t border-neutral-850 pt-4 mt-2">
                    <div>
                      <span className="text-[10px] font-mono text-amber-500 block">TOTAL INVESTMENT</span>
                      <span className="text-xs text-neutral-400 font-sans">Full cinematic release</span>
                    </div>
                    <span className="text-3xl font-light text-neutral-100 font-mono">${basePrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-900">
                  <div className="bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl text-[11px] text-neutral-400 leading-normal">
                    <span className="font-semibold text-amber-500 block mb-0.5">Secure Escrow Protection</span>
                    Our platform processes booking locks using a mockup secure deposit token. Your 30% deposit retains your specific calendar days in our camera scheduling books. Remaining values are billed on rough-cut master sign-off.
                  </div>
                </div>
              </div>
            </div>

            {/* Custom static specs */}
            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-850 text-xs text-neutral-400 space-y-3">
              <h4 className="text-xs font-mono text-neutral-200 uppercase tracking-widest">
                📦 Production Guarantees
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">✓</span>
                  All masters captured on dual-card recording channels for bulletproof backup protection.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">✓</span>
                  Raw footage archive held on deep cloud nodes for 24 months from release.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">✓</span>
                  Flexible rescheduling options with 14-days notice timeline limits.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
