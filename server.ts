import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not defined. Using fallback brief builder.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Ensure database file exists with initial design-grade seed data
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialBookings = [
      {
        id: "VID-7729",
        clientName: "Manas Kumar",
        clientEmail: "manasmanas3236@gmail.com",
        clientPhone: "+1 (555) 382-9021",
        packageName: "Cinematic Brand Anthem",
        packageId: "commercial-anthem",
        totalPrice: 3500,
        depositAmount: 1000,
        depositPaid: 1000,
        remainingBalance: 2500,
        paymentStatus: "deposit_paid",
        projectStatus: "shooting",
        shootDate: "2026-06-15",
        location: "Golden Gate Coast, SF",
        notes: "High-energy brand video showcasing active outdoor lifestyle. Require extensive 4K cinematic tracking shots, drone cliffs coverage, and warm color grading.",
        createdAt: new Date().toISOString(),
        deliveryLink: "",
        aiBrief: {
          theme: "Primal Momentum",
          scriptOutline: "1. Intro (0-0:10): High contrast dawn silhouette overlooking sea cliffs. Ambient low swell synth soundtrack starts.\n2. Stride (0:10-0:30): Ground tracking lens cuts: Footwear pacing, fast breaths, lens leaks showing bright highlights.\n3. Ascent (0:30-1:00): Full zoom drone track of running ascent along peak curves; dynamic sunburst flare.\n4. Climax (1:00-1:30): Extreme close-up of runner facing lens, beads of sweat reflective, grading curves warm up with retro-film saturation.\n5. Outro (1:30-2:00): Fade back to deep ocean horizon, subtle logo reveal.",
          recommendedGear: [
            "Sony FX3 Cine Camera",
            "Laowa 24mm Probe & 35mm T1.9 Anamorphic Lenses",
            "DJI Mavic Pro 3 Cine",
            "DJI Ronin RS3 Pro Gimbal",
            "Aputure 600d Pro Light Rig"
          ],
          shootTimeline: "Day 1 (Golden Hour): 05:00 - Scouting cliff line; 06:15 - Sunrise running wide-angle tracks; 09:00 - Close-up lighting stills.\nDay 2 (Aerial Run): 15:00 - Drone wind calibrating; 17:00 - Coast line tracking runs; 19:30 - Backup detail pack and offload.",
          creativeMood: "Earthy, organic warm cinematic. Visual notes focus on lens flares, anamorphic streak leaks, high-contrast morning shadows, and 4K 120fps ultra-fluid pacing."
        },
        timelineMilestones: [
          { label: "Concept Board & Scripting", description: "Creative outline synched and locked by client and director.", completed: true, date: "2026-06-01" },
          { label: "Site Scouting & Flight Permit", description: "Secured Golden Gate Coastal airspace clearance.", completed: true, date: "2026-06-03" },
          { label: "Principal Physical Shoots", description: "Capture tracking sprints, close-ups, and gear stills on-site.", completed: true, date: "2026-06-15" },
          { label: "Drone Aerial B-Roll", description: "Run high-altitude shoreline tracking cards.", completed: false, date: "2026-06-16" },
          { label: "Soundscape Mix & Grade", description: "Anamorphic correction, custom color curves, sfx layer sync.", completed: false, date: "2026-06-20" },
          { label: "Final Client Delivery", description: "Secure upload review stream on Project Hub.", completed: false, date: "2026-06-25" }
        ]
      }
    ];

    const initialMessages = [
      {
        id: "MSG-100",
        bookingId: "VID-7729",
        sender: "videographer",
        senderName: "Marcus Vance (Director)",
        text: "Hi Manas! Welcome to your digital creative suite. I've designed a dedicated shoot brief called 'Primal Momentum'. Everything is scouted on our end — we've locked the drone clearances for Golden Gate Coastal Cliffs!",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "MSG-101",
        bookingId: "VID-7729",
        sender: "client",
        senderName: "Manas Kumar",
        text: "Marcus, the theme draft is elite. I absolutely love the anamorphic flair concepts. Can we guarantee a couple of 120fps water-shatter frames?",
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "MSG-102",
        bookingId: "VID-7729",
        sender: "videographer",
        senderName: "Marcus Vance (Director)",
        text: "Definitely. I've noted that on our tracker! We'll utilize the FX3 at high shutter speed to capture coastal spray cleanly. Keep an eye on our milestone graph below as we upload pre-production cards.",
        createdAt: new Date().toISOString()
      }
    ];

    fs.writeFileSync(DB_FILE, JSON.stringify({ bookings: initialBookings, messages: initialMessages }, null, 2));
  }
}

