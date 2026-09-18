import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user_routes.js';
import cors from "cors";
import testRoutes from "./routes/test_routes.js";
import studentTestRoutes from "./routes/studentTestRoutes.js";
import resultRoutes from "./routes/results_routes.js"
import noteRoutes from "./routes/note.routes.js"
// import classRoutes from "./routes/classRoutes.js";
// import studentRoutes from "./routes/studentRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js"; // ✅ changed require -> import
// ai test 
import aitestRoutes from "./routes/aitest.routes.js";
import chatRoutes from "./routes/chatRoutes.js"


dotenv.config({});

const app = express();


app.use(cors({
  origin: [
  "http://localhost:5173",
  "https://mda-coaching.vercel.app",
  "https://mangaldeep-online.vercel.app"
], // frontend URL
  // origin: "exam-frontend-beta.vercel.app", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());





app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.use('/api/v1/user', userRoute);
app.use("/api/v1/tests", testRoutes);
app.use("/api/v1/student/tests", studentTestRoutes);
app.use("/api/v1/results", resultRoutes);
app.use("/api/v1/notes", noteRoutes);
// app.use('/api/classes', classRoutes);
// app.use('/api/students', studentRoutes);
app.use("/api/v1/notices", noticeRoutes);
app.use("/api", chatRoutes);

//ai test
app.use("/api/v1/aitest", aitestRoutes);


"http://localhost:8000/api/v1/user/register"
"http://localhost:8000/api/v1/user/login"
"http://localhost:8000/api/v1/user/profile/update"


const PORT=process.env.PORT ||10000;
app.listen(PORT, () => {
  connectDB();  
  console.log(`Server is running on port ${PORT}`);
})