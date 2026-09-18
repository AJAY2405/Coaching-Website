// export const USER_API_END_POINT = "http://localhost:8000/api/v1/user";
// export const TEST_API_END_POINT = "http://localhost:8000/api/v1/tests";
// export const STUDENT_API_END_POINT = "http://localhost:8000/api/v1/student/tests";
// export const TEACHER_RESULTS_STUDENT="http://localhost:8000/api/v1/results"
// export const NOTES_API_END_POINT = "http://localhost:8000/api/v1/notes";






const BASE_URL = import.meta.env.VITE_BASE_URL;
// const BASE_URL = "https://exam-backend-orix.onrender.com";

export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const TEST_API_END_POINT = `${BASE_URL}/api/v1/tests`;
export const STUDENT_API_END_POINT = `${BASE_URL}/api/v1/student/tests`;
export const TEACHER_RESULTS_STUDENT = `${BASE_URL}/api/v1/results`;
export const NOTES_API_END_POINT = `${BASE_URL}/api/v1/notes`;
export const AITEST_API_END_POINT = `${BASE_URL}/api/v1/aitest`;



// export const CLASS_API_END_POINT = `${BASE_URL}/api/classes`;
// export const CLASS_STUDENT_API_END_POINT = `${BASE_URL}/api/students`;




//  New Notice API endpoint
export const NOTICE_API_END_POINT = `${BASE_URL}/api/v1/notices`;