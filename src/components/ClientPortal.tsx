import React, { useState, useEffect, useRef } from "react";
import { Booking, Message, ProjectStatus, PaymentStatus } from "../types";
import { 
  Lock, Search, ShieldCheck, MessageSquare, Send, Calendar, MapPin, 
  CreditCard, Loader2, DollarSign, CheckCircle2, Circle, AlertCircle, 
  Sparkles, FileText, Printer, ArrowRight, Video, ListTodo, Sliders 
} from "lucide-react";

interface ClientPortalProps {
  initialBookingId?: string | null;
  onLogout: () => void;
}

export function ClientPortal({ initialBookingId, onLogout }: ClientPortalProps) {
  const [searchVal, setSearchVal] = useState<string>(initialBookingId || "");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchErr, setSearchErr] = useState<string | null>(null);
  
  // Checkout Modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [chargeAmount, setChargeAmount] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<"deposit" | "full">("deposit");
  const [cardHolder, setCardHolder] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCVV, setCardCVV] = useState<string>("");
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [paymentStepMsg, setPaymentStepMsg] = useState<string>("");
  const [showReceipt, setShowReceipt] = useState<boolean>(false);

  // Operator sandbox controls
  const [showSandbox, setShowSandbox] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sync initial booking ID if supplied (e.g. from successful booking)
  useEffect(() => {
    if (initialBookingId) {
      handleLoadWorkspace(initialBookingId);
    }
  }, [initialBookingId]);

  // Scroll to bottom of chat logs
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Periodic polling for new messages & milestones
  useEffect(() => {
    if (!booking) return;

    const interval = setInterval(async () => {
      try {
        const bRes = await fetch(`/api/bookings/${booking.id}`);
        if (bRes.ok) {
          const bData = await bRes.json();
          setBooking(bData);
        }

        const mRes = await fetch(`/api/bookings/${booking.id}/messages`);
        if (mRes.ok) {
          const mData = await mRes.json();
          setMessages(mData);
        }
      } catch (err) {
        console.error("Failed to sync project logs:", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [booking?.id]);

  const handleLoadWorkspace = async (targetIdOrEmail: string) => {
    if (!targetIdOrEmail.trim()) {
      setSearchErr("Please enter a valid Project ID or email address.");
      return;
    }

    setSearchLoading(true);
    setSearchErr(null);

    const isEmail = targetIdOrEmail.includes("@");
    const endpoint = isEmail 
      ? `/api/bookings?email=${encodeURIComponent(targetIdOrEmail.trim())}`
      : `/api/bookings/${targetIdOrEmail.trim().toUpperCase()}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(isEmail 
          ? "No active project portals found under this email address." 
          : "Active booking session not found. Verify your Project ID (e.g. VID-7729)."
        );
      }

      const data = await response.json();
      
      if (isEmail) {
        if (Array.isArray(data) && data.length > 0) {
          // Load first corresponding booking
          setBooking(data[0]);
          await loadMessages(data[0].id);
        } else {
          throw new Error("No active production portals found for this email container.");
        }
      } else {
        setBooking(data);
        await loadMessages(data.id);
      }
    } catch (err: any) {
      console.error(err);
      setSearchErr(err.message || "Network error loading production hub.");
    } finally {
      setSearchLoading(false);
    }
  };

  const loadMessages = async (bId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Fail logs load:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !booking) return;

    const payload = {
      sender: "client",
      senderName: booking.clientName,
      text: chatInput
    };

    // Optimistically update lists
    const tempMsg: Message = {
      id: `TEMP-${Date.now()}`,
      bookingId: booking.id,
      sender: "client",
      senderName: booking.clientName,
      text: chatInput,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setChatInput("");

    try {
      const response = await fetch(`/api/bookings/${booking.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        await loadMessages(booking.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCheckout = (type: "deposit" | "full") => {
    if (!booking) return;

    setPaymentType(type);
    setCardHolder(booking.clientName);
    
    const amount = type === "deposit" 
      ? booking.depositAmount - booking.depositPaid 
      : booking.remainingBalance;

    setChargeAmount(amount);
    setIsCheckoutOpen(true);
    setShowReceipt(false);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setPaymentLoading(true);
    
    // Simulate payment clearing ticks
    const steps = [
      "Contacting secure sandbox clearing network...",
      "Validating credit ledger reserves...",
      "Settling payment escrow tokens...",
      "Authorizing production release credentials..."
    ];

    setPaymentStepMsg(steps[0]);
    let tIdx = 0;
    const interval = setInterval(() => {
      tIdx++;
      if (tIdx < steps.length) {
        setPaymentStepMsg(steps[tIdx]);
      }
    }, 1100);

    try {
      const response = await fetch(`/api/bookings/${booking.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: chargeAmount,
          paymentMethod: `Visa (*${cardNumber.slice(-4) || "8821"})`,
          cardholderName: cardHolder
        })
      });

      clearInterval(interval);

      if (!response.ok) {
        throw new Error("Deposit execution failed on security clearing level. Please verify card credentials.");
      }

      const resData = await response.json();
      setBooking(resData.booking);
      await loadMessages(booking.id);
      
      setPaymentLoading(false);
      setShowReceipt(true);
    } catch (err: any) {
      console.error(err);
      clearInterval(interval);
      alert(err.message || "Payment execution declined.");
      setPaymentLoading(false);
    }
  };

  // Sandbox operators toggles (for testing milestones in the visual preview)
  const handleToggleMilestone = async (mIdx: number, done: boolean) => {
    if (!booking) return;
    try {
      const res = await fetch(`/api/bookings/${booking.id}/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestoneIndex: mIdx,
          completed: done
        })
      });
      if (res.ok) {
        const data = await res.json();
        setBooking(data.booking);
        await loadMessages(booking.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeProjectStatus = async (status: ProjectStatus) => {
    if (!booking) return;
    try {
      const res = await fetch(`/api/bookings/${booking.id}/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectStatus: status })
      });
      if (res.ok) {
        const data = await res.json();
        setBooking(data.booking);
        await loadMessages(booking.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case "pre_production": return "Pre-Production & Storyboarding";
      case "shooting": return "Active Principal Shooting";
      case "rough_cut": return "Anamorphic Assembly Cut Ready";
      case "editing": return "Directorial Sound-Mix & Color Work";
      case "final_delivery": return "Master Deliverables Released";
    }
  };

  return (
    <div id="portal-hub-section" className="py-20 bg-neutral-900 border-t border-neutral-800 text-white min-h-[700px] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {!booking ? (
          /* Login Workspace Gate */
          <div className="max-w-md mx-auto bg-neutral-950 p-8 rounded-2xl border border-neutral-850 shadow-2xl text-center">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="text-xl font-medium tracking-tight text-neutral-100">
              Client Project Portal
            </h3>
            <p className="text-xs text-neutral-400 mt-1.5 max-w-sm mx-auto leading-normal">
              Enter email or production Project ID (e.g. <strong>VID-7729</strong>) to retrieve live shoot matrices, invoice balances, and active creative channels.
            </p>

            <div className="mt-6 text-left">
              <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1.5">
                Retrieve credentials
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-neutral-500" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="e.g. manasmanas3236@gmail.com or VID-7729"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-amber-500/50 transition-colors text-neutral-200"
                />
              </div>

              {searchErr && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {searchErr}
                </p>
              )}

              <button
                onClick={() => handleLoadWorkspace(searchVal)}
                disabled={searchLoading}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-850 text-neutral-950 text-xs font-mono font-bold uppercase py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {searchLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                    <span>Seeding Ledger Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Studio Portal</span>
                    <ArrowRight className="w-4 h-4 text-neutral-950" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-900 text-[11px] text-neutral-500 space-y-1 bg-neutral-950 rounded-xl leading-relaxed text-left p-3.5 border border-dashed border-neutral-850">
              <span className="font-semibold text-neutral-400 block mb-1">💡 SEED DEMO ACCOUNT DETAILS</span>
              We loaded a professional seed booking matching your user registration email <strong className="text-amber-500 font-mono">manasmanas3236@gmail.com</strong>. Directly type it in to inspect live deliverables, chats, and receipts!
            </div>
          </div>
        ) : (
          /* Live Interactive Hub Workspace */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Hub Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-950 p-6 rounded-2xl border border-neutral-850">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-500 uppercase bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 font-semibold">
                    PROJECT HUB ACTIVE
                  </span>
                  <span className="text-xs font-mono text-neutral-500">ID: {booking.id}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-100 mt-1">
                  {booking.clientName} &mdash; <span className="font-semibold">{booking.packageName}</span>
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400 mt-1.5 font-mono">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500" /> {booking.location}</span>
                  <span className="text-neutral-600">•</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-500" /> Filming: {booking.shootDate}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* sandbox trigger */}
                <button
                  onClick={() => setShowSandbox(!showSandbox)}
                  className="px-3.5 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 text-xs font-mono text-neutral-400 flex items-center gap-1.5 transition-all"
                  title="Photographer Administration Demo Workspace Tools"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-500" />
                  {showSandbox ? "Close Sandbox" : "Sandbox Demo Tools"}
                </button>

                <button
                  onClick={() => {
                    setBooking(null);
                    setMessages([]);
                    onLogout();
                  }}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  Close Session
                </button>
              </div>
            </div>

            {/* Sandbox Admin Control drawer */}
            {showSandbox && (
              <div className="p-5 bg-neutral-950 border border-amber-500/20 rounded-2xl text-xs space-y-4 shadow-red-500/10 shadow-lg">
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Videographer Administrative Sandbox Controller (Demo View)
                </div>
                <p className="text-[11px] text-neutral-400 font-sans leading-normal">
                  Normally, only the studio operator changes milestones. This sandbox control exists so you can toggle milestones, complete production phases, mock footage releases, and test how client feeds respond instantly.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <h4 className="text-[11px] font-mono text-neutral-300 uppercase mb-2">Advance Production Status:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(["pre_production", "shooting", "rough_cut", "editing", "final_delivery"] as ProjectStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleChangeProjectStatus(st)}
                          className={`px-2.5 py-1.5 rounded font-mono text-[10px] transition-colors ${
                            booking.projectStatus === st 
                              ? "bg-amber-500 text-neutral-950 font-bold" 
                              : "bg-neutral-900 text-neutral-400 hover:text-white"
                          }`}
                        >
                          {st.replace('_', ' ').toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-mono text-neutral-300 uppercase mb-2">Simulate Direct Checklist Milestone Completion:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {booking.timelineMilestones?.map((ml, idx) => (
                        <label key={idx} className="flex items-center gap-2 bg-neutral-900/60 p-2 border border-neutral-850 rounded">
                          <input
                            type="checkbox"
                            checked={ml.completed}
                            onChange={(e) => handleToggleMilestone(idx, e.target.checked)}
                            className="rounded accent-amber-500 bg-neutral-950 focus:ring-0 border-neutral-800"
                          />
                          <span className="text-[10px] font-mono text-neutral-300 truncate">{ml.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Portal Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left columns: Project Timeline Matrix (8 Columns on Large) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Visual Timeline Path */}
                <div className="bg-neutral-950 p-6 md:p-8 rounded-2xl border border-neutral-850 shadow-lg">
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-900">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <ListTodo className="w-5 h-5 text-amber-500" /> Production Matrix & Milestones
                    </h3>
                    <span className="text-xs font-mono text-amber-500 px-2.5 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 uppercase font-semibold">
                      Phase: {getStatusText(booking.projectStatus)}
                    </span>
                  </div>

                  {/* Horizontal progress indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                    {([
                      { step: "pre_production", label: "Pre-Prod" },
                      { step: "shooting", label: "Shooting" },
                      { step: "rough_cut", label: "Rough Cut" },
                      { step: "editing", label: "Sound & Color" },
                      { step: "final_delivery", label: "Final Master" }
                    ] as { step: ProjectStatus; label: string }[]).map((ph, idx) => {
                      const isDone = [
                        "pre_production", "shooting", "rough_cut", "editing", "final_delivery"
                      ].indexOf(booking.projectStatus) >= idx;
                      
                      return (
                        <div key={ph.step} className="text-center relative">
                          <div className={`mx-auto w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                            isDone 
                              ? "bg-amber-500 border-amber-400 text-neutral-950 shadow-md shadow-amber-500/10" 
                              : "bg-neutral-900 border-neutral-800 text-neutral-600"
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`text-[10px] font-mono tracking-wider block mt-2 ${
                            isDone ? "text-amber-500 font-bold" : "text-neutral-500"
                          }`}>
                            {ph.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Checklist Matrix */}
                  <div className="space-y-4">
                    {booking.timelineMilestones?.map((ml, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                          ml.completed 
                            ? "bg-amber-500/5 border-amber-500/20" 
                            : "bg-neutral-900/40 border-neutral-850"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {ml.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-amber-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-neutral-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className={`text-sm font-medium tracking-tight ${
                              ml.completed ? "text-neutral-100" : "text-neutral-400"
                            }`}>
                              {ml.label}
                            </h4>
                            {ml.date && (
                              <span className="text-[10px] font-mono text-neutral-500">
                                {ml.completed ? `CONFIRMED: ${ml.date}` : `EST: ${ml.date}`}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">{ml.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Final Download segment if deliverables released */}
                  {booking.projectStatus === "final_delivery" && (
                    <div className="mt-8 p-5 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest block font-bold">
                          ★ CINEMATIC DELIVERABLES RELEASED
                        </span>
                        <h4 className="text-base font-medium text-neutral-100 tracking-tight mt-1">
                          Full 4K UHD Master Film Cut
                        </h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Download master reels, backup RAW caches, and colorgraded LUT packages.
                        </p>
                      </div>
                      <a
                        href="https://www.w3schools.com/html/mov_bbb.mp4"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-teal-500 hover:bg-teal-400 text-neutral-950 font-mono text-xs font-bold uppercase py-2.5 px-5 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Download Cinematic Masters
                      </a>
                    </div>
                  )}

                  {/* Embedded Custom Creative AI Brief inside Project portal */}
                  {booking.aiBrief && (
                    <div className="mt-8 pt-6 border-t border-neutral-900">
                      <div className="bg-neutral-900/60 border border-neutral-850 rounded-2xl p-5">
                        <span className="text-[9px] font-mono text-amber-500 uppercase tracking-wider block mb-1">
                          ATTESTATIVE REEL CONCEPT BOARD
                        </span>
                        <h4 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5 uppercase">
                          <Video className="w-4 h-4 text-amber-500" /> Active Concept: {booking.aiBrief.theme}
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs font-sans leading-relaxed text-neutral-400">
                          <div>
                            <span className="font-semibold text-neutral-300 block mb-1">Outline Highlights:</span>
                            <div className="max-h-32 overflow-y-auto pr-2 text-[11px] whitespace-pre-wrap">
                              {booking.aiBrief.scriptOutline}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="font-semibold text-neutral-300 block mb-0.5">Assigned Optics setup:</span>
                              <div className="flex flex-wrap gap-1">
                                {booking.aiBrief.recommendedGear.map((g, idx) => (
                                  <span key={idx} className="bg-neutral-950 text-neutral-500 border border-neutral-850 px-1.5 py-0.5 rounded text-[9px] font-mono">
                                    {g}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="font-semibold text-neutral-300 block mb-0.5">Grading Directives:</span>
                              <p className="text-[10px] text-neutral-400 italic line-clamp-2">
                                "{booking.aiBrief.creativeMood}"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Live Client Messaging Terminal */}
                <div className="bg-neutral-950 rounded-2xl border border-neutral-850 flex flex-col h-[500px] overflow-hidden shadow-lg">
                  <div className="p-4 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-amber-500" /> Direct Production Message Log
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-500">RES: REALTIME SSL ACTIVE</span>
                  </div>

                  {/* Messages list */}
                  <div 
                    ref={chatContainerRef}
                    className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-neutral-950/20"
                  >
                    {messages.map((m) => {
                      const isMe = m.sender === "client";
                      const isSys = m.sender === "system";

                      if (isSys) {
                        return (
                          <div key={m.id} className="max-w-xl mx-auto py-2 px-3.5 bg-neutral-900 border border-neutral-850/60 rounded-xl text-center text-[11px] text-neutral-400 font-sans leading-normal">
                            {m.text}
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={m.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[80%] rounded-2xl p-3.5 shadow-md ${
                            isMe 
                              ? "bg-amber-500 text-neutral-950 rounded-br-none" 
                              : "bg-neutral-900 text-neutral-200 rounded-bl-none border border-neutral-800"
                          }`}>
                            <div className="flex justify-between items-center gap-8 mb-1">
                              <span className="text-[10px] font-mono uppercase font-bold opacity-75">
                                {m.senderName}
                              </span>
                              <span className="text-[9px] font-mono opacity-50">
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs leading-relaxed font-light">{m.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chat sender */}
                  <form onSubmit={handleSendMessage} className="p-4 bg-neutral-950 border-t border-neutral-900 flex gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Discuss frame revisions, lighting setups, or music cuts with Marcus..."
                      className="flex-1 bg-neutral-900 border border-neutral-805 rounded-xl px-4 text-xs font-light outline-none focus:border-amber-500/50 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 text-neutral-950 p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                    >
                      <Send className="w-4 h-4 text-neutral-950" />
                    </button>
                  </form>
                </div>

              </div>

              {/* Right column: Secure Financial Invoices (4 Columns) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Balance Summary Card */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">
                    PRODUCTION FINANCE MATRIX
                  </span>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-1.5 pb-2 border-b border-neutral-900">
                    <DollarSign className="w-4.5 h-4.5 text-amber-500" /> Invoice Breakdown
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs py-1">
                      <span className="text-neutral-500">Total Approved Investment:</span>
                      <strong className="font-mono text-neutral-300 font-semibold">${booking.totalPrice.toLocaleString()}.00</strong>
                    </div>

                    <div className="flex justify-between items-center text-xs py-1">
                      <span className="text-neutral-500">Agreed Pre-Payment Deposit:</span>
                      <strong className="font-mono text-neutral-300 font-medium">${booking.depositAmount.toLocaleString()}.00</strong>
                    </div>

                    <div className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl space-y-1 text-[11px]">
                      <div className="flex justify-between text-neutral-400">
                        <span>Paid Deposit Balance:</span>
                        <span className="font-mono text-emerald-400 font-bold">${booking.depositPaid.toLocaleString()}.00</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Outstanding Balance:</span>
                        <span className="font-mono text-neutral-300">${booking.remainingBalance.toLocaleString()}.00</span>
                      </div>
                    </div>

                    {/* Status box */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs mb-4">
                        <span className="text-neutral-500">Deposit Status:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          booking.paymentStatus === "fully_paid"
                            ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                            : booking.paymentStatus === "deposit_paid"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {booking.paymentStatus.toUpperCase().replace('_', ' ')}
                        </span>
                      </div>

                      {/* Payment buttons based on status */}
                      {booking.paymentStatus === "pending_deposit" && (
                        <button
                          onClick={() => handleOpenCheckout("deposit")}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-xs font-bold uppercase py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <CreditCard className="w-4 h-4 text-neutral-950" />
                          <span>Secure Pre-Payment Deposit (${(booking.depositAmount - booking.depositPaid).toLocaleString()})</span>
                        </button>
                      )}

                      {booking.paymentStatus === "deposit_paid" && (
                        <div className="space-y-3">
                          <div className="bg-emerald-500/5 border border-emerald-500/15 p-3 rounded-xl text-[11px] text-neutral-400 leading-normal">
                            <strong>✓ Pre-Payment Confirmed.</strong> Your date locks are verified in scheduling vaults. Balance billing triggers once final cut reviews launch.
                          </div>
                          <button
                            onClick={() => handleOpenCheckout("full")}
                            className="w-full bg-neutral-900 hover:bg-neutral-850 text-neutral-100 border border-neutral-800 font-mono text-xs font-bold uppercase py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>Settle Outstanding Balance</span>
                          </button>
                        </div>
                      )}

                      {booking.paymentStatus === "fully_paid" && (
                        <div className="p-4 bg-teal-500/5 border border-teal-500/30 rounded-xl text-center text-teal-400 text-xs font-mono font-medium flex items-center justify-center gap-2">
                          <ShieldCheck className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                          <span>ALL BALANCES RECONCILED • COPIES CLEARED</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Printable Invoice module */}
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-855 text-xs text-neutral-400 space-y-3">
                  <h4 className="text-xs font-mono text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-neutral-900">
                    <FileText className="w-4 h-4 text-amber-500" /> Administrative Invoice Copies
                  </h4>
                  <p className="text-[11px] leading-relaxed text-neutral-500">
                    Need static copies for financial boards or business expense channels? Spawn a formal web invoice ledger designed for system printing.
                  </p>
                  
                  <button
                    onClick={() => handleOpenCheckout("deposit")}
                    className="w-full bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 py-2 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4 text-amber-500" />
                    <span>Generate Paper Copy</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* PCI-COMPLIANT CHECKOUT GATEWAY MODAL */}
      {isCheckoutOpen && booking && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-855 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            
            {showReceipt ? (
              /* Payment Complete Receipt Screen */
              <div className="p-6 md:p-8 space-y-6 text-center">
                <div className="w-14 h-14 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto border border-teal-500/30">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-neutral-100 tracking-tight">
                    Transaction Receipt
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-500 block mt-1">
                    MERCHANT ID: VANCE_CINEMA_LEDGER_001
                  </span>
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 text-left text-xs font-mono space-y-2">
                  <div className="flex justify-between text-neutral-400">
                    <span>Invoice Ref:</span>
                    <span className="text-neutral-100">{booking.id}-PAY</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Authorized Charge:</span>
                    <span className="text-emerald-400 font-bold">${chargeAmount.toLocaleString()}.00 USD</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Ledger Status:</span>
                    <span className="uppercase text-neutral-100">{booking.paymentStatus.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Account Settle:</span>
                    <span className="text-neutral-100">manasmanas3236@gmail.com</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Auth Timestamp:</span>
                    <span className="text-neutral-300">{new Date().toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-neutral-950 hover:bg-neutral-800 border border-neutral-805 text-neutral-300 font-mono text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4 text-amber-500" />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-xs font-bold uppercase py-2.5 rounded-lg transition-colors"
                  >
                    Close Sheet
                  </button>
                </div>
              </div>
            ) : (
              /* Active Payment Processing Panel */
              <form onSubmit={handleProcessPayment} className="p-6 md:p-8 space-y-6">
                
                {paymentLoading ? (
                  <div className="p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                    <h4 className="text-sm font-mono text-amber-500 uppercase tracking-widest">
                      Processing Escrow Card
                    </h4>
                    <p className="text-xs text-neutral-400 p-2 bg-neutral-950 rounded border border-neutral-850">
                      {paymentStepMsg}
                    </p>
                    <p className="text-[10px] text-neutral-500 leading-normal max-w-xs">
                      Establishing encrypted transport layers... Handshaking transaction tokens with merchant vault bank. Do not close browser frames.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block">
                          SSL SECURED TRANSIT
                        </span>
                        <h3 className="text-lg font-medium text-neutral-100 tracking-tight">
                          Vault Escrow Checkout
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCheckoutOpen(false)}
                        className="text-neutral-500 hover:text-white font-mono text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-neutral-500">MOCK TRANSACTION DETAILS</span>
                        <span className="text-neutral-300 block font-semibold mt-0.5">{booking.packageName}</span>
                      </div>
                      <span className="text-xl font-mono text-emerald-400">${chargeAmount.toLocaleString()}.00</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Manas Kumar"
                          className="w-full bg-neutral-950 border border-neutral-805 rounded-xl px-4 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-500/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                          Credit Card Number
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3 w-4.5 h-4.5 text-neutral-500" />
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4111 2222 3333 4444"
                            className="w-full bg-neutral-950 border border-neutral-805 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-500/50 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-neutral-950 border border-neutral-805 rounded-xl px-4 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-500/50 font-mono text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                            CVV Code
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            placeholder="***"
                            className="w-full bg-neutral-950 border border-neutral-805 rounded-xl px-4 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-500/50 font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-xs font-bold uppercase py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-neutral-950" />
                      <span>Process Secure Settle Copy (${chargeAmount.toLocaleString()})</span>
                    </button>
                  </>
                )}

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
