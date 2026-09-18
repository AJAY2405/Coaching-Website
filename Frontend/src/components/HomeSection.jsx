// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Users,
//   FileText,
//   FileBadge,
//   Megaphone,
//   ClipboardList,
// } from "lucide-react";
// import Contact from "./Contact";
// import {
//   TEST_API_END_POINT,
//   NOTES_API_END_POINT,
//   NOTICE_API_END_POINT,
//   USER_API_END_POINT,
// } from "../utils/constants";
// import Analysis from "./Student/Analysis";
 
// /* ================= DATA ================= */
 
// const achievers = [
//   {
//     id: 1,
//     name: "XYZ Singh",
//     achievement: "10th Topper 2024",
//     qualification: "96%",
//     image: "/Images/student1.jpg",
//   },
//   {
//     id: 2,
//     name: "XYZ Sahani",
//     achievement: "12th Selection",
//     qualification: "92%",
//     image: "/Images/student2.jpg",
//   },
// ];
 
// /* ================= HELPERS ================= */
 
// // Handles responses shaped as: [] , { data: [] }, { students: [] },
// // { tests: [] }, { notes: [] }, { notices: [] }, { count: N } etc.
// function extractList(payload) {
//   if (!payload) return [];
//   if (Array.isArray(payload)) return payload;
//   const possibleKeys = [
//     "data",
//     "students",
//     "users",
//     "tests",
//     "notes",
//     "notices",
//     "results",
//     "items",
//   ];
//   for (const key of possibleKeys) {
//     if (Array.isArray(payload[key])) return payload[key];
//   }
//   return [];
// }
 
// function extractCount(payload, list) {
//   if (payload && typeof payload.count === "number") return payload.count;
//   if (payload && typeof payload.total === "number") return payload.total;
//   return list.length;
// }
 
// function getTimestamp(item) {
//   const raw = item.createdAt || item.date || item.updatedAt || null;
//   const t = raw ? new Date(raw).getTime() : 0;
//   return Number.isNaN(t) ? 0 : t;
// }
 
// /* ================= SLIDER ================= */
 
// function Slider({ data, type }) {
//   const [index, setIndex] = useState(0);
 
//   const nextCard = () => {
//     setIndex((prev) => (prev + 1) % data.length);
//   };
 
//   const prevCard = () => {
//     setIndex((prev) => (prev - 1 + data.length) % data.length);
//   };
 
//   const current = data[index];
 
//   return (
//     <section className="py-5">
//       <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">
//         Our Achievers
//       </h2>
 
//       <div className="flex items-center justify-center gap-8">
//         {/* Previous */}
//         <button onClick={prevCard}>
//           <ChevronLeft
//             size={25}
//             strokeWidth={2.5}
//             className="text-orange-500 hover:text-orange-600 transition cursor-pointer"
//           />
//         </button>
 
//         {/* Card */}
//         <div className="w-[300px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-6 text-center">
//           <img
//             src={current.image}
//             alt={current.name}
//             className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 mx-auto"
//           />
 
//           <h3 className="mt-4 text-xl font-semibold text-black dark:text-white">
//             {current.name}
//           </h3>
 
//           <p className="mt-2 text-orange-500 font-medium">
//             {current.achievement}
//           </p>
 
//           <p className="mt-2 text-gray-600 dark:text-gray-400">
//             {current.qualification}
//           </p>
//         </div>
 
//         {/* Next */}
//         <button onClick={nextCard}>
//           <ChevronRight
//             size={25}
//             strokeWidth={2.5}
//             className="text-orange-500 hover:text-orange-600 transition cursor-pointer"
//           />
//         </button>
//       </div>
//     </section>
//   );
// }
 
// /* ================= STATS SECTION (live data from MongoDB via API) ================= */
 
// function StatCard({ icon: Icon, label, value, loading }) {
//   return (
//     <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-6 text-center flex flex-col items-center">
//       <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-4">
//         <Icon size={26} className="text-orange-500" />
//       </div>
//       {loading ? (
//         <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
//       ) : (
//         <h3 className="text-3xl font-extrabold text-black dark:text-white mb-1">{value}</h3>
//       )}
//       <p className="text-gray-600 dark:text-gray-400 font-medium">{label}</p>
//     </div>
//   );
// }
 
