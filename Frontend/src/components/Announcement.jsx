import React, { useState } from "react";
import { useTheme } from "./theme-provider";

const data = [
  {
    id: 1,
    title: "Admission Open 2026-27",
    category: "Admission",
    date: "1 April 2026",
    image:
      "https://res.cloudinary.com/dfxr85udp/image/upload/v1775198065/Gemini_Generated_Image_m0762dm0762dm076_tulosf.png",
    highlight: true,
    desc: "Admissions are now open for the academic session 2026-27.",
    details: `We are delighted to announce that admissions for the academic session 2026–27 are now officially open at Mangaldeep Academy. This is an opportunity for parents and students to become part of an institution committed to nurturing academic excellence, character development, and holistic growth.

Our admission process is designed to be simple, transparent, and student-friendly. We welcome applications for students preparing for CHS, UP Board, CBSE, and Bihar Board curricula, as well as students aspiring for JNV selection. Seats are limited across all classes, and admissions will be granted on a first-come, first-served basis, subject to an interaction with the student and a review of academic records.

Why Choose Us:
Our experienced faculty, personalized mentoring approach, and modern teaching methodologies ensure every child receives the attention they deserve. We focus heavily on conceptual clarity rather than rote learning, helping students build a strong foundation that serves them well beyond the classroom.

Documents Required:
Parents are requested to carry the student's previous mark sheet, transfer certificate (if applicable), Aadhaar card, and two passport-size photographs at the time of admission. Our administrative staff will guide you through the entire enrollment process.

Fee Structure & Scholarships:
We offer a competitive and affordable fee structure, along with merit-based scholarships for deserving students. Detailed fee information will be shared during the admission counseling session.

Important Dates:
Admission forms will be accepted starting 1st April 2026. Early applicants will be given preference during the seat allotment process. We encourage all interested families to apply at the earliest to secure their child's place for the upcoming academic year.

For any queries regarding the admission process, curriculum, or fee structure, please feel free to reach out to our academy office directly or through the contact details available on our website.`,
    applyLink: "https://forms.gle/YOUR_ADMISSION_FORM_ID",
    applyLabel: "Apply for Admission",
  },
  {
    id: 2,
    title: "Independence Day Celebration",
    category: "Event",
    date: "15 August 2026",
    image:
      "https://res.cloudinary.com/dfxr85udp/image/upload/v1786017741/Gemini_Generated_Image_bqa89vbqa89vbqa8_sa1cxe.png",
    desc: "Join us in celebrating 15th August with patriotic fervor and pride.",
    details: `Mangaldeep Academy is proud to announce its Independence Day Celebration, scheduled for 15th August 2026. This special day holds immense significance in our national history, and our academy takes this opportunity every year to instill values of patriotism, unity, and respect for our nation's freedom fighters among our students.

Programme Highlights:
The day will begin with the hoisting of the national flag by our esteemed Director, followed by the national anthem sung collectively by students and staff. This will be followed by a series of cultural performances including patriotic songs, dance performances, skits depicting the freedom struggle, and speeches by selected students on the significance of independence.

Special segments will include a tribute to freedom fighters, a flag-making activity for junior students, and an inter-house competition on patriotic-themed poster making and essay writing. Prizes will be distributed to the winners of various competitions held in the lead-up to the event.

Dress Code:
All students are requested to come dressed in white, or tricolor-themed attire, to reflect the spirit of the occasion. Students participating in cultural performances should coordinate with their respective class teachers regarding costumes and rehearsal schedules.

Parent Participation:
Parents and guardians are cordially invited to attend the celebration and witness their children's participation in this meaningful event. Seating arrangements will be made in the academy's main hall, and refreshments will be provided after the programme concludes.

Purpose of the Celebration:
Beyond the festivities, this celebration serves as a reminder of the sacrifices made by countless freedom fighters and the importance of nurturing responsible, patriotic citizens for the future of our nation. We look forward to a memorable and inspiring celebration this year.

For students interested in participating in performances or competitions, please register through the link below at the earliest, as slots are limited.`,
    applyLink: "https://forms.gle/YOUR_INDEPENDENCE_DAY_FORM_ID",
    applyLabel: "Register to Participate",
  },
  {
    id: 3,
    title: "Annual Sports Day",
    category: "Sports",
    date: "10 December 2026",
    image:
      "https://res.cloudinary.com/dfxr85udp/image/upload/v1786018457/ChatGPT_Image_Aug_6_2026_05_44_02_PM_exy9k9.png",
    desc: "A day full of athletic spirit, competition, and team energy.",
    details: `Get ready for an action-packed day of athleticism, teamwork, and sportsmanship at Mangaldeep Academy's Annual Sports Day, scheduled for 10th December 2026. This much-anticipated event is a cornerstone of our academic calendar, giving students an opportunity to showcase their physical abilities and competitive spirit outside the classroom.

Events Planned:
The day will feature a wide range of track and field events including 100m, 200m, and relay races, long jump, shot put, and tug of war. Additionally, fun events for junior students such as sack races, spoon races, and three-legged races will be organized to ensure participation and enjoyment for students of all age groups.

House System:
Students will compete under their respective houses, fostering a sense of teamwork and healthy competition. Points earned throughout the day will be tallied to determine the winning house, which will be awarded the Sports Day Trophy at the closing ceremony.

Training & Practice Schedule:
Physical education teachers will conduct practice sessions in the weeks leading up to the event to help students prepare for their respective events. Students are encouraged to attend these sessions to build both fitness and technique.

March Past & Opening Ceremony:
The event will commence with a march past by all participating students, followed by the lighting of the torch and the formal declaration of the Sports Day by the Chief Guest. This will be followed by a series of exciting competitions throughout the day.

Prize Distribution:
Medals and certificates will be awarded to the top three performers in each event category, along with a special trophy for the overall champion house. We believe that sports play a crucial role in a child's overall development, teaching discipline, resilience, and the value of teamwork.

Parents are warmly invited to cheer for their children and enjoy a day filled with energy and excitement. Refreshment stalls will be available throughout the venue.

Students wishing to participate in specific events should confirm their entries with their class teachers or register through the link provided below.`,
    applyLink: "https://forms.gle/YOUR_SPORTS_DAY_FORM_ID",
    applyLabel: "Register for Sports Day",
  },
  {
    id: 4,
    title: "Teacher's Day Celebration",
    category: "Event",
    date: "5 September 2026",
    image:
      "https://res.cloudinary.com/dfxr85udp/image/upload/v1786018153/ChatGPT_Image_Aug_6_2026_05_38_54_PM_h0tj6p.png",
    desc: "Honoring our dedicated teachers who shape young minds every day.",
    details: `Every year on 5th September, Mangaldeep Academy comes together to celebrate Teacher's Day, honoring the tireless dedication, patience, and passion of our teaching staff who play an instrumental role in shaping the future of our students.

Significance of the Day:
Teacher's Day is celebrated in India in honor of Dr. Sarvepalli Radhakrishnan, a great scholar and the second President of India, whose birthday falls on this date. It is a day to express gratitude to our educators for their invaluable contribution to society through the noble profession of teaching.

Programme Highlights:
The celebration will include heartfelt speeches by student representatives, cultural performances dedicated to teachers, and a special segment where senior students take on the role of teachers for a day, conducting classes for junior students under the guidance of the actual faculty. This activity helps students appreciate the effort and skill involved in teaching.

Additionally, students will present handmade cards, flowers, and small tokens of appreciation to their teachers. A few selected students will also share personal anecdotes about how a particular teacher has positively influenced their academic journey.

Felicitation Ceremony:
The event will conclude with a formal felicitation ceremony where our Director and senior management will honor teachers for their outstanding contributions throughout the year. Awards will be given in categories such as Best Mentor, Most Innovative Teacher, and Long Service Recognition.

Student Involvement:
Class representatives are encouraged to coordinate with their peers to plan class-wise celebrations, including decorations and small surprise activities for their respective class teachers. This fosters a sense of community and appreciation within the academy.

We believe that teachers are the backbone of any educational institution, and this celebration is our way of expressing heartfelt gratitude for their unwavering commitment to nurturing young minds.

Students interested in performing or contributing to the celebration programme can register their participation using the link below.`,
    applyLink: "https://forms.gle/YOUR_TEACHERS_DAY_FORM_ID",
    applyLabel: "Register to Participate",
  },
  {
    id: 5,
    title: "Republic Day Celebration",
    category: "Event",
    date: "26 January 2027",
    image:
      "https://res.cloudinary.com/dfxr85udp/image/upload/v1786018252/Gemini_Generated_Image_8dicfb8dicfb8dic_wthdqa.png",
    desc: "Celebrating the spirit of our Constitution with pride and patriotism.",
    details: `Mangaldeep Academy invites all students, parents, and staff to join us in celebrating Republic Day on 26th January 2027, a date of profound national importance marking the day India's Constitution came into effect.

Programme Overview:
The celebration will begin with the flag hoisting ceremony, followed by the national anthem. This will be followed by a march past performed by our students, showcasing discipline and coordination cultivated through regular drill practice sessions conducted in the preceding weeks.

Cultural performances will follow, including patriotic dance and music performances, a tableau presentation depicting India's rich cultural diversity, and speeches delivered by students on the significance of the Constitution and the values of democracy, liberty, equality, and justice it upholds.

Special Segments:
This year, we are introducing a special quiz competition on Indian history and the Constitution for senior students, along with an art competition themed "Unity in Diversity" for junior students. Winners will be felicitated during the celebration.

Guest of Honour:
We are honored to have a distinguished guest from the local administration join us as the Chief Guest for this year's celebration, who will address the students on the importance of civic responsibility and nation-building.

Community Involvement:
Parents are cordially invited to witness this patriotic celebration and join us in commemorating this significant day in our nation's history. Light refreshments will be served following the programme.

Educational Objective:
Beyond the celebrations, our goal is to help students understand and appreciate the democratic values enshrined in our Constitution, encouraging them to grow into responsible and informed citizens who contribute positively to society.

Students interested in participating in the march past, cultural performances, or competitions should register through the link below at the earliest.`,
    applyLink: "https://forms.gle/YOUR_REPUBLIC_DAY_FORM_ID",
    applyLabel: "Register to Participate",
  },
  {
    id: 6,
    title: "School Annual Function",
    category: "Event",
    date: "20 February 2027",
    image:
      "https://res.cloudinary.com/dfxr85udp/image/upload/v1775580607/Gemini_Generated_Image_yoyduwyoyduwyoyd_k4jy2w.png",
    desc: "Our grand cultural extravaganza showcasing student talent.",
    details: `The Annual Function of Mangaldeep Academy is one of the most awaited events of the academic year, bringing together students, parents, teachers, and the wider community to celebrate the achievements and talents of our students through a vibrant cultural showcase.

Event Overview:
This year's Annual Function will be held on 20th February 2027 and will feature an evening filled with dance performances, musical acts, dramatic skits, fashion shows, and much more. Students from every class will have the opportunity to participate and showcase their creative talents on stage.

Theme:
This year's theme centers around "Unity in Diversity," celebrating the rich cultural heritage of India through performances representing various states and traditions. Students will present a spectacular fusion of classical, folk, and contemporary dance and music forms.

Academic Recognition:
In addition to cultural performances, the evening will include the felicitation of academic toppers, sports achievers, and students who have excelled in extracurricular activities throughout the year. Certificates and trophies will be awarded to recognize outstanding achievements.

Rehearsal Schedule:
Students participating in performances are required to attend rehearsals scheduled after school hours over the coming weeks. Class teachers and activity coordinators will share detailed schedules with participating students.

Ticketing & Seating:
Given the scale of the event, seating will be arranged on a first-come, first-served basis for parents and guests. We encourage families to arrive early to secure comfortable seating for the evening's programme.

Community Celebration:
The Annual Function is not just a showcase of talent but a celebration of the collective effort and growth of our entire school community over the academic year. It reflects the values of creativity, confidence, and collaboration that we strive to instill in every student.

We look forward to an unforgettable evening of celebration, and we invite all interested students to register their participation using the link below.`,
    applyLink: "https://forms.gle/YOUR_ANNUAL_FUNCTION_FORM_ID",
    applyLabel: "Register to Perform",
  },
  {
    id: 7,
    title: "Mid-Term Examinations",
    category: "Exam",
    date: "15 April 2026",
    image:
      "https://res.cloudinary.com/dfxr85udp/image/upload/v1775581326/Gemini_Generated_Image_3lb4px3lb4px3lb4_kpdh1r.png",
    desc: "Mid-term exams will begin from 15 April 2026.",
    details: `Mangaldeep Academy would like to inform all students and parents that the Mid-Term Examinations for the academic session 2026–27 will commence on 15th April 2026. These examinations are a crucial checkpoint in assessing student progress and understanding across the subjects covered so far in the academic year.

Examination Schedule:
The detailed subject-wise timetable will be shared with students at least two weeks prior to the commencement of examinations. Exams will be conducted in the morning session, with each paper allotted a duration of two to three hours depending on the subject and class level.

Syllabus Coverage:
The mid-term examinations will cover all topics taught from the beginning of the academic session up to the date announced by respective subject teachers. Students are advised to consult their subject teachers for detailed syllabus coverage and revision guidance.

Preparation Support:
To support students in their preparation, our faculty will be conducting dedicated revision classes and doubt-clearing sessions in the two weeks leading up to the examinations. Students are strongly encouraged to attend these sessions and utilize this time effectively.

Examination Guidelines:
Students are required to bring their own stationery, admit cards (where applicable), and adhere to the academy's examination code of conduct. Punctuality is essential, and students arriving late may not be permitted additional time to complete their papers.

Result Declaration:
Mid-term results will be evaluated and communicated to parents through report cards within three weeks of the completion of examinations. A Parent-Teacher Meeting will be scheduled shortly after to discuss individual student performance and areas for improvement.

Importance of Mid-Terms:
These examinations serve as an important indicator of a student's grasp of concepts covered so far and help both students and teachers identify areas requiring additional focus before the final examinations later in the year.

We wish all our students the very best for their preparations and encourage them to approach these examinations with confidence and diligence.`,
  },
];

