import { useState, useEffect, useRef } from "react";

// ─── GLOBAL STYLES + FONTS ────────────────────────────────────────────────────
(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Baloo+2:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
  const s = document.createElement("style");
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    :root {
      --bg: #FFFFFF;
      --surface: #F7F3EF;
      --card: #FFFFFF;
      --text: #1A1208;
      --sub: #7A6A58;
      --accent: #E8671A;
      --accent2: #00A8C4;
      --accent-lo: rgba(232,103,26,0.08);
      --accent2-lo: rgba(0,168,196,0.08);
      --border: rgba(232,103,26,0.22);
      --border-gray: rgba(0,0,0,0.09);
      --shadow: 0 2px 16px rgba(0,0,0,0.07);
      --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
      --h: 'Baloo 2', 'Plus Jakarta Sans', sans-serif;
      --b: 'Plus Jakarta Sans', sans-serif;
    }
    body { background: var(--bg); color: var(--text); font-family: var(--b); overflow-x: hidden; }
    ::selection { background: var(--accent); color: #fff; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #f0ebe5; }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes marquee { to { transform: translateX(-50%); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    .page { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .marquee-inner { animation: marquee 32s linear infinite; display: flex; white-space: nowrap; }
    input, select, textarea {
      background: #F7F3EF;
      border: 1.5px solid var(--border-gray);
      color: var(--text);
      font-family: var(--b);
      border-radius: 10px;
      padding: 12px 16px;
      width: 100%;
      outline: none;
      font-size: 14px;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
      -webkit-appearance: none;
    }
    input:focus, select:focus, textarea:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(232,103,26,0.1);
      background: #fff;
    }
    input::placeholder, textarea::placeholder { color: #B0A090; }
    select option { background: #fff; color: #1A1208; }
    .trip-card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s; }
    .trip-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(232,103,26,0.18), 0 4px 16px rgba(0,0,0,0.08); }
    @media (max-width: 768px) {
      .desktop-only { display: none !important; }
      .sidebar-grid { grid-template-columns: 1fr !important; }
      .two-col { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 480px) {
      .trip-grid { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(s);
})();

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TRIPS = [
  {
    id: "manali", name: "Manali, Sissu & Kasol",
    tagline: "Snow peaks, cedar forests & Parvati Valley vibes",
    difficulty: "Moderate", duration: "6N/7D", price: 12999, originalPrice: 15999,
    dates: ["Apr 25, 2026", "May 9, 2026", "May 23, 2026"],
    spotsLeft: 4, totalSlots: 20,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
    bg: "linear-gradient(160deg, #071828 0%, #0d2e52 55%, #081e38 100%)",
    accent: "#5AB8E6", tag: "Snow Adventure", icon: "❄️", rating: 4.9, reviews: 127,
    highlights: ["Rohtang Snow Point", "Kheerganga Trek", "Kasol Riverside Camp", "Sissu Lake"],
    inclusions: ["Twin/Triple sharing accommodation", "Breakfast + Dinner daily", "AC Tempo Traveller", "Trip Captain throughout", "All entry permits & fees"],
    exclusions: ["Personal expenses", "Adventure activities (on request)", "Lunch", "Travel insurance", "Delhi pickup (+₹500)"],
    itinerary: [
      { day: 1, title: "Delhi → Manali (Overnight Bus)", desc: "Depart Delhi at 6PM in comfortable AC sleeper bus. Cozy night journey through the Himalayan foothills." },
      { day: 2, title: "Arrive Manali — Explore & Bond", desc: "Check-in after freshening up. Explore Mall Road, Hadimba Temple, evening bonfire and group introductions." },
      { day: 3, title: "Rohtang Pass & Sissu Lake", desc: "Snow play at Rohtang (subject to permit). Visit the stunning turquoise Sissu Lake surrounded by waterfalls." },
      { day: 4, title: "Kheerganga Trek", desc: "Trek 12km through dense pine forests to the famous natural hot springs at Kheerganga summit (3050m)." },
      { day: 5, title: "Parvati Valley & Kasol", desc: "Explore the hippie village, Israeli bakeries, riverside cafes and the chill Parvati Valley sunset." },
      { day: 6, title: "Departure from Bhuntar", desc: "Farewell group dinner. Overnight AC bus back to Delhi." },
      { day: 7, title: "Arrive Delhi — Trip Ends", desc: "Early morning arrival. Trip over — but friendships last forever." },
    ]
  },
  {
    id: "spiti", name: "Spiti Valley Circuit",
    tagline: "Cold desert, ancient monasteries & Milky Way skies",
    difficulty: "Hard", duration: "8N/9D", price: 18999, originalPrice: 22999,
    dates: ["May 30, 2026", "Jun 13, 2026", "Jun 27, 2026"],
    spotsLeft: 3, totalSlots: 16,
    image: "https://images.unsplash.com/photo-1604608672516-f1b9c8c1e90e?w=800&q=80",
    bg: "linear-gradient(160deg, #1c1008 0%, #3d2610 55%, #241408 100%)",
    accent: "#E8963E", tag: "High Altitude", icon: "🏔️", rating: 5.0, reviews: 64,
    highlights: ["Key Monastery (4166m)", "Chandratal Lake", "Chicham Bridge", "Pin Valley NP"],
    inclusions: ["Authentic guesthouse stays", "All three meals (local cuisine)", "SUVs for rough mountain roads", "Experienced local guide", "Oxygen cylinder on standby"],
    exclusions: ["Alcohol & personal items", "Medical expenses", "Travel insurance", "Tips for crew"],
    itinerary: [
      { day: 1, title: "Delhi → Shimla (Overnight)", desc: "Night bus to Shimla. The beginning of an epic cold-desert odyssey." },
      { day: 2, title: "Shimla → Sangla Valley", desc: "Scenic drive through apple orchards along the roaring Sutlej river." },
      { day: 3, title: "Sangla → Chitkul", desc: "Visit Chitkul — the last inhabited village on the Indo-Tibet border road." },
      { day: 4, title: "Kalpa → Nako → Tabo", desc: "Crossing into Spiti. Nako Lake views, followed by the 1000-year-old Tabo Monastery." },
      { day: 5, title: "Tabo → Dhankar → Kaza", desc: "Dramatic Dhankar gorge and cliff monastery. Settle into Kaza, capital of Spiti." },
      { day: 6, title: "Kaza — Local Exploration", desc: "Key Monastery at 4166m, Kibber village, Langza fossil village (4400m)." },
      { day: 7, title: "Chandratal Lake Camp", desc: "The crown jewel of Spiti. Camp under the Milky Way at 4300m elevation." },
      { day: 8, title: "Chandratal → Manali", desc: "Cross Kunzum La pass (4590m). Descend to Manali, farewell dinner." },
      { day: 9, title: "Manali → Delhi (Overnight)", desc: "Overnight return journey. Arrive Delhi by morning." },
    ]
  },
  {
    id: "rishikesh", name: "Rishikesh Adventure",
    tagline: "White water rafting, bungee & Ganga ghats",
    difficulty: "Easy", duration: "3N/4D", price: 6999, originalPrice: 8999,
    dates: ["Every Weekend", "Apr 19, 2026", "Apr 26, 2026"],
    spotsLeft: 8, totalSlots: 25,
    image: "https://images.unsplash.com/photo-1585016495481-8c53c5a77151?w=800&q=80",
    bg: "linear-gradient(160deg, #081e0e 0%, #103d1c 55%, #082814 100%)",
    accent: "#5BE88A", tag: "Weekend Getaway", icon: "🌊", rating: 4.8, reviews: 203,
    highlights: ["26km White Water Rafting", "Bungee Jumping (83m)", "Beatles Ashram", "Ganga Aarti"],
    inclusions: ["Riverside camp stay", "All meals", "26km rafting included", "Transport from Delhi", "Evening bonfire"],
    exclusions: ["Bungee/Flying Fox (+ ₹1200)", "Zip line (+ ₹800)", "Personal expenses", "Insurance"],
    itinerary: [
      { day: 1, title: "Delhi → Rishikesh", desc: "Early morning departure by bus. Arrive afternoon, check-in riverside camp, orientation." },
      { day: 2, title: "Rafting & Ganga Aarti", desc: "Epic 26km white water rafting on the Ganges. Evening Ganga Aarti at Triveni Ghat." },
      { day: 3, title: "Yoga, Beatles Ashram & Cafes", desc: "Morning yoga session. Explore Laxman Jhula, Beatles Ashram, cafe hopping." },
      { day: 4, title: "Morning Leisure & Return", desc: "Free morning. Post-lunch departure, arrive Delhi by evening." },
    ]
  },
  {
    id: "goa", name: "Goa — Beach & Vibes",
    tagline: "Beaches, forts, shacks & sunsets with your crew",
    difficulty: "Easy", duration: "4N/5D", price: 9999, originalPrice: 12999,
    dates: ["May 1, 2026", "May 15, 2026", "Jun 5, 2026"],
    spotsLeft: 10, totalSlots: 25,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    bg: "linear-gradient(160deg, #080e22 0%, #0f2044 55%, #081530 100%)",
    accent: "#5BACE8", tag: "Beach Holiday", icon: "🏖️", rating: 4.7, reviews: 189,
    highlights: ["North & South Goa", "Old Goa Churches", "Arpora Night Market", "Sunset Cruise"],
    inclusions: ["Hotel (twin sharing)", "Daily breakfast", "Station/airport pickup", "Trip Captain", "Sunset cruise evening"],
    exclusions: ["Flights or train tickets", "Lunch & dinner (own)", "Water sports extra charge", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrive Goa — Settle In", desc: "Pickup, hotel check-in, welcome drinks. Evening beach walk and group introductions." },
      { day: 2, title: "North Goa Beach Day", desc: "Baga, Calangute, Anjuna Beach. Water sports, shacks, and vibrant nightlife." },
      { day: 3, title: "Heritage & Night Market", desc: "Old Goa UNESCO churches. Evening at Arpora Saturday Night Market (or Mackie's)." },
      { day: 4, title: "South Goa — Palolem", desc: "Pristine Palolem beach. Sunset boat cruise and fresh seafood dinner." },
      { day: 5, title: "Free Morning & Checkout", desc: "Leisurely breakfast, noon checkout, drop at station/airport." },
    ]
  },
  {
    id: "jibhi", name: "Jibhi & Jalori Pass",
    tagline: "Himachal's best-kept secret — offbeat & magical",
    difficulty: "Easy", duration: "3N/4D", price: 7499, originalPrice: 9499,
    dates: ["Every Weekend", "Apr 19, 2026", "May 3, 2026"],
    spotsLeft: 5, totalSlots: 18,
    image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80",
    bg: "linear-gradient(160deg, #081408 0%, #1c3610 55%, #101e08 100%)",
    accent: "#8BE85B", tag: "Offbeat Hidden Gem", icon: "🌿", rating: 4.9, reviews: 88,
    highlights: ["Jibhi Waterfall", "Jalori Pass (3120m)", "Serolsar Lake", "Ancient Wooden Cottages"],
    inclusions: ["Traditional wooden cottage", "Home-cooked all meals", "Transport from Chandigarh", "Local guide", "Bonfire nights"],
    exclusions: ["Chandigarh travel (own)", "Personal gear", "Tips for crew", "Insurance"],
    itinerary: [
      { day: 1, title: "Chandigarh → Jibhi", desc: "5-hour scenic drive through Mandi and Kullu. Cottage check-in, village walk at sunset." },
      { day: 2, title: "Jibhi Waterfall & Temples", desc: "Morning waterfall hike. Explore ancient carved wooden temples and local Himachali culture." },
      { day: 3, title: "Jalori Pass & Serolsar Lake", desc: "Trek to 3120m Jalori Pass. Hidden Serolsar Lake in a serene oak forest bowl." },
      { day: 4, title: "Return to Chandigarh", desc: "Leisurely breakfast. Depart by noon, arrive Chandigarh by evening." },
    ]
  },
  {
    id: "chopta", name: "Chopta & Tungnath",
    tagline: "Mini Switzerland of India — meadows, temples & snow",
    difficulty: "Moderate", duration: "4N/5D", price: 8999, originalPrice: 11499,
    dates: ["Apr 20, 2026", "May 4, 2026", "May 18, 2026"],
    spotsLeft: 6, totalSlots: 20,
    image: "https://images.unsplash.com/photo-1543906965-f9520aa2ed8a?w=800&q=80",
    bg: "linear-gradient(160deg, #0a1a0a 0%, #1a3a1a 55%, #0a200a 100%)",
    accent: "#7BE87B", tag: "Trek & Temple", icon: "🛕", rating: 4.9, reviews: 94,
    highlights: ["Tungnath Temple (3680m)", "Chandrashila Summit (4130m)", "Deoria Tal Lake", "Ukhimath Village"],
    inclusions: ["Guesthouse & camp stays", "All meals (veg)", "Transport from Haridwar", "Trek guide", "Permits & entry fees"],
    exclusions: ["Haridwar travel (own)", "Personal trekking gear", "Medical expenses", "Insurance"],
    itinerary: [
      { day: 1, title: "Haridwar → Ukhimath", desc: "Drive through Devprayag and Rudraprayag. Evening at peaceful Ukhimath village." },
      { day: 2, title: "Deoria Tal Lake Trek", desc: "Morning trek to stunning Deoria Tal — reflections of Chaukhamba peaks on the lake surface." },
      { day: 3, title: "Chopta → Tungnath Trek", desc: "Trek 4km to Tungnath — world's highest Shiva temple at 3680m. Overnight at Chopta." },
      { day: 4, title: "Chandrashila Summit", desc: "Early morning summit climb to 4130m. 360° Himalayan panorama — Nanda Devi, Trishul, Kedar peaks." },
      { day: 5, title: "Return to Haridwar", desc: "Descend, drive back. Trip ends with memories of the most beautiful meadows in India." },
    ]
  },
  {
    id: "kedarnath", name: "Kedarnath Yatra",
    tagline: "Sacred Himalayas — faith, snow & divine energy",
    difficulty: "Hard", duration: "5N/6D", price: 11999, originalPrice: 14999,
    dates: ["May 6, 2026", "May 20, 2026", "Jun 3, 2026"],
    spotsLeft: 5, totalSlots: 18,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
    bg: "linear-gradient(160deg, #1a0a00 0%, #3a1a00 55%, #200a00 100%)",
    accent: "#FFB347", tag: "Spiritual Trek", icon: "🙏", rating: 5.0, reviews: 76,
    highlights: ["Kedarnath Temple (3583m)", "Bhairavnath Temple", "Vasuki Tal Lake", "Gaurikund Hot Springs"],
    inclusions: ["Hotel + dharamshala stays", "All meals", "Transport from Haridwar", "Experienced guide", "Pony/palki booking support"],
    exclusions: ["Pony/helicopter charges", "Personal expenses", "Travel insurance", "Medical expenses"],
    itinerary: [
      { day: 1, title: "Haridwar → Guptkashi", desc: "Drive along Mandakini river. Evening prayers at Ardhnarishwar Temple in Guptkashi." },
      { day: 2, title: "Guptkashi → Gaurikund → Trek Start", desc: "Drive to Gaurikund (base camp at 1982m). Hot springs dip, begin the 16km trek to Kedarnath." },
      { day: 3, title: "Kedarnath Darshan", desc: "Early morning darshan at the sacred Kedarnath Temple. Visit Bhairavnath Temple above. Spiritual atmosphere." },
      { day: 4, title: "Vasuki Tal (Optional)", desc: "Optional trek to Vasuki Tal lake at 4135m — stunning alpine lake with glacier views." },
      { day: 5, title: "Trek Down → Sonprayag", desc: "Descend to Gaurikund. Drive to Sonprayag. Farewell dinner with the group." },
      { day: 6, title: "Return to Haridwar", desc: "Scenic drive back. Trip ends with blessings of Baba Kedarnath." },
    ]
  },
  {
    id: "kasol", name: "Kasol & Kheerganga",
    tagline: "Parvati Valley chill — cafes, rivers & hot springs",
    difficulty: "Easy", duration: "3N/4D", price: 5999, originalPrice: 7999,
    dates: ["Every Weekend", "Apr 18, 2026", "Apr 25, 2026"],
    spotsLeft: 9, totalSlots: 22,
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
    bg: "linear-gradient(160deg, #0a0818 0%, #1a1040 55%, #0a0820 100%)",
    accent: "#B47BFF", tag: "Backpacker Vibes", icon: "🎒", rating: 4.8, reviews: 156,
    highlights: ["Kasol Riverside Camp", "Kheerganga Hot Springs", "Tosh Village", "Chalal Trek"],
    inclusions: ["Riverside camp + guesthouse", "Breakfast & dinner", "Transport from Delhi", "Trek guide for Kheerganga", "Bonfire & music nights"],
    exclusions: ["Lunch (own)", "Personal expenses", "Insurance", "Alcohol"],
    itinerary: [
      { day: 1, title: "Delhi → Kasol (Overnight Bus)", desc: "Board overnight bus from Delhi. Wake up to Parvati Valley views — green mountains and blue river." },
      { day: 2, title: "Kasol Explore & Chalal", desc: "Israeli cafes, Chalal village trek, riverside hangout. Evening bonfire and music jam." },
      { day: 3, title: "Kheerganga Trek", desc: "12km trek through pine forests. Reward: natural hot spring pool at 3050m with mountain views." },
      { day: 4, title: "Tosh Village & Return", desc: "Visit the charming Tosh village. Afternoon bus back to Delhi, arrive midnight." },
    ]
  },
  {
    id: "ladakh", name: "Ladakh — Land of High Passes",
    tagline: "Pangong Lake, Nubra Valley & monastery magic",
    difficulty: "Hard", duration: "7N/8D", price: 24999, originalPrice: 29999,
    dates: ["Jun 10, 2026", "Jun 24, 2026", "Jul 8, 2026"],
    spotsLeft: 4, totalSlots: 16,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    bg: "linear-gradient(160deg, #080820 0%, #100840 55%, #080028 100%)",
    accent: "#FFD700", tag: "Bucket List Trip", icon: "🌄", rating: 5.0, reviews: 112,
    highlights: ["Pangong Tso Lake", "Nubra Valley & Sand Dunes", "Khardung La (5359m)", "Magnetic Hill"],
    inclusions: ["Hotel + guesthouse stays", "All meals", "Innova/SUV transport", "Experienced Ladakh guide", "Inner Line Permits", "Oxygen cylinder"],
    exclusions: ["Flights to Leh", "Personal gear", "Travel insurance", "Tips for crew"],
    itinerary: [
      { day: 1, title: "Arrive Leh — Acclimatize", desc: "Rest day in Leh at 3500m. Walk to Leh Market and Shanti Stupa. No strenuous activity." },
      { day: 2, title: "Leh Local Sightseeing", desc: "Leh Palace, Shey Palace, Thiksey Monastery, Hemis Monastery — Ladakh's cultural soul." },
      { day: 3, title: "Leh → Nubra Valley", desc: "Cross Khardung La (5359m) — world's one of highest motorable passes. Double-humped camel ride in Hunder sand dunes." },
      { day: 4, title: "Nubra → Pangong Lake", desc: "Drive through stunning mountain landscapes to iconic Pangong Tso — the lake that changes colours." },
      { day: 5, title: "Pangong — Sunrise & Explore", desc: "Witness magical sunrise over Pangong. Explore along the 134km long lake spanning India-China border." },
      { day: 6, title: "Pangong → Leh via Chang La", desc: "Return via Chang La pass (5360m). Visit Rancho School (3 Idiots fame)." },
      { day: 7, title: "Magnetic Hill & Gurudwara", desc: "Visit Magnetic Hill, Gurudwara Pathar Sahib, Hall of Fame. Farewell group dinner." },
      { day: 8, title: "Fly Back from Leh", desc: "Drop at Leh airport. Trip ends — Ladakh stays in your heart forever." },
    ]
  },
  {
    id: "kerala", name: "Kerala Backwaters & Munnar",
    tagline: "Houseboats, tea gardens & God's Own Country",
    difficulty: "Easy", duration: "5N/6D", price: 13999, originalPrice: 17999,
    dates: ["May 10, 2026", "May 24, 2026", "Jun 7, 2026"],
    spotsLeft: 7, totalSlots: 20,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    bg: "linear-gradient(160deg, #001810 0%, #003020 55%, #001810 100%)",
    accent: "#4ECDC4", tag: "South India Escape", icon: "🌴", rating: 4.8, reviews: 98,
    highlights: ["Alleppey Houseboat", "Munnar Tea Gardens", "Athirapally Waterfall", "Fort Kochi Heritage"],
    inclusions: ["Hotels + houseboat stay", "All meals (Kerala cuisine)", "AC vehicle throughout", "Trip Captain", "Houseboat cruise included"],
    exclusions: ["Flights to Kochi", "Personal expenses", "Adventure activities", "Insurance"],
    itinerary: [
      { day: 1, title: "Arrive Kochi — Fort Kochi", desc: "Pickup from Kochi airport/station. Explore Fort Kochi — Chinese fishing nets, spice markets, colonial heritage." },
      { day: 2, title: "Kochi → Munnar", desc: "Drive up to Munnar at 1600m. Endless tea plantations, Eravikulam National Park, Mattupetty Lake." },
      { day: 3, title: "Munnar — Tea & Waterfalls", desc: "Tea museum visit, Top Station viewpoint, Attukal Waterfalls. Evening bonfire in tea garden." },
      { day: 4, title: "Munnar → Alleppey", desc: "Drive down to Alleppey — backwater capital. Board your private houseboat on Kerala's famous canals." },
      { day: 5, title: "Houseboat Day", desc: "Full day cruising through backwaters. Village life, paddy fields, toddy shops from the boat. Sunset on water." },
      { day: 6, title: "Alleppey → Kochi Departure", desc: "Morning check-out. Drive to Kochi. Trip ends with fresh coconut water and Kerala memories." },
    ]
  },
];

const TESTIMONIALS = [
  { initials: "PS", name: "Priya Sharma", from: "Mumbai → Triund", text: "Life-changing experience! Met my closest friends here. The captain handled everything perfectly — food, stays, safety. Literally zero stress.", rating: 5 },
  { initials: "AM", name: "Arjun Mehta", from: "Bangalore → Manali", text: "Solo traveler no more! From day one it felt like family. I've already booked my second trip — Spiti is next. Don't overthink it, just book.", rating: 5 },
  { initials: "KN", name: "Kavya Nair", from: "Chennai → Jibhi", text: "Perfect mix of adventure and relaxation. Home-cooked food was incredible. Jibhi is pure magic — please go before it gets crowded.", rating: 5 },
  { initials: "RG", name: "Rohan Gupta", from: "Delhi → Spiti", text: "Spiti genuinely changed my perspective on life. Best ₹19K I ever spent. Zero hidden costs, everything exactly as promised.", rating: 5 },
  { initials: "AV", name: "Amit Verma", from: "Lucknow → Rishikesh", text: "Rafting was absolutely insane! The whole group clicked immediately. Will remember this forever. Just book it already.", rating: 5 },
];

// ─── RAZORPAY INTEGRATION ─────────────────────────────────────────────────────
// 🔧 SETUP: Replace these values before going live
const RAZORPAY_CONFIG = {
  key: "YOUR_RAZORPAY_KEY_ID",       // 🔑 Get from Razorpay Dashboard > Settings > API Keys
  brandName: "Apna Safar",           // ✅ Your brand name
  brandLogo: "",                      // 🖼️ Your logo URL (optional)
  // Backend order creation endpoint (RECOMMENDED for production security):
  // createOrderUrl: "https://your-backend.com/api/create-order",
};

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const initiatePayment = async ({ trip, travelers, name, email, phone, date, onSuccess, onFail }) => {
  const loaded = await loadRazorpay();
  if (!loaded) { onFail("Payment gateway failed to load. Please check your connection."); return; }

  const amount = trip.price * travelers;

  // PRODUCTION: Create order on your backend first, then pass order_id below
  // Example backend call:
  // const { id: orderId } = await fetch(RAZORPAY_CONFIG.createOrderUrl, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ amount: amount * 100, currency: "INR", tripId: trip.id }),
  // }).then(r => r.json());

  const options = {
    key: RAZORPAY_CONFIG.key,
    amount: amount * 100,          // in paise
    currency: "INR",
    name: RAZORPAY_CONFIG.brandName,
    description: `${trip.name} — ${travelers} Traveler${travelers > 1 ? "s" : ""} | ${date}`,
    image: RAZORPAY_CONFIG.brandLogo,
    // order_id: orderId,            // Uncomment after backend integration
    handler: (response) => {
      // ✅ Payment captured — send to your backend to verify signature
      // fetch("/api/verify-payment", { method: "POST", body: JSON.stringify(response) })
      onSuccess(response);
    },
    prefill: { name, email, contact: phone },
    notes: { tripId: trip.id, tripName: trip.name, date, travelers },
    theme: { color: "#C8963E" },
    modal: { ondismiss: () => onFail("Payment was cancelled.") },
  };

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", (r) => onFail(r.error.description));
  rzp.open();
};

// ─── NAV ─────────────────────────────────────────────────────────────────────
const Nav = ({ page, setNav }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (p) => { setNav(p); window.scrollTo({ top: 0, behavior: "instant" }); };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      height: 64,
      background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border-gray)" : "none",
      transition: "all 0.35s ease",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 5vw",
    }}>
      <button onClick={() => go("home")} style={{
        background: "none", border: "none", cursor: "pointer",
        fontFamily: "var(--h)", fontSize: 22, fontWeight: 700,
        color: "var(--text)", letterSpacing: "0.01em",
      }}>
        <span style={{ fontSize: 20 }}>✈️</span>
        <span>APNA <span style={{ color: "var(--accent)" }}>SAFAR</span></span>
      </button>

      <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {[["Destinations", "destinations"], ["Contact", "contact"]].map(([label, id]) => (
          <button key={id} onClick={() => go(id)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: page === id ? "var(--accent)" : "var(--sub)",
            fontFamily: "var(--b)", fontSize: 14, letterSpacing: "0.03em",
            transition: "color 0.2s",
          }}>{label}</button>
        ))}
        <button onClick={() => go("destinations")} style={{
          background: "var(--accent)", color: "#fff", border: "none",
          padding: "9px 24px", borderRadius: 6, cursor: "pointer",
          fontFamily: "var(--b)", fontSize: 13, fontWeight: 600,
          letterSpacing: "0.04em",
          transition: "opacity 0.2s",
        }} onMouseEnter={e => e.target.style.opacity = 0.85} onMouseLeave={e => e.target.style.opacity = 1}>
          Book Now ✈️
        </button>
      </div>
    </nav>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = ({ setNav }) => {
  const go = (p) => { setNav(p); window.scrollTo({ top: 0, behavior: "instant" }); };
  return (
    <footer style={{ background: "var(--text)", borderTop: "none", padding: "60px 5vw 28px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 40, marginBottom: 48, textAlign: "left" }}>
          <div>
            <div style={{ fontFamily: "var(--h)", fontSize: 22, fontWeight: 700, marginBottom: 14, color: "#fff", textAlign: "left" }}>
              <span style={{ fontSize: 18 }}>✈️</span> APNA <span style={{ color: "var(--accent)" }}>SAFAR</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.8, maxWidth: 240, textAlign: "left" }}>
              Safar Jo Apna Lage — curated group adventures for solo travelers across India's most breathtaking landscapes.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              {["Instagram", "YouTube", "WhatsApp"].map(n => (
                <button key={n} style={{
                  background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)",
                  padding: "5px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12,
                  transition: "border-color 0.2s, color 0.2s",
                }} onMouseEnter={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.color = "var(--accent)"; }}
                   onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "rgba(255,255,255,0.6)"; }}>{n}</button>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", marginBottom: 16, textTransform: "uppercase" }}>Destinations</div>
            {TRIPS.slice(0, 8).map(t => (
              <button key={t.id} onClick={() => go("trip-" + t.id)} style={{
                display: "block", background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 10, textAlign: "left",
                padding: 0,
                transition: "color 0.2s",
              }} onMouseEnter={e => e.target.style.color = "var(--accent)"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}>{t.name}</button>
            ))}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", marginBottom: 16, textTransform: "uppercase" }}>Company</div>
            {["Privacy Policy", "Terms & Conditions", "Refund Policy", "FAQs"].map(n => (
              <div key={n} style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 10, textAlign: "left" }}>{n}</div>
            ))}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", marginBottom: 16, textTransform: "uppercase" }}>Contact</div>
            {[["📍", "Bighar Road, Fatehabad, Haryana"], ["📧", "info.apnasafar@gmail.com"], ["📞", "+91 82951 03548"]].map(([icon, val]) => (
              <div key={val} style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 10, display: "flex", gap: 8, textAlign: "left" }}>
                <span>{icon}</span><span>{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>© 2026 Apna Safar. All rights reserved.</div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Secure payments via <span style={{ color: "var(--accent)" }}>Razorpay</span></div>
        </div>
      </div>
    </footer>
  );
};

