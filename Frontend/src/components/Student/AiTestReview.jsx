// import { useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CheckCircle2, XCircle, Trophy } from "lucide-react";

// const AiTestReview = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { result: reduxResult } = useSelector((state) => state.aitest);
//   const result = location.state?.result || reduxResult;

//   if (!result) {
//     return (
//       <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center gap-4 text-black dark:text-white">
//         <p className="text-gray-600 dark:text-gray-400">No result found.</p>
//         <button
//           onClick={() => navigate("/student/ai-tests")}
//           className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2.5 transition"
//         >
//           Back to AI Tests
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-12 transition-colors duration-300">
//       <div className="max-w-2xl mx-auto">
//         {/* Score Card */}
//         <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-8 text-center mb-8">
//           <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-4">
//             <Trophy size={28} className="text-orange-500" />
//           </div>
//           <h2 className="text-3xl font-extrabold">
//             {result.score}/{result.total}
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             You scored {result.percentage}%
//           </p>
//         </div>

//         {/* Question Review */}
//         <div className="space-y-4">
//           {result.reviewed.map((q, i) => (
//             <div
//               key={i}
//               className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg border p-5 ${
//                 q.isCorrect
//                   ? "border-green-200 dark:border-green-500/20"
//                   : "border-red-200 dark:border-red-500/20"
//               }`}
//             >
//               <div className="flex items-start gap-2">
//                 {q.isCorrect ? (
//                   <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
//                 ) : (
//                   <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
//                 )}
//                 <p className="font-medium">
//                   {i + 1}. {q.questionText}
//                 </p>
//               </div>
//               <div className="mt-3 ml-6 space-y-1 text-sm">
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Your answer:{" "}
//                   <span className={q.isCorrect ? "text-green-600" : "text-red-500"}>
//                     {q.userAnswer ?? "Not answered"}
//                   </span>
//                 </p>
//                 {!q.isCorrect && (
//                   <p className="text-gray-600 dark:text-gray-400">
//                     Correct answer: <span className="text-green-600">{q.correctAnswer}</span>
//                   </p>
//                 )}
//                 {q.explanation && (
//                   <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg px-3 py-2">
//                     💡 {q.explanation}
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         <button
//           onClick={() => navigate("/student/ai-tests")}
//           className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full px-6 py-3.5 transition"
//         >
//           Back to AI Tests
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AiTestReview;















import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import { AITEST_API_END_POINT } from "@/utils/constants";

const AiTestReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultId } = useParams(); // present only when visiting from history
  const { result: reduxResult } = useSelector((state) => state.aitest);

  const [fetchedResult, setFetchedResult] = useState(null);
  const [loading, setLoading] = useState(!!resultId);

  const liveResult = location.state?.result || reduxResult;
  const result = liveResult || fetchedResult;

  useEffect(() => {
    // Only fetch from backend if we don't already have a live result
    // (i.e. user clicked a past result card, not just-submitted a test)
    if (!resultId || liveResult) return;

    const fetchResult = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${AITEST_API_END_POINT}/results/${resultId}`, {
          withCredentials: true,
        });
        setFetchedResult(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchResult();
  }, [resultId, liveResult]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading result...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center gap-4 text-black dark:text-white">
        <p className="text-gray-600 dark:text-gray-400">No result found.</p>
        <button
          onClick={() => navigate("/student/ai-tests")}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2.5 transition"
        >
          Back to AI Tests
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-12 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Score Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-8 text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-4">
            <Trophy size={28} className="text-orange-500" />
          </div>
          {result.testTitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{result.testTitle}</p>
          )}
          <h2 className="text-3xl font-extrabold">
            {result.score}/{result.total}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            You scored {result.percentage}%
          </p>
        </div>

        {/* Question Review */}
        <div className="space-y-4">
          {result.reviewed.map((q, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg border p-5 ${
                q.isCorrect
                  ? "border-green-200 dark:border-green-500/20"
                  : "border-red-200 dark:border-red-500/20"
              }`}
            >
              <div className="flex items-start gap-2">
                {q.isCorrect ? (
                  <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                ) : (
                  <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                )}
                <p className="font-medium">
                  {i + 1}. {q.questionText}
                </p>
              </div>
              <div className="mt-3 ml-6 space-y-1 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  Your answer:{" "}
                  <span className={q.isCorrect ? "text-green-600" : "text-red-500"}>
                    {q.userAnswer ?? "Not answered"}
                  </span>
                </p>
                {!q.isCorrect && (
                  <p className="text-gray-600 dark:text-gray-400">
                    Correct answer: <span className="text-green-600">{q.correctAnswer}</span>
                  </p>
                )}
                {q.explanation && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg px-3 py-2">
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/student/ai-tests")}
          className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full px-6 py-3.5 transition"
        >
          Back to AI Tests
        </button>
      </div>
    </div>
  );
};

export default AiTestReview;