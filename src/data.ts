import { Package, PortfolioWork } from "./types";

export const VIDEOGRAPHY_PACKAGES: Package[] = [
  {
    id: "wedding-cinematic",
    name: "Elysian Wedding Story",
    description: "Full-day bespoke storytelling cinematic master for couples. Includes drone visuals and high-fidelity sound capture.",
    basePrice: 2800,
    estimatedDuration: "1 Full Day (10 hours)",
    category: "wedding",
    features: [
      "10 Hours continuous shooting coverage",
      "Two active principal camera operators",
      "Cinematic 4K DJI Mavic drone aerial footage",
      "6-8 Minute polished dramatic Highlight Film",
      "Full multicam footage of ceremony and speeches",
      "Professional audio tracking of vows and letters",
      "Private video portal stream & download license"
    ],
    recommendedGear: ["Sony FX3 + Sony a7S III", "Anamorphic 35mm & 50mm", "DJI Mavic Pro 3 Cine", "Wireless Rode Pro Audio Sync"]
  },
  {
    id: "commercial-anthem",
    name: "Commercial Brand Anthem",
    description: "Premium corporate narrative, high-energy product launch, or brand profile. Scripted with custom style boards.",
    basePrice: 3500,
    estimatedDuration: "1-2 Shoot Days",
    category: "commercial",
    features: [
      "AI-powered script briefing & concept modeling",
      "Up to 2 days of location filming",
      "High-speed 4K 120fps fluid action tracking",
      "Full G&E package (Aputure fixtures, diffuse panels)",
      "60-90s Master Campaign cut + 2x 15s social promos",
      "Standard commercial LUT coloring with film grain",
      "Bespoke audio mixing with licensed track rights"
    ],
    recommendedGear: ["RED V-Raptor 8K / Sony FX6", "Prime Cine Lens Pack", "Motorized DJI RS3 Pro Gimbal", "Laowa Probe Macro", "Aputure 600d Light Rig"]
  },
  {
    id: "narrative-creative",
    name: "Narrative Short / Music Video",
    description: "For artists, screenwriters, and musicians wanting high-contrast mood, theatrical grids, and raw cinematic emotion.",
    basePrice: 3200,
    estimatedDuration: "1-2 Shoot Days",
    category: "narrative",
    features: [
      "Detailed storyboarding & director's focus outline",
      "Expressive lighting setups (high contrast, neon, volumetric)",
      "Anamorphic look styling & widescreen framing",
      "Full dramatic edit syncing with custom soundtrack",
      "Color grading of film stock curves (e.g. Kodak emulation)",
      "Up to 5 minutes master video deliverables"
    ],
    recommendedGear: ["RED Raptor/Sony FX6", "Anamorphic Prime lenses", "Wireless Focus control pullers", "Volumetric smoke & laser setup"]
  },
  {
    id: "event-recap",
    name: "Dynamic Event Recap",
    description: "High-energy coverage of music festivals, private conferences, grand openings, or local stage performances.",
    basePrice: 1800,
    estimatedDuration: "Up to 6 Hours",
    category: "event",
    features: [
      "6 Hours of rapid on-site coverage",
      "Single specialized gimbal camera operator",
      "Multi-mic audio recording of main stage feeds",
      "2-3 Minute high-tempo, kinetic recap video",
      "Fast-track 5-day post-production turnaround",
      "Social-media optimized portrait crop included"
    ],
    recommendedGear: ["Sony FX3 Cinema Rig", "Tamron 28-75mm Pro Zoom", "DJI Mic 2 dual units", "Low-light f1.4 prime lens"]
  }
];

