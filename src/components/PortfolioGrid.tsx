import { useState } from "react";
import { PORTFOLIO_WORKS } from "../data";
import { PortfolioWork } from "../types";
import { Play, MapPin, Film, Info, Cpu, X, Maximize2, Sparkles, Sliders } from "lucide-react";

export function PortfolioGrid() {
  const [selectedWork, setSelectedWork] = useState<PortfolioWork | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isAnamorphic, setIsAnamorphic] = useState<boolean>(true); // Cine 2.39:1 frame mask
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const categories = ["All", "Wedding Cinematic", "Commercial Anthem", "Narrative", "Event"];

  const filteredWorks = activeCategory === "All"
    ? PORTFOLIO_WORKS
    : PORTFOLIO_WORKS.filter(work => work.category.toLowerCase() === activeCategory.toLowerCase());

  const openWorkModal = (work: PortfolioWork) => {
    setSelectedWork(work);
    setIsPlaying(false);
  };

  const closeWorkModal = () => {
    setSelectedWork(null);
    setIsPlaying(false);
  };

  return (
    <div id="portfolio-section" className="py-20 bg-neutral-950 text-white relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-amber-500 text-xs font-mono tracking-widest uppercase mb-2 block">
              ✦ Selected Reels & Deliverables
            </span>
            <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-light">
              Cinematic <span className="font-medium text-neutral-100">Showcase</span>
            </h2>
            <p className="text-neutral-400 mt-2 text-sm md:text-base max-w-xl">
              We translate human emotions and raw mechanical motion into high-fidelity anamorphic visual records.
            </p>
          </div>

          {/* Filtering tabs */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0 bg-neutral-900/60 p-1.5 rounded-xl border border-neutral-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-amber-500 text-neutral-950 shadow-md font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredWorks.map((work) => (
            <div
              key={work.id}
              onClick={() => openWorkModal(work)}
              className="group cursor-pointer bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5"
            >
              {/* Picture Frame */}
              <div className="relative aspect-video overflow-hidden bg-black">
                <img
                  src={work.thumbnailUrl}
                  alt={work.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                />
                
                {/* Overlay grading */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/10 opacity-60" />

                {/* Director's Cut tag */}
                {work.directorsCut && (
                  <span className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-md text-neutral-950 text-[10px] font-mono tracking-widest uppercase font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Director's Cut
                  </span>
                )}

                {/* Location indicator */}
                <span className="absolute bottom-4 left-4 text-xs font-mono text-neutral-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> {work.location}
                </span>

                {/* Play Button hover effect */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-neutral-950/45 backdrop-blur-[2px]">
                  <div className="w-14 h-14 bg-amber-500 text-neutral-950 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-amber-500/20">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>

                {/* Widescreen cinema bars preview */}
                <div className="absolute top-0 left-0 w-full h-[5%] bg-black transition-all group-hover:h-[8%]" />
                <div className="absolute bottom-0 left-0 w-full h-[5%] bg-black transition-all group-hover:h-[8%]" />
              </div>

              {/* Text info info */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-500 tracking-wider uppercase bg-amber-500/10 px-2 py-0.5 rounded-md">
                    {work.category}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono flex items-center gap-1">
                    <Film className="w-3.5 h-3.5" /> {work.duration}
                  </span>
                </div>
                <h3 className="text-xl font-medium tracking-tight mt-3 text-neutral-100 group-hover:text-amber-400 transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm text-neutral-400 mt-2 line-clamp-2">
                  {work.description}
                </p>

                {/* Technical snippet */}
                <div className="mt-4 pt-4 border-t border-neutral-800/60 flex flex-wrap gap-1.5">
                  {work.gearUsed.slice(0, 3).map((g, idx) => (
                    <span key={idx} className="text-[10px] font-mono bg-neutral-950 text-neutral-400 px-2 py-0.5 rounded border border-neutral-800/40">
                      {g}
                    </span>
                  ))}
                  {work.gearUsed.length > 3 && (
                    <span className="text-[10px] font-mono text-neutral-500 px-1 py-0.5 align-middle">
                      +{work.gearUsed.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic Modal Window */}
      {selectedWork && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl relative">
            
            {/* Header control strip */}
            <div className="p-4 md:px-6 md:py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">
                  PORTFOLIO STREAM
                </span>
                <span className="text-xs text-neutral-500 hidden sm:inline">|</span>
                <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  Client: {selectedWork.client}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Widescreen aspect switcher */}
                <button
                  onClick={() => setIsAnamorphic(!isAnamorphic)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
                    isAnamorphic
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-neutral-900 border-neutral-800 text-neutral-500"
                  }`}
                  title="Toggle Cinematic Anamorphic Aspect Ratio Mask (2.39:1)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Aspect: {isAnamorphic ? "Anamorphic 2.39:1" : "Wide 16:9"}
                </button>
                <button
                  onClick={closeWorkModal}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 p-1.5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated Anamorphic Video Player */}
            <div className={`relative bg-neutral-950 overflow-hidden flex items-center justify-center transition-all duration-500 ${
              isAnamorphic ? "aspect-[2.39/1]" : "aspect-video"
            }`}>
              
              {/* Actual Video Frame */}
              {isPlaying ? (
                <video
                  src={selectedWork.videoUrl}
                  controls
                  autoPlay
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <img
                    src={selectedWork.thumbnailUrl}
                    alt={selectedWork.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  {/* Subtle noise layer to look theatrical */}
                  <div className="absolute inset-0 bg-neutral-950/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-amber-500 text-neutral-950 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 shadow-amber-500/25">
                        <Play className="w-7 h-7 fill-current ml-1" />
                      </div>
                      <span className="text-xs font-mono text-neutral-300 tracking-wider bg-neutral-950/80 px-3 py-1.5 rounded-full border border-neutral-800">
                        CLICK TO LOAD MOCK UHD COMPOSITION
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Anamorphic Scope Bars (Letterbox) */}
              {isAnamorphic && (
                <>
                  <div className="absolute top-0 left-0 w-full h-[6%] bg-neutral-950 pointer-events-none z-10 border-b border-white/5" />
                  <div className="absolute bottom-0 left-0 w-full h-[6%] bg-neutral-950 pointer-events-none z-10 border-t border-white/5" />
                </>
              )}

              {/* Tech details hud overlay */}
              <div className="absolute bottom-4 right-4 bg-neutral-950/85 backdrop-blur-md text-[10px] font-mono text-neutral-400 px-3 py-1.5 rounded-lg border border-neutral-800 pointer-events-none hidden md:flex items-center gap-3">
                <span>REEL REZ: 4K (DCI)</span>
                <span>•</span>
                <span>COLOR: REC709 V-LOG</span>
                <span>•</span>
                <span>FPS: 23.976</span>
              </div>
            </div>

            {/* Modular metadata sheet */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-h-[450px] overflow-y-auto">
              
              {/* Left Column: Details */}
              <div className="md:col-span-2 space-y-5">
                <div>
                  <span className="text-amber-500 text-xs font-mono tracking-widest uppercase">
                    {selectedWork.category} WORK
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light tracking-tight mt-1">
                    {selectedWork.title}
                  </h3>
                  <p className="text-xs font-mono text-neutral-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> {selectedWork.location} • Client: {selectedWork.client} • Run: {selectedWork.duration}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono text-neutral-300 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <Info className="w-3.5 h-3.5 text-amber-500" /> Directorial Insight & Story
                  </h4>
                  <p className="text-sm text-neutral-400 leading-relaxed font-light">
                    {selectedWork.story}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono text-neutral-300 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <Sliders className="w-3.5 h-3.5 text-amber-500" /> Operational & Creative Challenges
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed italic bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    "{selectedWork.creativeChallenge}"
                  </p>
                </div>
              </div>

              {/* Right Column: Gear and Credits */}
              <div className="space-y-6 md:border-l md:border-neutral-800 md:pl-8">
                <div>
                  <h4 className="text-xs font-mono text-neutral-300 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <Cpu className="w-3.5 h-3.5 text-amber-500" /> Gear Configuration
                  </h4>
                  <div className="space-y-1.5">
                    {selectedWork.gearUsed.map((gear, idx) => (
                      <div
                        key={idx}
                        className="text-xs font-mono bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-850 text-neutral-400 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {gear}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-850">
                    <h5 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      READY TO FILM?
                    </h5>
                    <p className="text-xs text-neutral-400 mt-1">
                      This production setup can be customized for your shoot. Check packages or use our AI Shoot Brief tool to map yours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