// ─── TRIP CARD ────────────────────────────────────────────────────────────────
const TripCard = ({ trip, setNav }) => {
  const go = () => { setNav("trip-" + trip.id); window.scrollTo({ top: 0, behavior: "instant" }); };
  const pct = Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100);

  return (
    <div className="trip-card" onClick={go} style={{
      background: "#fff", borderRadius: 16, overflow: "hidden",
      cursor: "pointer", border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
    }}>
      {/* Card top — image or gradient */}
      <div style={{
        height: 210, position: "relative", overflow: "hidden",
        background: trip.image ? "none" : trip.bg,
      }}>
        {trip.image && (
          <img src={trip.image} alt={trip.name} style={{
            width: "100%", height: "100%", objectFit: "cover",
            display: "block",
          }} onError={e => { e.target.style.display = "none"; e.target.parentNode.style.background = trip.bg; }} />
        )}
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />
        {/* Tags */}
        <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)",
            border: `1px solid ${trip.accent}66`, color: trip.accent,
            padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
          }}>{trip.icon} {trip.tag}</span>
          <span style={{
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)",
            color: "rgba(255,255,255,0.85)", padding: "5px 10px", borderRadius: 20, fontSize: 11,
          }}>{trip.difficulty}</span>
        </div>
        {/* Highlights bottom */}
        <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {trip.highlights.slice(0, 2).map(h => (
            <span key={h} style={{
              background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
              color: "rgba(255,255,255,0.85)", padding: "3px 9px", borderRadius: 4, fontSize: 10, fontWeight: 500,
            }}>{h}</span>
          ))}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "18px 20px 20px", background: "#fff" }}>
        <div style={{ color: "#E8671A", fontSize: 12, marginBottom: 5 }}>
          {"★".repeat(Math.floor(trip.rating))} <span style={{ color: "var(--sub)" }}>{trip.rating} ({trip.reviews})</span>
        </div>
        <h3 style={{ fontFamily: "var(--h)", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 4, lineHeight: 1.25 }}>{trip.name}</h3>
        <p style={{ color: "var(--sub)", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>{trip.tagline}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#C0B0A0", fontSize: 12, textDecoration: "line-through" }}>₹{trip.originalPrice.toLocaleString()}</span>
              <span style={{ background: "rgba(34,197,94,0.12)", color: "#16A34A", fontSize: 11, padding: "2px 7px", borderRadius: 4, fontWeight: 600 }}>-{pct}%</span>
            </div>
            <div style={{ color: "var(--accent)", fontFamily: "var(--h)", fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}>₹{trip.price.toLocaleString()}</div>
            <div style={{ color: "var(--sub)", fontSize: 11, marginTop: 2 }}>per person · {trip.duration}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: trip.spotsLeft <= 5 ? "#DC2626" : "var(--sub)", fontSize: 12, fontWeight: trip.spotsLeft <= 5 ? 600 : 400 }}>
              {trip.spotsLeft <= 5 ? `🔥 ${trip.spotsLeft} left` : `${trip.spotsLeft} spots`}
            </div>
            <div style={{ color: "var(--sub)", fontSize: 11, marginTop: 4 }}>Next: {trip.dates[0]}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const HomePage = ({ setNav }) => {
  const [counts, setCounts] = useState({ travelers: 0, trips: 0, dest: 0 });
  const statsRef = useRef(null);
  const marqueeItems = ["Group Adventures", "Himalayan Trails", "Safar Jo Apna Lage", "Beach Escapes", "Solo-Friendly Trips", "Budget Travel", "Lifetime Memories", "Apna Safar ✈️"];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const animateCount = (key, target) => {
        const duration = 2200;
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setCounts(c => ({ ...c, [key]: Math.floor(eased * target) }));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      animateCount("travelers", 2400);
      animateCount("trips", 185);
      animateCount("dest", 24);
      observer.disconnect();
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const go = (p) => { setNav(p); window.scrollTo({ top: 0, behavior: "instant" }); };

  return (
    <div className="page">
      {/* ── HERO ── */}
      <div style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: "0 6vw 90px",
      }}>
        {/* Atmospheric background */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAMMBaADASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAEGAgMFBAcI/8QAaRAAAgICAQMCAgQIBggPCgoLAQIAAwQRBRIhMQZBE1EHFCIyFRYjVGGUwdMkQnGB0fAXJTNSVZGz0jQ1NjdDVmJmdIOVoaTC4iYnRlNydXaCpeEIRUdXY3OEk6KxsrTERIWGkjhlo9T/xAAbAQEAAwEBAQEAAAAAAAAAAAAAAgMEAQUGB//EAEgRAAIBAgMEBQkFBgYCAQQDAAABAgMRBCExEkFRYRNxgZGhBRQiMlKxwdHwIzNCcuEVYoKSorIGJDTC0vFDU+IWJVTTNWOD/9oADAMBAAIRAxEAPwD9bxIiZDQTEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBzOW/hmVRxK90f8tl/IVKeyH/AMttDRGmUWD2nUnL4P8AhL5XKt3OS/w6vl8GssE0fDBiWsB+VgGyADOnIRzz4kpZZExIiTIkxIiATEiIBM5bf22vuob/AEBQ5rsH5y4A2u/HwwToj+MwZToKQ2fKWWZFv4JxrGrsuqZrbkOjRX42NeHbZ6d9vsse/T0n3U1101JVVWtdaKFRFGgoHYAD2Eg/SdtxLRXM4kRJkSYkRAJiREAmJE0ZuZh4NQtzcujGrLdIe6wICfOtn37GcbsErnoicv8ACeRkduO4vKt32+JkqcasH3B6x8Tx7hCNkDfnTo5+z7f1njMXf+xfV3v6f/X6038/ujW9d9bMdtbsyWzxOpE5f4Mzf9sPJ/8A3eP+6j8GZv8Ath5P/wC7x/3UbT4e4bK4nUicv4HO1/c5DBvVPurbiMruB7M6voE+7BNe/T7R+Ec3H/0w4q1V8m3Ef6wij22NLYTv+9QgbB3502+KGzwOpE8uByGFndYxMqq1q9fEQN9usn2dfKnsexAPY/KemSTTzRFq2pMSInQTEiIBMSIgHMyv7Uu2ZX/oJ3Bya/aose9q+wGztwe2tt2Ibr6kiczB/tblJxjd8e3rfEfx0aOzT8uwJKAfxVI0OjbQ9V8iWqOpEiJMiTEiIBMSIgEzl4/8B5mzGPbHzd3U/JbR/dEHsOoacAbJItJnTnP9QV2fg85ePW1mThN9ZpRRsuVBBQD5spZPB11bA2BIT0vwJR4HRiYU2V3VJbVYtlbqGR1OwwPcEH3EykyJMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIBMSIgExIiATEiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCc/1FZYvFvRRYyZGUy41TIdOhc9JdddyUUs/b2Q9x5HQnMu/hPqSik/cwaDkMD2/KWFkQj56VbgQe32h59oT0sSjrc6NNddNSVVVrXWihURRoKB2AA9hMoiTIiIiAIiIAmvKyKcWhr736UXXsSSSdAADuSSQAB3JIAmyczI/h3M14w74+Fq675Naf7mh9j0jbkHRBNREjJ20OpXNvCY91WK1+UnRl5Tm+9dg9DEABNjselQqbHnp35JnuiJ1KysG7sRETpwREQBMbrK6anttsWutFLO7HQUDuST7CY5WRTi0Nfe/Si69iSSToAAdySSAAO5JAE8dOLfl2plcgWRFYPVh7UohHdWcj7zjz56QdaBKhzFvcjqW9mH1nL5Htxx+r4p/wD3x0DfFXx+SXf8pDsNdgQrg7G/C43GxbTkANdlMvS+Rc3XYw8kb/irvv0rpQfAE9kQo72d2tyEREkREREAREQDzZ+BiZvQcirb17+HajFLK9+el1IZd60dEbHYzy9fI8d3ua3k8b+/StRfX7ksBoOPP3FDDQAVySR04kXFao6pbjXi5GPl0LkYt9V9L76bK3DKdHR0R28ibJ4crDuW9szAu+FedGyptfCvIGh19iQddupe/jYYKFm/Cyq8uougZHRuiytxp6291YfPuD22CCCCQQST3MNb0b4iJI4IiIAnm5XE+u4FmOLPhOdNVZrfw7FIZG176YA6PY60Z6YnGrqx1O2Z5uMy/rmKtj1/BvX7N9JOzVZoEqT7+ex8EEEdiJ6ZzMj+A8zXkjtj5uqbvkto/ubn2HUNoSdkkVATpzkXuYa4CIiSOCIiAIiIBzOB/IfW+NPb6refhA9t1P8AbTS+yrs1jXb8mda1odOczL/g3qHDyB2XMRsWwDuWdQbKz+gAC7x7sPPt05CGluBKXERESZEREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAERE5cCIiLgSEdbEV0YMrDasDsEfMQ6LYjI6hlYaZSNgj5GYYtFONjpRRWK6kGlUe0XBsiIi4ERIsRLEauxVdGBDKw2CD7GLgVuliLZWyujAFWU7BB9xJmvFx6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lCw0wXY7qP5tzfD/AAti5Uulco2tfff3fE8qp/jjAxr9AoT2r20Vr9e1p2H2WePO5bisC4U53J4WLYV6gl16oxHjeifHY/4pwH9C8fkNWOS5bnOToRur4GXmlqydEA9gDsb9iJ7cD0b6Xwuv4PC4r9et/HBu8b8dZOvPtPPrYTDYZ7NWcm+SXvcvgevh/KGNxkdqhTio3tdyd9OCj/uPPd634Q3PRxwzeXyK2IerAxmsYAdi2zoFd6GwT5E1Vcv6u5RSeN9O4/HV9RKXcncdsoJGjWo6lY+e/bQPnYMtNNddNKU01pXWihURBpVA7AADwJlKfOcPD7ulfnJt+C2V33NHmeMqv7WvZcIRS8XtPua7CqXemOW5Wlxz3qbNK2KR9X48CipA33kJ0TYvgDq7638zOpw3prgeHYPx/F49VgYstpBexSRo6ZtkDXsDrufnOvEhUx+InHY2rR4LJdysiyj5KwtKfSbF5e1K8n3u7XZ8EIiJjPQEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQD//Z')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,248,244,0.7)" }} />
        <div style={{ position: "absolute", top: "5%", right: "10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(232,103,26,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(0,168,196,0.04) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, width: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(232,103,26,0.1)", border: "1.5px solid rgba(232,103,26,0.25)", borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            <span style={{ color: "var(--accent)", fontSize: 12, letterSpacing: "0.14em", fontWeight: 600, textTransform: "uppercase" }}>Safar Jo Apna Lage ✈️</span>
          </div>
          <h1 style={{
            fontFamily: "var(--h)", fontSize: "clamp(48px, 9vw, 112px)",
            fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.02em",
            marginBottom: 28, maxWidth: 980, color: "var(--text)",
          }}>
            Apna <span style={{ color: "var(--accent)" }}>Safar</span>,<br />
            Apne <span style={{ color: "var(--accent2)" }}>Log</span>
          </h1>
          <p style={{ color: "var(--sub)", fontSize: "clamp(15px, 2vw, 18px)", maxWidth: 500, lineHeight: 1.75, marginBottom: 44 }}>
            Group travel curated for solo travelers. Hop on, make friends, create memories. <strong style={{ color: "var(--text)", fontWeight: 600 }}>Safar Jo Apna Lage.</strong>
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={() => go("destinations")} style={{
              background: "var(--accent)", color: "#fff", border: "none",
              padding: "15px 38px", borderRadius: 8, cursor: "pointer",
              fontFamily: "var(--b)", fontSize: 15, fontWeight: 600, letterSpacing: "0.03em",
              transition: "transform 0.2s, box-shadow 0.2s",
            }} onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(232,103,26,0.45)"; }}
               onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}>
              ✈️ Explore Trips
            </button>
            <button onClick={() => go("contact")} style={{
              background: "none", color: "var(--text)", border: "1px solid var(--border)",
              padding: "15px 38px", borderRadius: 8, cursor: "pointer",
              fontFamily: "var(--b)", fontSize: 15, transition: "border-color 0.2s, color 0.2s",
            }} onMouseEnter={e => { e.target.style.borderColor = "var(--accent2)"; e.target.style.color = "var(--accent2)"; }} onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text)"; }}>
              Talk to Us
            </button>
          </div>
        </div>

        <div className="desktop-only" style={{ position: "absolute", right: "4vw", bottom: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ writingMode: "vertical-rl", color: "var(--sub)", fontSize: 11, letterSpacing: "0.16em" }}>SCROLL</div>
          <div style={{ width: 1, height: 50, background: "linear-gradient(to bottom, var(--sub), transparent)" }} />
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div style={{ overflow: "hidden", borderTop: "1.5px solid rgba(232,103,26,0.15)", borderBottom: "1.5px solid rgba(232,103,26,0.15)", background: "#E8671A", padding: "13px 0" }}>
        <div className="marquee-inner">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, marginRight: 52 }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>✦</span>
              <span style={{ color: "#fff", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── DESTINATIONS ── */}
      <div style={{ padding: "88px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ color: "var(--accent)", fontSize: 11, letterSpacing: "0.18em", marginBottom: 12, textTransform: "uppercase" }}>Kahan Jaana Hai?</div>
              <h2 style={{ fontFamily: "var(--h)", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, lineHeight: 1.1, color: "#1A1208" }}>
                Curated <span style={{ color: "var(--accent)" }}>Trips</span>
              </h2>
            </div>
            <button className="desktop-only" onClick={() => go("destinations")} style={{
              background: "var(--text)", color: "#fff", border: "none",
              padding: "13px 28px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
              fontFamily: "var(--b)", transition: "opacity 0.2s",
            }} onMouseEnter={e => e.target.style.opacity = 0.85} onMouseLeave={e => e.target.style.opacity = 1}>View All Trips →</button>
          </div>
          <div className="trip-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18 }}>
            {TRIPS.slice(0, 6).map(t => <TripCard key={t.id} trip={t} setNav={setNav} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <button onClick={() => go("destinations")} style={{
              background: "var(--accent)", color: "#fff", border: "none",
              padding: "15px 48px", borderRadius: 8, cursor: "pointer",
              fontSize: 16, fontWeight: 600, fontFamily: "var(--b)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }} onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(232,103,26,0.35)"; }}
               onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}>
              ✈️ View All {TRIPS.length} Destinations
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div ref={statsRef} style={{ background: "#E8671A", borderTop: "none", borderBottom: "none", padding: "64px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 40, textAlign: "center" }}>
          {[
            { val: counts.travelers.toLocaleString() + "+", label: "Happy Travelers" },
            { val: counts.trips + "+", label: "Trips Completed" },
            { val: counts.dest + "", label: "Destinations" },
            { val: "98%", label: "Satisfaction Rate" },
          ].map(({ val, label }) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--h)", fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{val}</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 10 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div style={{ padding: "88px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 52 }}>
            <div style={{ color: "var(--accent)", fontSize: 11, letterSpacing: "0.18em", marginBottom: 12, textTransform: "uppercase" }}>Traveler Stories</div>
            <h2 style={{ fontFamily: "var(--h)", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, lineHeight: 1.1, color: "#1A1208" }}>
              Told By Those Who Lived It
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: "#fff", border: "1.5px solid var(--border-gray)", borderRadius: 16, padding: 28, boxShadow: "var(--shadow)" }}>
                <div style={{ fontFamily: "Georgia", fontSize: 48, color: "var(--accent)", opacity: 0.25, lineHeight: 1, marginBottom: 14 }}>"</div>
                <p style={{ color: "var(--sub)", fontSize: 15, lineHeight: 1.75, marginBottom: 22 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "rgba(232,103,26,0.1)", border: "2px solid var(--accent)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--h)", fontSize: 15, color: "var(--accent)", fontWeight: 700,
                  }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--sub)" }}>{t.from}</div>
                  </div>
                  <div style={{ marginLeft: "auto", color: "var(--accent)", fontSize: 12, letterSpacing: 1 }}>{"★".repeat(t.rating)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{
        padding: "88px 5vw", textAlign: "center",
        background: "linear-gradient(135deg, #FFF3EC 0%, #FFF8F4 100%)",
        borderTop: "1.5px solid rgba(232,103,26,0.12)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(232,103,26,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ color: "var(--accent)", fontSize: 11, letterSpacing: "0.18em", marginBottom: 16, textTransform: "uppercase" }}>⚡ Limited Spots Each Batch</div>
          <h2 style={{ fontFamily: "var(--h)", fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 700, lineHeight: 1.05, marginBottom: 20, color: "#1A1208" }}>
            Apna <span style={{ color: "var(--accent)" }}>Safar</span>,<br />Apne <span style={{ color: "var(--accent2)" }}>Log</span>
          </h2>
          <p style={{ color: "var(--sub)", fontSize: 17, maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.75 }}>
            Join a batch of solo travelers. Leave with a family. Spots fill up fast — don't miss your batch.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => go("destinations")} style={{
              background: "var(--accent)", color: "#fff", border: "none",
              padding: "16px 44px", borderRadius: 8, cursor: "pointer",
              fontSize: 16, fontWeight: 600, fontFamily: "var(--b)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }} onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(232,103,26,0.4)"; }} onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}>
              ✈️ Browse Upcoming Trips
            </button>
            <button onClick={() => go("contact")} style={{
              background: "none", color: "var(--text)", border: "1px solid var(--border)",
              padding: "16px 44px", borderRadius: 8, cursor: "pointer", fontSize: 16, fontFamily: "var(--b)",
            }}>Talk to Us</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DESTINATIONS PAGE ────────────────────────────────────────────────────────
const DestinationsPage = ({ setNav }) => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? TRIPS : TRIPS.filter(t => t.difficulty === filter);

  return (
    <div className="page" style={{ minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ padding: "64px 5vw 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ color: "var(--accent)", fontSize: 11, letterSpacing: "0.18em", marginBottom: 14, textTransform: "uppercase" }}>Explore</div>
          <h1 style={{ fontFamily: "var(--h)", fontSize: "clamp(44px, 8vw, 88px)", fontWeight: 800, marginBottom: 44, lineHeight: 1, color: "#1A1208" }}>All Destinations</h1>

          <div style={{ display: "flex", gap: 10, marginBottom: 44, flexWrap: "wrap" }}>
            {["All", "Easy", "Moderate", "Hard"].map(d => (
              <button key={d} onClick={() => setFilter(d)} style={{
                background: filter === d ? "var(--accent)" : "#fff",
                color: filter === d ? "#fff" : "#1A1208",
                border: `1.5px solid ${filter === d ? "var(--accent)" : "rgba(0,0,0,0.12)"}`,
                padding: "9px 22px", borderRadius: 100, cursor: "pointer",
                fontSize: 14, fontFamily: "var(--b)", fontWeight: 500, transition: "all 0.2s",
              }}>{d}</button>
            ))}
          </div>

          <div className="trip-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {filtered.map((trip, i) => (
              <div key={trip.id} style={{ animation: `slideUp 0.5s ${i * 80}ms ease both` }}>
                <TripCard trip={trip} setNav={setNav} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── TRIP DETAIL PAGE ─────────────────────────────────────────────────────────
const TripDetailPage = ({ tripId, setNav }) => {
  const trip = TRIPS.find(t => t.id === tripId);
  const [tab, setTab] = useState("overview");
  const [form, setForm] = useState({ name: "", email: "", phone: "", travelers: 1, date: "" });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (trip) setForm(f => ({ ...f, date: trip.dates[0] }));
  }, [trip]);

  if (!trip) return (
    <div style={{ padding: "140px 5vw", textAlign: "center" }}>
      <div style={{ fontFamily: "var(--h)", fontSize: 48, marginBottom: 16 }}>Trip Not Found</div>
      <button onClick={() => setNav("destinations")} style={{ background: "var(--accent)", color: "#000", border: "none", padding: "12px 28px", borderRadius: 6, cursor: "pointer", fontSize: 15 }}>← All Destinations</button>
    </div>
  );

  const total = trip.price * form.travelers;
  const savings = (trip.originalPrice - trip.price) * form.travelers;

  const handlePay = async () => {
    if (!form.name || !form.email || !form.phone) { setPayError("Please fill all required fields (name, email, phone)."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setPayError("Please enter a valid email address."); return; }
    setPaying(true); setPayError("");
    await initiatePayment({
      trip, ...form,
      onSuccess: () => { setPaying(false); setSuccess(true); },
      onFail: (msg) => { setPaying(false); setPayError(msg || "Payment failed. Please try again."); },
    });
  };

  if (success) return (
    <div className="page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 48, textAlign: "center" }}>
      <div style={{ fontSize: 72, animation: "float 3s ease-in-out infinite" }}>🎉</div>
      <h2 style={{ fontFamily: "var(--h)", fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 300 }}>You're In!</h2>
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, maxWidth: 480 }}>
        <p style={{ color: "var(--sub)", lineHeight: 1.8, fontSize: 15 }}>
          Welcome to the family, <strong style={{ color: "var(--text)" }}>{form.name}</strong>! 🙌<br />
          Booking confirmed for <strong style={{ color: "var(--accent)" }}>{trip.name}</strong> on <strong style={{ color: "var(--accent)" }}>{form.date}</strong> for {form.travelers} traveler{form.travelers > 1 ? "s" : ""}.<br /><br />
          Check your email at <strong style={{ color: "var(--text)" }}>{form.email}</strong> for complete trip details.
        </p>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => setNav("destinations")} style={{ background: "var(--accent)", color: "#000", border: "none", padding: "13px 30px", borderRadius: 8, cursor: "pointer", fontSize: 15, fontFamily: "var(--b)" }}>Browse More Trips</button>
        <button onClick={() => setNav("home")} style={{ background: "none", color: "var(--text)", border: "1px solid var(--border)", padding: "13px 30px", borderRadius: 8, cursor: "pointer", fontSize: 15, fontFamily: "var(--b)" }}>Go Home</button>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ minHeight: "100vh", paddingTop: 64 }}>
      {/* Hero banner */}
      <div style={{ height: "52vh", minHeight: 320, background: trip.bg, position: "relative", display: "flex", alignItems: "flex-end", padding: "0 5vw 42px" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,6,4,0.97) 0%, rgba(6,6,4,0.15) 70%)" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <button onClick={() => setNav("destinations")} style={{ background: "none", border: "none", color: "var(--sub)", cursor: "pointer", marginBottom: 14, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>← All Destinations</button>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            {[
              [trip.tag, trip.accent, `1px solid ${trip.accent}55`],
              [trip.difficulty, "rgba(255,255,255,0.6)", "1px solid rgba(255,255,255,0.15)"],
              [trip.duration, "rgba(255,255,255,0.6)", "1px solid rgba(255,255,255,0.15)"],
            ].map(([label, color, border]) => (
              <span key={label} style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", border, color, padding: "5px 14px", borderRadius: 20, fontSize: 12 }}>{label}</span>
            ))}
          </div>
          <h1 style={{ fontFamily: "var(--h)", fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 300, lineHeight: 1.1 }}>{trip.name}</h1>
          <p style={{ color: "var(--sub)", marginTop: 8, fontSize: 15 }}>{trip.tagline}</p>
          <div style={{ marginTop: 10, color: "var(--accent)", fontSize: 13 }}>★ {trip.rating} · {trip.reviews} verified reviews</div>
        </div>
      </div>

      {/* Main layout */}
      <div className="sidebar-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 5vw 80px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 48, alignItems: "start" }}>

        {/* ── LEFT: Details ── */}
        <div>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 36, marginTop: 44, overflowX: "auto" }}>
            {[["overview", "Overview"], ["itinerary", "Itinerary"], ["inclusions", "What's Included"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: tab === id ? "var(--accent)" : "var(--sub)",
                borderBottom: `2px solid ${tab === id ? "var(--accent)" : "transparent"}`,
                padding: "12px 24px", fontSize: 14, fontFamily: "var(--b)",
                transition: "all 0.2s", whiteSpace: "nowrap", marginBottom: -1,
              }}>{label}</button>
            ))}
          </div>

          {/* Overview */}
          {tab === "overview" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginBottom: 36 }}>
                {[
                  ["Duration", trip.duration],
                  ["Difficulty", trip.difficulty],
                  ["Next Batch", trip.dates[0]],
                  ["Group Size", `Max ${trip.totalSlots}`],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: 18 }}>
                    <div style={{ color: "var(--sub)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{val}</div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily: "var(--h)", fontSize: 28, fontWeight: 400, marginBottom: 18 }}>Highlights</h3>
              <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 36 }}>
                {trip.highlights.map(h => (
                  <div key={h} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ color: "var(--accent)", fontSize: 10 }}>✦</span>
                    <span style={{ color: "var(--sub)", fontSize: 14 }}>{h}</span>
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily: "var(--h)", fontSize: 28, fontWeight: 400, marginBottom: 18 }}>Upcoming Dates</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {trip.dates.map(d => (
                  <button key={d} onClick={() => setForm(f => ({ ...f, date: d }))} style={{
                    background: form.date === d ? "var(--accent)" : "var(--card)",
                    color: form.date === d ? "#000" : "var(--text)",
                    border: `1px solid ${form.date === d ? "var(--accent)" : "var(--border)"}`,
                    padding: "11px 22px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontFamily: "var(--b)",
                    transition: "all 0.2s",
                  }}>{d}</button>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary */}
          {tab === "itinerary" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              {trip.itinerary.map((day) => (
                <div key={day.day} style={{ display: "flex", gap: 22, marginBottom: 26, paddingBottom: 26, borderBottom: "1px solid var(--border)" }}>
                  <div style={{
                    minWidth: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: "var(--accent-lo)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--h)", fontSize: 18, color: "var(--accent)",
                  }}>{day.day}</div>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 7, fontSize: 15 }}>Day {day.day}: {day.title}</div>
                    <div style={{ color: "var(--sub)", fontSize: 14, lineHeight: 1.75 }}>{day.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inclusions */}
          {tab === "inclusions" && (
            <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, animation: "fadeIn 0.4s ease" }}>
              <div>
                <h3 style={{ fontFamily: "var(--h)", fontSize: 26, fontWeight: 400, marginBottom: 18, color: "#5BE88A" }}>✓ What's Included</h3>
                {trip.inclusions.map(inc => (
                  <div key={inc} style={{ display: "flex", gap: 10, marginBottom: 13, fontSize: 14, color: "var(--sub)", alignItems: "flex-start" }}>
                    <span style={{ color: "#5BE88A", flexShrink: 0, marginTop: 2 }}>✓</span> {inc}
                  </div>
                ))}
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--h)", fontSize: 26, fontWeight: 400, marginBottom: 18, color: "#E85B5B" }}>✕ Not Included</h3>
                {trip.exclusions.map(exc => (
                  <div key={exc} style={{ display: "flex", gap: 10, marginBottom: 13, fontSize: 14, color: "var(--sub)", alignItems: "flex-start" }}>
                    <span style={{ color: "#E85B5B", flexShrink: 0, marginTop: 2 }}>✕</span> {exc}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Booking Sidebar ── */}
        <div style={{ position: "sticky", top: 80, background: "#fff", border: "1.5px solid var(--border-gray)", borderRadius: 18, padding: 28, marginTop: 44, boxShadow: "var(--shadow-lg)" }}>
          {/* Price */}
          <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
            <div style={{ color: "var(--sub)", fontSize: 13, textDecoration: "line-through", marginBottom: 4 }}>₹{trip.originalPrice.toLocaleString()} / person</div>
            <div style={{ fontFamily: "var(--h)", fontSize: 40, color: "var(--accent)", lineHeight: 1 }}>₹{trip.price.toLocaleString()}</div>
            <div style={{ color: "var(--sub)", fontSize: 13, marginTop: 4 }}>per person · {trip.duration}</div>
          </div>

          {/* Urgency */}
          {trip.spotsLeft <= 5 && (
            <div style={{ background: "rgba(232,91,91,0.1)", border: "1px solid rgba(232,91,91,0.25)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#E85B5B", fontSize: 13 }}>
              🔥 Only {trip.spotsLeft} spots remaining for {form.date}
            </div>
          )}

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { key: "name", label: "Full Name *", placeholder: "Your full name", type: "text" },
              { key: "email", label: "Email *", placeholder: "your@email.com", type: "email" },
              { key: "phone", label: "WhatsApp / Phone *", placeholder: "+91 XXXXX XXXXX", type: "tel" },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: "var(--sub)", display: "block", marginBottom: 6 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, color: "var(--sub)", display: "block", marginBottom: 6 }}>Select Date</label>
              <select value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}>
                {trip.dates.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--sub)", display: "block", marginBottom: 6 }}>Number of Travelers</label>
              <select value={form.travelers} onChange={e => setForm(f => ({ ...f, travelers: +e.target.value }))}>
                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Traveler{n > 1 ? "s" : ""}</option>)}
              </select>
            </div>
          </div>

          {/* Price breakdown */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, margin: "16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "var(--sub)" }}>
              <span>₹{trip.price.toLocaleString()} × {form.travelers}</span>
              <span>₹{(trip.price * form.travelers).toLocaleString()}</span>
            </div>
            {savings > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "#5BE88A" }}>
                <span>🎁 You save</span>
                <span>-₹{savings.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: 17, borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4 }}>
              <span>Total</span>
              <span style={{ color: "var(--accent)" }}>₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Error */}
          {payError && (
            <div style={{ color: "#E85B5B", fontSize: 13, marginBottom: 12, padding: "10px 14px", background: "rgba(232,91,91,0.08)", borderRadius: 8, border: "1px solid rgba(232,91,91,0.2)" }}>
              ⚠️ {payError}
            </div>
          )}

          {/* Pay button */}
          <button onClick={handlePay} disabled={paying} style={{
            width: "100%", padding: "16px",
            background: paying ? "var(--surface)" : "var(--accent)",
            color: paying ? "var(--sub)" : "#fff",
            border: "none", borderRadius: 10, cursor: paying ? "not-allowed" : "pointer",
            fontSize: 16, fontWeight: 500, fontFamily: "var(--b)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "all 0.2s",
          }}>
            {paying ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid var(--sub)", borderTopColor: "var(--accent)", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                Processing...
              </>
            ) : `Pay ₹${total.toLocaleString()} →`}
          </button>

          <p style={{ textAlign: "center", color: "var(--sub)", fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
            🔒 100% secure via Razorpay · UPI, Cards, NetBanking accepted
          </p>

          {/* EMI note */}
          <div style={{ marginTop: 12, textAlign: "center", color: "var(--sub)", fontSize: 12 }}>
            💳 EMI available on orders above ₹5,000
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", trip: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    // TODO: Send to your backend / email service / CRM
    setSent(true);
  };

  return (
    <div className="page" style={{ minHeight: "100vh", paddingTop: 100, padding: "100px 5vw 88px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ color: "var(--accent)", fontSize: 11, letterSpacing: "0.18em", marginBottom: 14, textTransform: "uppercase" }}>Get In Touch</div>
        <h1 style={{ fontFamily: "var(--h)", fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 700, marginBottom: 60, lineHeight: 1 }}>
          Apna Safar<br /><span style={{ color: "var(--accent)", fontWeight: 700 }}>शुरू</span> <span style={{ color: "var(--accent2)" }}>करें</span>
        </h1>

        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
          {/* Form */}
          <div>
            {sent ? (
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 18, animation: "float 2s ease-in-out infinite" }}>✉️</div>
                <h3 style={{ fontFamily: "var(--h)", fontSize: 32, fontWeight: 300, marginBottom: 12 }}>Message Sent!</h3>
                <p style={{ color: "var(--sub)", lineHeight: 1.75 }}>Thanks {form.name}! We'll get back to you within a few hours.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { key: "name", label: "Your Name *", placeholder: "Full name", type: "text" },
                  { key: "email", label: "Email *", placeholder: "your@email.com", type: "email" },
                  { key: "phone", label: "Phone / WhatsApp", placeholder: "+91 XXXXX XXXXX", type: "tel" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, color: "var(--sub)", display: "block", marginBottom: 6 }}>{label}</label>
                    <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, color: "var(--sub)", display: "block", marginBottom: 6 }}>Interested In</label>
                  <select value={form.trip} onChange={e => setForm(f => ({ ...f, trip: e.target.value }))}>
                    <option value="">Select a trip</option>
                    {TRIPS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    <option value="custom">Custom / Group Booking</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--sub)", display: "block", marginBottom: 6 }}>Message</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Any questions, custom requirements, or group bookings..." rows={4} />
                </div>
                <button onClick={handleSubmit} style={{
                  background: "var(--accent)", color: "#fff", border: "none",
                  padding: "14px", borderRadius: 8, cursor: "pointer",
                  fontSize: 15, fontWeight: 600, fontFamily: "var(--b)",
                  transition: "opacity 0.2s",
                }} onMouseEnter={e => e.target.style.opacity = 0.88} onMouseLeave={e => e.target.style.opacity = 1}>
                  Send Message →
                </button>
              </div>
            )}
          </div>

          {/* Contact info */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 32 }}>
              {[
                { icon: "📍", label: "Address", value: "Bighar Road, Fatehabad, Haryana" },
                { icon: "📧", label: "Email", value: "info.apnasafar@gmail.com" },
                { icon: "📞", label: "Phone", value: "+91 82951 03548" },
                { icon: "⏰", label: "Working Hours", value: "Mon–Sat, 10AM – 7PM IST" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 22, lineHeight: 1 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--sub)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
                    <div style={{ fontSize: 15 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <div style={{ fontFamily: "var(--h)", fontSize: 22, marginBottom: 10, color: "var(--accent)" }}>💬 Chat on WhatsApp</div>
              <p style={{ color: "var(--sub)", fontSize: 14, lineHeight: 1.75, marginBottom: 18 }}>
                Fastest way to get answers. Average reply time: 15 minutes.
              </p>
              <button style={{
                background: "#25D366", color: "#fff", border: "none",
                padding: "11px 24px", borderRadius: 7, cursor: "pointer", fontSize: 14, fontWeight: 500,
              }}>Open WhatsApp →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [nav, setNav] = useState("home");
  const isTrip = nav.startsWith("trip-");
  const tripId = isTrip ? nav.replace("trip-", "") : null;
  const page = isTrip ? "trip" : nav;

  const renderPage = () => {
    switch (page) {
      case "home":         return <HomePage setNav={setNav} />;
      case "destinations": return <DestinationsPage setNav={setNav} />;
      case "trip":         return <TripDetailPage tripId={tripId} setNav={setNav} />;
      case "contact":      return <ContactPage />;
      default:             return <HomePage setNav={setNav} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Nav page={page} setNav={setNav} />
      <main>{renderPage()}</main>
      <Footer setNav={setNav} />
    </div>
  );
}