initDatabase();

// Database read/write helpers
function readDB() {
  initDatabase();
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Database read failure, resetting database:", err);
    return { bookings: [], messages: [] };
  }
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ---------------- SERVER REST API ROUTES ----------------

// 1. Get all bookings (can filter by email)
app.get("/api/bookings", (req, res) => {
  const emailQuery = req.query.email as string;
  const db = readDB();
  
  if (emailQuery) {
    const normalized = emailQuery.trim().toLowerCase();
    const filtered = db.bookings.filter(
      (b: any) => b.clientEmail.trim().toLowerCase() === normalized
    );
    return res.json(filtered);
  }
  
  res.json(db.bookings);
});

// 2. Get booking by ID
app.get("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const booking = db.bookings.find((b: any) => b.id.toUpperCase() === id.toUpperCase());
  
  if (!booking) {
    return res.status(404).json({ error: "Booking session not found. Please verify your Project ID." });
  }
  
  res.json(booking);
});

// 3. Create a new booking
app.post("/api/bookings", (req, res) => {
  const {
    clientName,
    clientEmail,
    clientPhone,
    packageName,
    packageId,
    totalPrice,
    depositAmount,
    shootDate,
    location,
    notes,
    aiBrief
  } = req.body;

  if (!clientName || !clientEmail || !shootDate) {
    return res.status(400).json({ error: "Client Name, Email, and Shoot Date are required fields." });
  }

  const db = readDB();
  const rawId = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `VID-${rawId}`;

  const formattedDeposit = depositAmount || Math.round(totalPrice * 0.3);

  const newBooking = {
    id: bookingId,
    clientName,
    clientEmail,
    clientPhone: clientPhone || "",
    packageName,
    packageId,
    totalPrice,
    depositAmount: formattedDeposit,
    depositPaid: 0,
    remainingBalance: totalPrice,
    paymentStatus: "pending_deposit",
    projectStatus: "pre_production",
    shootDate,
    location: location || "To be arranged",
    notes: notes || "",
    createdAt: new Date().toISOString(),
    deliveryLink: "",
    aiBrief: aiBrief || null,
    timelineMilestones: [
      { label: "Concept Board & Scripting", description: "Establish narrative boards and aesthetic direction.", completed: false, date: shootDate },
      { label: "Location Scouting & Permits", description: "Verify shooting regulations and check weather maps.", completed: false, date: shootDate },
      { label: "Principal Shoot", description: "Full coverage filming.", completed: false, date: shootDate },
      { label: "Raw Assembly", description: "Consolidation of cards, initial rough sequence layout.", completed: false, date: "" },
      { label: "Soundscape Design", description: "Voice synthesis, dynamic mixing, clear background tracks.", completed: false, date: "" },
      { label: "Final Master Delivery", description: "Approved delivery files uploaded to private stream.", completed: false, date: "" }
    ]
  };

  db.bookings.push(newBooking);

  // Add automated initial greeting
  const firstSystemMessage = {
    id: `MSG-${Date.now()}`,
    bookingId: bookingId,
    sender: "videographer",
    senderName: "Marcus Vance (Director)",
    text: `Hi ${clientName}! Thanks for booking our ${packageName} scheduled for ${shootDate}. I have compiled your project portal. To secure this slot, please complete your secure checkout deposit of $${formattedDeposit} via the checkout hub above. Let me know if you have any questions!`,
    createdAt: new Date().toISOString()
  };

  db.messages.push(firstSystemMessage);
  writeDB(db);

  res.status(201).json(newBooking);
});

// 4. Get active booking messages
app.get("/api/bookings/:id/messages", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const filtered = db.messages.filter((m: any) => m.bookingId.toUpperCase() === id.toUpperCase());
  res.json(filtered);
});