// function StatsSection() {
//   const [totalStudents, setTotalStudents] = useState(0);
//   const [totalTests, setTotalTests] = useState(0);
//   const [totalPdfs, setTotalPdfs] = useState(0);
//   // latestUpdate = whichever is newest between a notice and a test
//   const [latestUpdate, setLatestUpdate] = useState(null); // { type: "notice" | "test", title, message, date }
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
 
//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
 
//     Promise.allSettled([
//       axios.get(USER_API_END_POINT, { withCredentials: true }),
//       axios.get(TEST_API_END_POINT, { withCredentials: true }),
//       axios.get(NOTES_API_END_POINT, { withCredentials: true }),
//       axios.get(NOTICE_API_END_POINT, { withCredentials: true }),
//     ]).then(([usersRes, testsRes, notesRes, noticesRes]) => {
//       if (cancelled) return;
 
//       const failedRequests = [];
//       let testList = [];
//       let noticeList = [];
 
//       // Students = total users on the website
//       if (usersRes.status === "fulfilled") {
//         const list = extractList(usersRes.value.data);
//         // If your user list mixes roles (student/teacher/admin), filter here:
//         // const studentsOnly = list.filter((u) => !u.role || u.role.toLowerCase() === "student");
//         setTotalStudents(extractCount(usersRes.value.data, list));
//       } else {
//         failedRequests.push("students");
//       }
 
//       // Tests
//       if (testsRes.status === "fulfilled") {
//         testList = extractList(testsRes.value.data);
//         setTotalTests(extractCount(testsRes.value.data, testList));
//       } else {
//         failedRequests.push("tests");
//       }
 
//       // PDFs / Notes
//       if (notesRes.status === "fulfilled") {
//         const list = extractList(notesRes.value.data);
//         setTotalPdfs(extractCount(notesRes.value.data, list));
//       } else {
//         failedRequests.push("pdfs");
//       }
 
//       // Notices
//       if (noticesRes.status === "fulfilled") {
//         noticeList = extractList(noticesRes.value.data);
//       } else {
//         failedRequests.push("notices");
//       }
 
//       // ---- Combine notices + tests, pick the most recent one ----
//       const combined = [
//         ...noticeList.map((n) => ({
//           type: "notice",
//           title: n.title,
//           message: n.message || n.description || "",
//           date: getTimestamp(n),
//         })),
//         ...testList.map((t) => ({
//           type: "test",
//           title: t.title || t.name || "New Test",
//           message: t.description || "A new test has been added.",
//           date: getTimestamp(t),
//         })),
//       ];
 
//       combined.sort((a, b) => b.date - a.date);
//       setLatestUpdate(combined[0] || null);
 
//       setErr(
//         failedRequests.length > 0
//           ? `Couldn't load: ${failedRequests.join(", ")}`
//           : ""
//       );
//       setLoading(false);
//     });
 
//     return () => {
//       cancelled = true;
//     };
//   }, []);
 
//   const isTest = latestUpdate?.type === "test";
 
//   return (
//     <section className="py-5">
//       <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">
//         Our Numbers
//       </h2>
 
//       {err && (
//         <p className="text-center text-red-600 dark:text-red-400 mb-6 text-sm">{err}</p>
//       )}
 
//       {/* 2 cards per row grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
//         <StatCard
//           icon={Users}
//           label="Users"
//           value={totalStudents}
//           loading={loading}
//         />
//         <StatCard
//           icon={FileText}
//           label="Active Tests"
//           value={totalTests}
//           loading={loading}
//         />
//         <StatCard
//           icon={FileBadge}
//           label="PDF Notes"
//           value={totalPdfs}
//           loading={loading}
//         />
 
