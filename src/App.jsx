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
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
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
