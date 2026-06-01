import React, { useState } from "react";
import { VIDEOGRAPHY_PACKAGES } from "../data";
import { AIBrief } from "../types";
import { Sparkles, Send, Cpu, Video, RotateCcw, ArrowRight, Loader2, BookOpen, Layers } from "lucide-react";

interface AIShootPlannerProps {
  onApplyBriefToForm: (packageId: string, notes: string, brief: AIBrief) => void;
}

export function AIShootPlanner({ onApplyBriefToForm }: AIShootPlannerProps) {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(VIDEOGRAPHY_PACKAGES[1].id);
  const [briefInput, setBriefInput] = useState<string>("");
  const [locationInput, setLocationInput] = useState<string>("");
  const [daysCount, setDaysCount] = useState<number>(2);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [generatedBrief, setGeneratedBrief] = useState<AIBrief | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedPackage = VIDEOGRAPHY_PACKAGES.find(p => p.id === selectedPackageId);

  const simulateLoadingTicks = () => {
    const messages = [
      "Interfacing with Gemini Creative Workspace...",
      "Drafting cinematic screenplay beats...",
      "Calibrating prime lens focal lengths...",
      "Gradiating atmospheric color curves...",
      "Finalizing production shot list..."
    ];
    let index = 0;
    setLoadingMessage(messages[0]);
    
    const interval = setInterval(() => {
      index++;
      if (index < messages.length) {
        setLoadingMessage(messages[index]);
      } else {
        clearInterval(interval);
      }
    }, 1200);

    return interval;
  };

  const handleGenerateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefInput.trim()) {
      setError("Please outline some rough concepts or ideas for your shoot first.");
      return;
    }

    setLoading(true);
    setGeneratedBrief(null);
    setError(null);
    const loadingInterval = simulateLoadingTicks();

    try {
      const response = await fetch("/api/gemini/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: selectedPackage?.name || "Bespoke Shoot",
          projectNotes: briefInput,
          location: locationInput || "To be scouted",
          daysCount: daysCount
        })
      });

      if (!response.ok) {
        throw new Error("Failed to consult Gemini creative services.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedBrief(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while generating your script brief.");
    } finally {
      clearInterval(loadingInterval);
      setLoading(false);
    }
  };

  const clearBrief = () => {
    setGeneratedBrief(null);
    setBriefInput("");
    setLocationInput("");
  };

  const handleLockIn = () => {
    if (!generatedBrief || !selectedPackage) return;
    
    const bulletNotes = `[AI CONCEPT: ${generatedBrief.theme}]\nLocation Target: ${locationInput || "Selected Coastline"}\n\nNotes: ${briefInput}`;
    
    onApplyBriefToForm(selectedPackage.id, bulletNotes, generatedBrief);
  };

  return (
    <div id="ai-planner-section" className="py-20 bg-neutral-900 border-y border-neutral-800 text-white relative">
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-mono tracking-wider uppercase mb-3 border border-amber-500/25">
            <Sparkles className="w-3.5 h-3.5" /> AI Creative Consult Ready
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-light tracking-tight">
            AI-Powered <span className="font-semibold text-neutral-100">Shoot Planner</span>
          </h2>
          <p className="text-sm md:text-base text-neutral-400 mt-3 max-w-xl mx-auto">
            Outline your baseline vision, and our integrated Gemini consultant will draft high-end scene boards, drone choreography, and the prime gear setups.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column Input Panel */}
          <div className="lg:col-span-5 bg-neutral-950 p-6 md:p-8 rounded-2xl border border-neutral-800/80 shadow-xl">
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2 border-b border-neutral-900 pb-3">
              <Cpu className="w-5 h-5 text-amber-500" /> Shoot Parameters
            </h3>

            <form onSubmit={handleGenerateBrief} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                  Target Service Format
                </label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 outline-none focus:border-amber-500/50 transition-colors"
                >
                  {VIDEOGRAPHY_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} (${pkg.basePrice}+)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                  Location Target
                </label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="e.g., Mountain Redwood Forest, Industrial Warehouse"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 placeholder text-neutral-600 outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                    Estimated Days
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={daysCount}
                    onChange={(e) => setDaysCount(parseInt(e.target.value) || 2)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                    Resolution
                  </label>
                  <div className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-500 font-mono flex items-center justify-between">
                    <span>4K DCI</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded uppercase">HQ</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                  Vision Outline & Details
                </label>
                <textarea
                  rows={4}
                  value={briefInput}
                  onChange={(e) => setBriefInput(e.target.value)}
                  placeholder="Describe your goals. e.g.: Wedding trailer on Amalfi Coast style cliffs. Dynamic slow-mo running shorts for a new sneaker ad campaign. High depth-of-field lights."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-100 placeholder-neutral-600 outline-none focus:border-amber-500/50 transition-colors resize-none"
                />
                <p className="text-[11px] text-neutral-500 mt-1.5 font-sans leading-normal">
                  Give specific atmospheric visual details like lighting tone, pacing, character triggers, or special drones expectations.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 text-neutral-950 text-xs font-mono font-bold tracking-widest uppercase py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 "
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                    <span>Synthesizing Concept...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-neutral-950" />
                    <span>Generate AI Creative Brief</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column Board Output HUD */}
          <div className="lg:col-span-7 h-full flex flex-col justify-between">
            {loading ? (
              <div className="flex-1 bg-neutral-950/40 border border-dashed border-neutral-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center h-[530px] shadow-inner">
                <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
                <h4 className="text-base font-light tracking-tight text-neutral-300">
                  Concept Synthesis in Progress
                </h4>
                <p className="text-xs font-mono text-amber-500/90 mt-2 p-2 bg-neutral-900 rounded-lg border border-neutral-850 max-w-sm">
                  {loadingMessage}
                </p>
                <p className="text-xs text-neutral-500 mt-4 max-w-xs leading-normal">
                  Our core algorithm is consulting cinematic framing structures, evaluating prime kit limits, and designing a tailored aesthetic folder.
                </p>
              </div>
            ) : generatedBrief ? (
              <div className="bg-neutral-950 rounded-2xl border border-neutral-850 p-6 md:p-8 flex flex-col justify-between h-auto shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 bg-amber-500/10 border-l border-b border-amber-500/20 text-xs font-mono text-amber-400 uppercase tracking-widest rounded-bl-xl flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" /> COMPILED BRIEF MD
                </div>

                <div className="space-y-6">
                  {/* Theme Header */}
                  <div>
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">
                      RECOMMENDED THEME & PATHWAY
                    </span>
                    <h4 className="text-2xl font-semibold text-neutral-100 tracking-tight mt-1 flex items-center gap-2">
                      <BookOpen className="w-5.5 h-5.5 text-amber-500" /> {generatedBrief.theme}
                    </h4>
                  </div>

                  {/* Scene Beats */}
                  <div className="pt-4 border-t border-neutral-900">
                    <h5 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-500" /> Screenplay Outline & Shot Beats
                    </h5>
                    <div className="bg-neutral-900/60 rounded-xl p-4 border border-neutral-850">
                      <pre className="text-xs text-neutral-300 font-sans whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto">
                        {generatedBrief.scriptOutline}
                      </pre>
                    </div>
                  </div>

                  {/* Staging Schedule */}
                  <div>
                    <h5 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">
                      📅 Staging Schedule & Stills
                    </h5>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed bg-neutral-900/60 p-4 rounded-xl border border-neutral-850">
                      {generatedBrief.shootTimeline}
                    </p>
                  </div>

                  {/* Mood & Contrast */}
                  <div>
                    <h5 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
                      🎨 Creative & Grading Direction
                    </h5>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light italic">
                      "{generatedBrief.creativeMood}"
                    </p>
                  </div>

                  {/* Gear List */}
                  <div>
                    <h5 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">
                      🎥 Optimized Camera Configuration
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {generatedBrief.recommendedGear.map((g, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-neutral-900 border border-neutral-805 text-amber-500 px-2.5 py-1 rounded-md">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Confirm actions */}
                <div className="mt-8 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={handleLockIn}
                    className="w-full sm:w-auto flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-xs font-bold uppercase py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Import to Booking Form</span>
                    <ArrowRight className="w-4 h-4 text-neutral-100" />
                  </button>
                  <button
                    onClick={clearBrief}
                    className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 font-mono text-xs py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset AI Advisor</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-950/40 border border-dashed border-neutral-800 rounded-2xl p-12 text-center h-[530px] flex flex-col justify-center items-center shadow-inner">
                <Video className="w-12 h-12 text-neutral-700 mb-4" />
                <h4 className="text-lg font-light text-neutral-300">
                  Concept Output Console
                </h4>
                <p className="text-xs text-neutral-500 max-w-sm mt-2 leading-relaxed">
                  Provide parameters (package type, optional target location, and a raw idea briefing list) inside the panel, then hit Generate to invoke our cinematic supervisor model.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-1.5 opacity-60 max-w-sm">
                  <span className="text-[9px] font-mono bg-neutral-900 text-neutral-500 px-2 py-0.5 rounded border border-neutral-850">Sony Cinematic Science</span>
                  <span className="text-[9px] font-mono bg-neutral-900 text-neutral-500 px-2 py-0.5 rounded border border-neutral-850">Anamorphic Grading</span>
                  <span className="text-[9px] font-mono bg-neutral-900 text-neutral-500 px-2 py-0.5 rounded border border-neutral-850">Custom Shot Choreography</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