//         {/* Latest Update card — same grid, same size as the stat cards */}
//         <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-6 text-left flex flex-col justify-center">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="w-12 h-12 shrink-0 rounded-full bg-orange-500 flex items-center justify-center">
//               {isTest ? (
//                 <ClipboardList size={20} className="text-white" />
//               ) : (
//                 <Megaphone size={20} className="text-white" />
//               )}
//             </div>
//             <div>
//               <h4 className="font-semibold text-black dark:text-white text-sm">
//                 {isTest ? "New Test" : "Latest Notice"}
//               </h4>
//               {latestUpdate && (
//                 <span className="text-[10px] uppercase tracking-wide bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
//                   {latestUpdate.type}
//                 </span>
//               )}
//             </div>
//           </div>
 
//           {loading ? (
//             <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
//           ) : latestUpdate ? (
//             <>
//               <p className="text-orange-600 dark:text-orange-400 font-medium text-sm">
//                 {latestUpdate.title}
//               </p>
//               <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
//                 {latestUpdate.message}
//               </p>
//             </>
//           ) : (
//             <p className="text-gray-500 dark:text-gray-400 text-sm">No updates yet.</p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
 
// /* ================= HOME ================= */
 
// function HomeSection() {
//   const navigate = useNavigate();
 
//   return (
//     <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-15 space-y-16 transition-colors duration-300">
//       {/* Hero */}
//       <section className="text-center">
//         <img src="/Images/logo.png" alt="Logo" className="w-36 mx-auto" />
 
//         <p className="max-w-3xl mx-auto mt-4 text-gray-700 dark:text-gray-300">
//           We prepare students for CHS, UP Board, CBSE, Bihar Board, and JNV
//           with expert faculty and modern teaching methods.
//         </p>
//       </section>
 
//       {/* Announcement */}
//       <section className="flex justify-center">
//         <button
//           onClick={() => navigate("/announcement")}
//           className="px-6 py-3 rounded-full bg-orange-500 text-white hover:bg-orange-600"
//         >
//           Announcements
//         </button>
//       </section>
 
//       {/* Live stats: students / tests / pdfs / newest notice-or-test */}
//       <StatsSection />
//       <Analysis/>
 
//       {/* Achievers — last section */}
//       <Slider data={achievers} type="achiever" />
 
//       {/* Contact */}
//       {/* <Contact /> */}
//     </div>
//   );
// }
 
// export default HomeSection;





import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  FileBadge,
  Megaphone,
  ClipboardList,
} from "lucide-react";
import Contact from "./Contact";
import {
  TEST_API_END_POINT,
  NOTES_API_END_POINT,
  NOTICE_API_END_POINT,
  USER_API_END_POINT,
} from "../utils/constants";
import Analysis from "./Student/Analysis";
import students from "./Achieversdata";

/* ================= HELPERS ================= */

// Handles responses shaped as: [] , { data: [] }, { students: [] },
// { tests: [] }, { notes: [] }, { notices: [] }, { count: N } etc.
function extractList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  const possibleKeys = [
    "data",
    "students",
    "users",
    "tests",
    "notes",
    "notices",
    "results",
    "items",
  ];
  for (const key of possibleKeys) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

function extractCount(payload, list) {
  if (payload && typeof payload.count === "number") return payload.count;
  if (payload && typeof payload.total === "number") return payload.total;
  return list.length;
}

function getTimestamp(item) {
  const raw = item.createdAt || item.date || item.updatedAt || null;
  const t = raw ? new Date(raw).getTime() : 0;
  return Number.isNaN(t) ? 0 : t;
}

/* ================= CIRCULAR ACHIEVERS SLIDER ================= */