// 5. Send message from client or operator
app.post("/api/bookings/:id/messages", (req, res) => {
  const { id } = req.params;
  const { sender, senderName, text } = req.body;

  if (!text || !sender) {
    return res.status(400).json({ error: "Message text and sender identifier are required." });
  }

  const db = readDB();
  const booking = db.bookings.find((b: any) => b.id.toUpperCase() === id.toUpperCase());
  
  if (!booking) {
    return res.status(404).json({ error: "Booking session not found." });
  }

  const newMessage = {
    id: `MSG-${Date.now()}`,
    bookingId: id.toUpperCase(),
    sender,
    senderName: senderName || (sender === 'client' ? booking.clientName : 'Marcus Vance (Director)'),
    text,
    createdAt: new Date().toISOString()
  };

  db.messages.push(newMessage);
  writeDB(db);

  // Automated responses to simulate operator interaction if client messages
  if (sender === "client") {
    setTimeout(() => {
      const dbLater = readDB();
      const replies = [
        "Perfect note! I've added that to our creative log. We will secure that frame.",
        "That works nicely! Let me review the shot sheet and update our checklist.",
        "Got it! I will sync up with my secondary cameraman to prepare the correct focal lens.",
        "Brilliant creative direction! I've updated our schedule checklist to align with that feedback."
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const simMessage = {
        id: `MSG-${Date.now() + 1}`,
        bookingId: id.toUpperCase(),
        sender: "videographer",
        senderName: "Marcus Vance (Director)",
        text: randomReply,
        createdAt: new Date().toISOString()
      };
      dbLater.messages.push(simMessage);
      writeDB(dbLater);
    }, 1500);
  }

  res.status(201).json(newMessage);
});

// 6. Submit mockup secure payment (deposits & balances)
app.post("/api/bookings/:id/payments", (req, res) => {
  const { id } = req.params;
  const { amount, paymentMethod, cardholderName } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Please specify a positive booking payment amount." });
  }

  const db = readDB();
  const bookingIndex = db.bookings.findIndex((b: any) => b.id.toUpperCase() === id.toUpperCase());

  if (bookingIndex === -1) {
    return res.status(404).json({ error: "Booking session not found." });
  }

  const booking = db.bookings[bookingIndex];
  const paidAmount = parseFloat(amount);

  // Update payment records
  booking.depositPaid = Math.min(booking.depositPaid + paidAmount, booking.depositAmount);
  booking.remainingBalance = Math.max(booking.totalPrice - booking.depositPaid, 0);

  // Re-calculate statuses
  if (booking.depositPaid >= booking.depositAmount) {
    booking.paymentStatus = "deposit_paid";
  }
  if (booking.depositPaid >= booking.totalPrice || booking.remainingBalance === 0) {
    booking.paymentStatus = "fully_paid";
  }

  // Create payment log message
  const systemMessage = {
    id: `MSG-${Date.now()}`,
    bookingId: id.toUpperCase(),
    sender: "system",
    senderName: "Secure Gateway Integration",
    text: `💳 Deposit Transaction Approved. Verified payment of $${paidAmount.toLocaleString()} received via ${paymentMethod || "Visa"} (Cardholder: ${cardholderName || "Client"}). Project invoices recalculated. Status updated to: ${booking.paymentStatus.toUpperCase().replace('_', ' ')}.`,
    createdAt: new Date().toISOString()
  };

  db.messages.push(systemMessage);
  
  // Also add simulated Marcus reply congratulating them on securing the shoot
  const MarcusCongrats = {
    id: `MSG-${Date.now() + 5}`,
    bookingId: id.toUpperCase(),
    sender: "videographer",
    senderName: "Marcus Vance (Director)",
    text: `Incredible! We have safely locked your transaction receipt and locked down our calendar dates for you. Let's make this project a cinematic masterpiece!`,
    createdAt: new Date().toISOString()
  };
  db.messages.push(MarcusCongrats);

  db.bookings[bookingIndex] = booking;
  writeDB(db);

  res.json({ success: true, booking });
});

// 7. Update shoot milestone status (Videographer Sandbox Operator Control)
app.post("/api/bookings/:id/update-status", (req, res) => {
  const { id } = req.params;
  const { projectStatus, milestoneIndex, completed, deliveryLink } = req.body;

  const db = readDB();
  const bookingIndex = db.bookings.findIndex((b: any) => b.id.toUpperCase() === id.toUpperCase());

  if (bookingIndex === -1) {
    return res.status(404).json({ error: "Booking session not found." });
  }

  const booking = db.bookings[bookingIndex];

  if (projectStatus) {
    booking.projectStatus = projectStatus;
  }
  if (deliveryLink !== undefined) {
    booking.deliveryLink = deliveryLink;
  }

  if (milestoneIndex !== undefined && booking.timelineMilestones && booking.timelineMilestones[milestoneIndex]) {
    booking.timelineMilestones[milestoneIndex].completed = completed;
    booking.timelineMilestones[milestoneIndex].date = new Date().toISOString().split("T")[0];

    // Log update in messages
    const updateLog = {
      id: `MSG-${Date.now()}`,
      bookingId: id.toUpperCase(),
      sender: "system",
      senderName: "Project Board",
      text: `🔄 Status Update: Milestone [${booking.timelineMilestones[milestoneIndex].label}] marked as ${completed ? "COMPLETED" : "PENDING"}.`,
      createdAt: new Date().toISOString()
    };
    db.messages.push(updateLog);
  }

  db.bookings[bookingIndex] = booking;
  writeDB(db);

  res.json({ success: true, booking });
});