export const PORTFOLIO_WORKS: PortfolioWork[] = [
  {
    id: "elysian-vows",
    title: "Elysian Vows - Amalfi Shoreline",
    category: "Wedding Cinematic",
    client: "Alessandro & Sofia",
    description: "An emotional, slow-paced cinematic masterpiece blending dramatic cliffside aerials with soft, intimate vignettes of the couple.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Mock high-quality video files
    thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    location: "Amalfi Coast, Italy",
    duration: "6:45",
    gearUsed: ["Sony FX3 Cinema Camera", "Tamron 28-75mm f2.8 Pro", "Dji Mavic Pro 3 Cine", "PolarPro VND Filters"],
    story: "Filmed over two days in the coastal village of Ravello. We integrated a quiet, retro anamorphic color scheme to represent timeless Italian cinema. Our focus was capturing micro-interactions: the wind in Sofia's veil, salt spray crashing against the rocks behind them, and hushed laughter during golden hour.",
    creativeChallenge: "Sustaining high wind gust of 32 knots on the edge of the cliffs during vows. We swapped our large umbrella light diffusers for lightweight, concentrated directional panels and used physical deadcats on our lapel microphones to fully filter out sea storm rumblings.",
    directorsCut: true
  },
  {
    id: "primal-momentum-show",
    title: "Primal Momentum - Brand Launch",
    category: "Commercial Anthem",
    client: "Kinetic Sports Apparel",
    description: "A fast-paced, high-concept athletic profile capturing runners confronting raw elements with dynamic tracking angles.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800",
    location: "Golden Gate Coastal Trails",
    duration: "1:42",
    gearUsed: ["RED V-Raptor 8K", "Samyang 24mm T1.5 Cine Prime", "DJI Ronin 2 Gimbal", "Aputure 600d Pro"],
    story: "Kinetic requested an authentic campaign showing running athletes in unforgiving terrain. We timed our shoots strictly between 05:00 and 07:00 to lock down soft, high-contrast mist light, utilizing high-velocity gimbal running rigs to shadow athletes sprint-for-sprint.",
    creativeChallenge: "Replicating seamless water-shatter elements on trail puddles. We rigged our RED V-Raptor with custom water-resistant optical sheets, shooting at 240fps on a low-angle ground sled to turn basic muddy splashes into high-end dramatic droplets.",
    directorsCut: false
  },
  {
    id: "unbound-music",
    title: "Unbound Beats - Neon Echoes",
    category: "Narrative Music Video",
    client: "Soundscape Syndicate",
    description: "A trippy, highly-saturated music video exploring futuristic neon grids in narrow alleyways with fast frame cuts.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    location: "Tokyo Shinjuku Backstreets",
    duration: "3:55",
    gearUsed: ["Sony FX6 Cine Camera", "Atlas Orion Anamorphic 40mm T2.0 Lens", "DJI Ronin RS3 Pro", "Handheld LED Tubes"],
    story: "Soundscape Syndicate wanted a music video matching their synthwave tempo. We shot this live in the neon corridors of Tokyo, capturing raw street reflection, utilizing real rain puddle colors and flares to double the lighting complexity.",
    creativeChallenge: "Operating heavy setups in narrow alleys where pedestrians passed. We downsized to the light RS3 Pro with handheld focus motors, allowing the principal operator and focus puller to blend completely into crowds while tracking at 24mm anamorphic.",
    directorsCut: true
  },
  {
    id: "nebula-rave",
    title: "Nebula - Electric Pulse Festival",
    category: "Event Recap",
    client: "Voxel Events",
    description: "High-octane, strobe-lit festival highlight summarizing light crowds, pyrotechnics, and bass drops in a rhythmic sequence.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
    location: "Red Rocks Amphitheater",
    duration: "2:15",
    gearUsed: ["Sony FX3 core body", "Sony 16-35mm f2.8 G-Master", "DJI Mic 2 systems", "Sony 70-200mm f2.8 GM"],
    story: "Nebula is a premier underground rave with custom laser shows. Our goal was prioritizing camera heat dispersion and capturing high-contrast light flashes. We loaded specialized optical glass filters to protect our camera's high-sensitivity dual base ISO sensors from laser damage.",
    creativeChallenge: "Ensuring bass vibrations didn't inject gimbal warp wobbles. We deactivated general optical stabilization sensors on the zooms and mounted our camera on a mechanical triple-axis absorption ring to keep base drops perfectly smooth on screen.",
    directorsCut: false
  }
];