function Slider({ data }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = data.length;

  const nextCard = () => setIndex((prev) => (prev + 1) % total);
  const prevCard = () => setIndex((prev) => (prev - 1 + total) % total);

  // Auto-advance in a circular loop; pauses while the user is hovering
  // (desktop) or has pressed on the card (touch), and resumes after.
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(nextCard, 2600);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  // Wrap any offset back into a valid index — this is what makes the
  // carousel "circular": going past the last card loops to the first.
  const wrap = (i) => ((i % total) + total) % total;

  // Cards visible around the center one: [-2, -1, 0, 1, 2]
  const offsets = [-2, -1, 0, 1, 2];

  const openDetail = (student) => {
    navigate(`/achievers/${student.id}`, { state: { student } });
  };

  return (
    <section className="py-5">
      <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">
        Our Achievers
      </h2>

      <div
        className="flex items-center justify-center gap-3 sm:gap-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Previous */}
        <button onClick={prevCard} aria-label="Previous achiever">
          <ChevronLeft
            size={25}
            strokeWidth={2.5}
            className="text-orange-500 hover:text-orange-600 transition cursor-pointer"
          />
        </button>

        {/* Circular card stage */}
        <div className="relative h-[280px] w-full max-w-[900px] overflow-hidden">
          {offsets.map((offset) => {
            const cardIndex = wrap(index + offset);
            const card = data[cardIndex];
            const abs = Math.abs(offset);

            const scale = 1 - abs * 0.18;
            const opacity = abs === 2 ? 0.35 : abs === 1 ? 0.7 : 1;
            const zIndex = 10 - abs;

            // Distance scales with viewport so it works on both small and
            // large screens without a resize listener.
            const translateX = `calc(${offset} * clamp(70px, 18vw, 170px))`;

            return (
              <div
                key={card.id}
                className={`absolute left-1/2 top-1/2 w-[220px] sm:w-[260px] ${
                  abs === 2 ? "hidden sm:block" : ""
                }`}
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: "transform 0.6s ease, opacity 0.6s ease",
                }}
              >
                <button
                  type="button"
                  onClick={() => (offset === 0 ? openDetail(card) : setIndex(cardIndex))}
                  className={`w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg border p-6 text-center cursor-pointer hover:shadow-xl transition-shadow ${
                    offset === 0
                      ? "border-orange-400 dark:border-orange-500/40 shadow-orange-100"
                      : "border-orange-100 dark:border-orange-500/20"
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 mx-auto bg-orange-50"
                  />

                  <h3 className="mt-4 text-xl font-semibold text-black dark:text-white truncate">
                    {card.name}
                  </h3>

                  <p className="mt-2 text-orange-500 font-medium">
                    {card.achievement}
                  </p>

                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {card.mark}
                  </p>

                  {offset === 0 && (
                    <p className="mt-3 text-xs font-medium text-orange-400">
                      Tap to view full profile
                    </p>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Next */}
        <button onClick={nextCard} aria-label="Next achiever">
          <ChevronRight
            size={25}
            strokeWidth={2.5}
            className="text-orange-500 hover:text-orange-600 transition cursor-pointer"
          />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-6">
        {data.map((card, i) => (
          <button
            key={card.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to ${card.name}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index
                ? "w-5 bg-orange-500"
                : "w-1.5 bg-orange-200 dark:bg-orange-500/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/* ================= STATS SECTION (live data from MongoDB via API) ================= */

function StatCard({ icon: Icon, label, value, loading }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-6 text-center flex flex-col items-center">
      <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-4">
        <Icon size={26} className="text-orange-500" />
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
      ) : (
        <h3 className="text-3xl font-extrabold text-black dark:text-white mb-1">{value}</h3>
      )}
      <p className="text-gray-600 dark:text-gray-400 font-medium">{label}</p>
    </div>
  );
}

function StatsSection() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTests, setTotalTests] = useState(0);
  const [totalPdfs, setTotalPdfs] = useState(0);
  // latestUpdate = whichever is newest between a notice and a test
  const [latestUpdate, setLatestUpdate] = useState(null); // { type: "notice" | "test", title, message, date }
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.allSettled([
      axios.get(USER_API_END_POINT, { withCredentials: true }),
      axios.get(TEST_API_END_POINT, { withCredentials: true }),
      axios.get(NOTES_API_END_POINT, { withCredentials: true }),
      axios.get(NOTICE_API_END_POINT, { withCredentials: true }),
    ]).then(([usersRes, testsRes, notesRes, noticesRes]) => {
      if (cancelled) return;

      const failedRequests = [];
      let testList = [];
      let noticeList = [];

      // Students = total users on the website
      if (usersRes.status === "fulfilled") {
        const list = extractList(usersRes.value.data);
        // If your user list mixes roles (student/teacher/admin), filter here:
        // const studentsOnly = list.filter((u) => !u.role || u.role.toLowerCase() === "student");
        setTotalStudents(extractCount(usersRes.value.data, list));
      } else {
        failedRequests.push("students");
      }

      // Tests
      if (testsRes.status === "fulfilled") {
        testList = extractList(testsRes.value.data);
        setTotalTests(extractCount(testsRes.value.data, testList));
      } else {
        failedRequests.push("tests");
      }

      // PDFs / Notes
      if (notesRes.status === "fulfilled") {
        const list = extractList(notesRes.value.data);
        setTotalPdfs(extractCount(notesRes.value.data, list));
      } else {
        failedRequests.push("pdfs");
      }

      // Notices
      if (noticesRes.status === "fulfilled") {
        noticeList = extractList(noticesRes.value.data);
      } else {
        failedRequests.push("notices");
      }

      // ---- Combine notices + tests, pick the most recent one ----
      const combined = [
        ...noticeList.map((n) => ({
          type: "notice",
          title: n.title,
          message: n.message || n.description || "",
          date: getTimestamp(n),
        })),
        ...testList.map((t) => ({
          type: "test",
          title: t.title || t.name || "New Test",
          message: t.description || "A new test has been added.",
          date: getTimestamp(t),
        })),
      ];

      combined.sort((a, b) => b.date - a.date);
      setLatestUpdate(combined[0] || null);

      setErr(
        failedRequests.length > 0
          ? `Couldn't load: ${failedRequests.join(", ")}`
          : ""
      );
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const isTest = latestUpdate?.type === "test";

  return (
    <section className="py-5">
      <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">
        Our Numbers
      </h2>

      {err && (
        <p className="text-center text-red-600 dark:text-red-400 mb-6 text-sm">{err}</p>
      )}

      {/* 2 cards per row grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <StatCard
          icon={Users}
          label="Users"
          value={totalStudents}
          loading={loading}
        />
        <StatCard
          icon={FileText}
          label="Active Tests"
          value={totalTests}
          loading={loading}
        />
        <StatCard
          icon={FileBadge}
          label="PDF Notes"
          value={totalPdfs}
          loading={loading}
        />

        {/* Latest Update card — same grid, same size as the stat cards */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-6 text-left flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 shrink-0 rounded-full bg-orange-500 flex items-center justify-center">
              {isTest ? (
                <ClipboardList size={20} className="text-white" />
              ) : (
                <Megaphone size={20} className="text-white" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-black dark:text-white text-sm">
                {isTest ? "New Test" : "Latest Notice"}
              </h4>
              {latestUpdate && (
                <span className="text-[10px] uppercase tracking-wide bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
                  {latestUpdate.type}
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : latestUpdate ? (
            <>
              <p className="text-orange-600 dark:text-orange-400 font-medium text-sm">
                {latestUpdate.title}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
                {latestUpdate.message}
              </p>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No updates yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ================= HOME ================= */

function HomeSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-15 space-y-16 transition-colors duration-300">
      {/* Hero */}
      <section className="text-center">
        <img src="/Images/logo.png" alt="Logo" className="w-36 mx-auto" />

        <p className="max-w-3xl mx-auto mt-4 text-gray-700 dark:text-gray-300">
          We prepare students for CHS, UP Board, CBSE, Bihar Board, and JNV
          with expert faculty and modern teaching methods.
        </p>
      </section>

      {/* Announcement */}
      <section className="flex justify-center">
        <button
          onClick={() => navigate("/announcement")}
          className="px-6 py-3 rounded-full bg-orange-500 text-white hover:bg-orange-600"
        >
          Announcements
        </button>
      </section>

      {/* Live stats: students / tests / pdfs / newest notice-or-test */}
      <StatsSection />
      <Analysis/>

      {/* Achievers — cards built straight from the students data file */}
      <Slider data={students} />

      {/* Contact */}
      {/* <Contact /> */}
    </div>
  );
}

export default HomeSection;