import { useState } from "react";
import { PortfolioGrid } from "./components/PortfolioGrid";
import { AIShootPlanner } from "./components/AIShootPlanner";
import { BookingForm } from "./components/BookingForm";
import { ClientPortal } from "./components/ClientPortal";
import { AIBrief } from "./types";
import { Video, Sparkles, Calendar, MessageSquare, ArrowRight, Github, Heart, Camera, Film, ChevronRight } from "lucide-react";

export default function App() {
  const [bookingPkgId, setBookingPkgId] = useState<string>("");
  const [bookingNotes, setBookingNotes] = useState<string>("");
  const [bookingAIBrief, setBookingAIBrief] = useState<AIBrief | null>(null);
  const [portalBookingId, setPortalBookingId] = useState<string | null>(null);

  // Sync brief lockin to booking configuration details
  const handleApplyBriefToForm = (packageId: string, notes: string, brief: AIBrief) => {
    setBookingPkgId(packageId);
    setBookingNotes(notes);
    setBookingAIBrief(brief);

    // Smooth scroll down to current scheduling configuration form
    const elem = document.getElementById("booking-section");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Switch focus immediately when booking triggers success callback
  const handleBookingSuccess = (bookingId: string) => {
    setPortalBookingId(bookingId);
    
    // Reset temporary states
    setBookingPkgId("");
    setBookingNotes("");
    setBookingAIBrief(null);

    // Smooth scroll straight into the live interactive client hub
    setTimeout(() => {
      const elem = document.getElementById("portal-hub-section");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen selection:bg-amber-500 selection:text-neutral-950 font-sans tracking-normal overflow-x-hidden">
      
      {/* Cinematic Film-Grain Ambient Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay z-50 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Floating Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900/60 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-amber-500 text-neutral-950 rounded-xl flex items-center justify-center font-bold tracking-tight shadow-md transition-all group-hover:scale-105 active:scale-95 group-hover:rotate-3 shadow-amber-500/10">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider text-neutral-100 uppercase block font-sans">
                MARCUS VANCE
              </span>
              <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase block -mt-0.5">
                Cinematographer
              </span>
            </div>
          </a>

          {/* Links list */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-neutral-400">
            <a href="#portfolio-section" className="hover:text-amber-500 transition-colors">PORTFOLIO</a>
            <a href="#ai-planner-section" className="hover:text-amber-500 transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI CONCEPT CO-WRITER
            </a>
            <a href="#booking-section" className="hover:text-amber-500 transition-colors">SCHEDULING</a>
            <a href="#portal-hub-section" className="hover:text-amber-500 transition-colors">PROJECT HUB</a>
          </nav>

          {/* Action trigger */}
          <div className="flex items-center gap-4">
            <a
              href="#portal-hub-section"
              className="bg-neutral-900 hover:bg-neutral-850 hover:text-white border border-neutral-800 text-[10px] font-mono font-bold tracking-widest uppercase py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-neutral-300"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
              <span>DASHBOARD PORTAL</span>
            </a>
          </div>

        </div>
      </header>

      {/* Hero Showcase Slide */}
      <section className="relative min-h-[90vh] flex items-center bg-radial from-neutral-900 to-neutral-950 border-b border-neutral-900 pb-16 pt-12">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.25] mix-blend-luminosity pointer-events-none" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1600')" }} />
        
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/30" />
        
        {/* Dynamic Glowing background curves */}
        <div className="absolute top-1/4 right-[10%] w-[35rem] h-[35rem] bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-[15%] w-[25rem] h-[25rem] bg-teal-500/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-15 w-full">
          <div className="max-w-4xl space-y-6">
            
            {/* Visual tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-500 uppercase rounded-full tracking-widest">
              <span>✦ BRAND CINEMA & EXPERIENTIAL FILMS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-sans tracking-tight font-light leading-[1.05]">
              Capturing human <br />
              <span className="font-extrabold text-neutral-100 bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 via-neutral-200 to-amber-500">
                motion in raw grain
              </span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-neutral-400 font-light max-w-2xl leading-relaxed">
              We operate high-end anamorphic visual pipelines to produce commercial brand campaigns, deep editorial music videos, and emotional cinematic wedding legacies.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#booking-section"
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-mono font-bold tracking-widest uppercase py-4 px-8 rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>BOOK INVENTORY & SHOT PLANS</span>
                <ChevronRight className="w-4 h-4 text-neutral-900 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#portfolio-section"
                className="bg-neutral-900 hover:bg-neutral-850 hover:text-white border border-neutral-805 text-neutral-300 font-mono text-xs tracking-wider uppercase py-4 px-7 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Film className="w-4 h-4 text-amber-500" />
                <span>LOAD SHOWREELS RANGE</span>
              </a>
            </div>

          </div>
        </div>

        {/* Minimal Bottom Info Strip */}
        <div className="absolute bottom-6 left-0 w-full hidden lg:block z-25">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] font-mono text-neutral-600">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> CAMERA BODY SENSOR CALIBRATIONS OK</span>
            <span>UHD CAPTURE: Sony dual-VLOG rec709 space</span>
            <span>RED RAPTOR MONSTRO OPTICS ARRAYS</span>
          </div>
        </div>
      </section>

      {/* 2. Portfolio Gallery Section */}
      <PortfolioGrid />

      {/* 3. AI Creative Shoot Planner Section (Gemini) */}
      <AIShootPlanner onApplyBriefToForm={handleApplyBriefToForm} />

      {/* 4. Interactive Booking & Packaging Configurator */}
      <BookingForm 
        initialPackageId={bookingPkgId} 
        initialNotes={bookingPkgId ? bookingNotes : ""} 
        initialAIBrief={bookingPkgId ? bookingAIBrief : null}
        onBookingSuccess={handleBookingSuccess} 
      />

      {/* 5. Private Portal Message log & Escrow Receipts Dashboard */}
      <ClientPortal 
        initialBookingId={portalBookingId} 
        onLogout={() => setPortalBookingId(null)} 
      />

      {/* Professional Footer */}
      <footer className="bg-neutral-950 py-16 border-t border-neutral-904 text-neutral-500 text-xs text-center relative overflow-hidden">
        <div className="absolute bottom-0 right-[20%] w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 space-y-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-8 border-b border-neutral-900/60">
            <div className="flex items-center gap-2 text-left">
              <div className="w-8 h-8 bg-amber-500 text-neutral-950 rounded-lg flex items-center justify-center font-bold">
                <Camera className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest text-neutral-300 block">MARCUS VANCE</span>
                <span className="text-[9px] font-mono tracking-wider text-neutral-550 block -mt-1">PREMIUM CINEMATOGRAPHY</span>
              </div>
            </div>
            <p className="text-left max-w-sm text-[11px] font-sans leading-normal">
              Based in San Francisco. Flying cinema drones globally. Specialized in RED Raptor & Sony Cine products.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-neutral-600 gap-4">
            <p>© 2026 Marcus Vance Cinematography. All rights cleared.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-neutral-600 hover:text-neutral-500 transition-colors">
                <Heart className="w-3.5 h-3.5 text-amber-500" /> Crafted with High Contrast
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                SSL Secured Escrow Vaults
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