// 8. AI Gemini Shoot Brief Creative Advisor Route
app.post("/api/gemini/generate-brief", async (req, res) => {
  const { packageName, projectNotes, location, daysCount } = req.body;

  if (!packageName) {
    return res.status(400).json({ error: "Please indicate a selected videography package type." });
  }

  const client = getGeminiClient();

  if (!client) {
    // Elegant fallback simulation if API key is not supplied
    const mockedBrief = {
      theme: `Spectrum - Elegant Visuals`,
      scriptOutline: `Scene 1: Ambient introduction establishing natural highlights and morning lighting. Beautiful framing cuts of locations.\nScene 2: Kinetic tracking shots with rich focal depth. Creative angle movements using stabilizing systems.\nScene 3: Deep color contrast focus. Anamorphic stretch visuals reflecting sunset flares.\nScene 4: Dynamic wrap and logo fading away into high-contrast black.`,
      recommendedGear: [
        "Primary Cinema Body",
        "Prime Lenses Set (24mm, 50mm, 85mm)",
        "Motorized Camera Gimbal Mount",
        "Ultra-soft LED Panel Arrays",
        "Dual-card Capture Storage Cards"
      ],
      shootTimeline: `08:00 - Gear calibrations & weather check\n10:00 - Staging of tracking frames & focal sweeps\n14:00 - Dynamic drone tracks for cinematic scale\n18:00 - Sunset golden flare takes & lockup`,
      creativeMood: `Modern cinematic narrative framing with earthy grades, dynamic pacing, and extreme visual polish.`
    };
    return res.json(mockedBrief);
  }

  try {
    const prompt = `You are a world-class award-winning cinematographic director, director of photography, and camera operator.
Generate a structured, high-end professional Video Shoot Creative Brief for this project:
- Videography Category / Package: "${packageName}"
- Focus Area / Brief: "${projectNotes || "High-end cinematic visuals"}"
- Filming Location Target: "${location || "Scenic outdoor cinematic sites"}"
- Target Coverage: "${daysCount || 2} day production schedule"

Outline a spectacular concept with cinematic flair. Highlight advanced techniques: focal lengths, lighting models, camera movements, drone coverage modes, and cinematic color curves. Ensure the recommendations are realistic but look premium.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an expert Hollywood DP (Director of Photography) and creative head. Provide structured cinematic brief solutions in JSON.",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { 
              type: Type.STRING, 
              description: "A highly creative, memorable, evocative Hollywood-grade name/theme for this videography concept." 
            },
            scriptOutline: { 
              type: Type.STRING, 
              description: "A chronological scene-by-scene cinematography outline (at least 4 visual beats) detailing camera directions, frame pacing, and focal concepts." 
            },
            recommendedGear: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 4-6 specific pieces of elite gear (e.g., Sony FX6/FX3, RED Raptor, ARRI, exact lenses, stabilizer, drone, Aputure fixtures)." 
            },
            shootTimeline: { 
              type: Type.STRING, 
              description: "High-level visual timeline showing staging schedule (e.g. Sunrise setups, wind testing, gimbal action, golden hour)." 
            },
            creativeMood: { 
              type: Type.STRING, 
              description: "Detailed description of the visual mood, grading curves, contrast levels, depth of field styling, and soundscape direction." 
            }
          },
          required: ["theme", "scriptOutline", "recommendedGear", "shootTimeline", "creativeMood"]
        }
      }
    });

    const textResult = response.text;
    if (!textResult) {
      throw new Error("Empty creative feedback from Gemini AI services.");
    }

    const aiBrief = JSON.parse(textResult.trim());
    res.json(aiBrief);

  } catch (error: any) {
    console.error("Gemini creative synthesis failure:", error);
    res.status(500).json({ error: "AI Brief generator temporarily offline. Fallback suggestions generated." });
  }
});


// ---------------- VITE DEV SERVER / PRODUCTION SERVING ----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Professional Videography Portal server running on port ${PORT}`);
  });
}

startServer();
