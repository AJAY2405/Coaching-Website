/* ================= STUDENT ACHIEVERS DATA ================= */
// A fixed list — edit this array directly to add, remove, or update
// students. Each object has exactly: id, name, image, mark, achievement.
// Both the HomeSection card carousel and the StudentDetail page read
// from this same array.

const students = [
  {
    id: 1,
    name: "Ananya Sharma",
    image: "/Images/student1.jpg",
    mark: "96%",
    achievement: "10th Topper 2024",
  },
  {
    id: 2,
    name: "Rohan Verma",
    image: "/Images/student2.jpg",
    mark: "92%",
    achievement: "12th Selection",
  },
  {
    id: 3,
    name: "Priya Singh",
    image: "/Images/student3.jpg",
    mark: "94%",
    achievement: "JEE Qualified",
  },
  {
    id: 4,
    name: "Aditya Kumar",
    image: "/Images/student4.jpg",
    mark: "90%",
    achievement: "NEET Selection",
  },
  {
    id: 5,
    name: "Sneha Gupta",
    image: "/Images/student5.jpg",
    mark: "97%",
    achievement: "Board Rank 1",
  },
  {
    id: 6,
    name: "Karan Mehta",
    image: "/Images/student6.jpg",
    mark: "89%",
    achievement: "Scholarship Winner",
  },
  {
    id: 7,
    name: "Isha Patel",
    image: "/Images/student7.jpg",
    mark: "95%",
    achievement: "Merit List",
  },
  {
    id: 8,
    name: "Arjun Nair",
    image: "/Images/student8.jpg",
    mark: "91%",
    achievement: "State Rank 5",
  },
  {
    id: 9,
    name: "Divya Reddy",
    image: "/Images/student9.jpg",
    mark: "93%",
    achievement: "District Topper",
  },
  {
    id: 10,
    name: "Vikram Joshi",
    image: "/Images/student10.jpg",
    mark: "88%",
    achievement: "Perfect Attendance",
  },
];

export function getAchieverById(id) {
  return students.find((s) => String(s.id) === String(id)) || null;
}

export default students;