const categories = ["All", "Admission", "Exam", "Event", "Sports"];

export default function Announcement() {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null);

  const { resolvedTheme } = useTheme();

  const filtered =
    active === "All" ? data : data.filter((item) => item.category === active);

  const latest = data.find((item) => item.highlight);

  const getImage = (img) =>
    img && img !== "xyz" ? img : "/Images/default.jpg";

  /* ================= DETAIL PAGE ================= */
  if (selected) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6 mt-10">
        <button
          onClick={() => setSelected(null)}
          className="mb-6 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition"
        >
          ← Back
        </button>

        <div className="max-w-3xl mx-auto border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <img
            src={getImage(selected.image)}
            alt={selected.title}
            className="w-full h-72 object-cover"
          />

          <div className="p-6 sm:p-8">
            <span className="text-xs font-medium bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-full">
              {selected.category}
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-3 mb-1">
              {selected.title}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              📅 {selected.date}
            </p>

            {/* ✅ NEW: long-form detailed content, split into paragraphs */}
            <div className="leading-relaxed text-gray-700 dark:text-gray-300 space-y-4 whitespace-pre-line">
              {selected.details}
            </div>

            {/* ✅ NEW: Apply / Register button linked to a Google Form */}
            {selected.applyLink && (
              <div className="mt-10 flex justify-center">
                <a
                  href={selected.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md transition"
                >
                  {selected.applyLabel || "Apply Now"}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ================= MAIN PAGE ================= */
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <div className="text-center py-14 px-4 border-b border-gray-100 dark:border-gray-800">
        <img src="/Images/logo.png" alt="logo" className="w-20 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Announcements
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Stay updated with the latest academy news & events
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Latest */}
        {latest && (
          <div
            onClick={() => setSelected(latest)}
            className="cursor-pointer border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-10 flex flex-col md:flex-row hover:border-orange-400 transition"
          >
            <img
              src={getImage(latest.image)}
              alt={latest.title}
              className="w-full md:w-1/2 h-56 object-cover"
            />

            <div className="p-6 flex flex-col justify-center">
              <span className="text-xs font-semibold text-red-500 mb-2">
                🔥 Latest Update
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {latest.title}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                {latest.desc}
              </p>
              <span className="text-xs text-gray-400 mt-4">
                📅 {latest.date}
              </span>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                active === cat
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-white dark:bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className="cursor-pointer border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-orange-400 transition"
            >
              <img
                src={getImage(item.image)}
                alt={item.title}
                className="h-44 w-full object-cover"
              />

              <div className="p-5">
                <span className="text-xs font-medium bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-full">
                  {item.category}
                </span>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-3">
                  {item.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  {item.desc}
                </p>

                <p className="text-xs text-gray-400 mt-3">📅 {item.date}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-16">
            No announcements in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}