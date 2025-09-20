import { Routes, Route, Navigate } from "react-router-dom";
import JobsList from "../pages/JobsList.jsx";
import JobDetail from "../pages/JobDetails.jsx";
import CandidatesList from "../pages/CandidatesList.jsx";
import CandidateDetail from "../pages/CandidateDetails.jsx";
import CandidatesBoard from "../pages/CandidatesBoard.jsx";
import AssessmentBuilder from "../pages/AssessmentBuilder.jsx";
import AssessmentForm from "../pages/AssessmentForm.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/jobs" replace />} />
      <Route path="/jobs" element={<JobsList />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/candidates" element={<CandidatesList />} />
      <Route path="/candidates/:id" element={<CandidateDetail />} />
      <Route path="/candidates/board" element={<CandidatesBoard />} />
      <Route path="/assessments/:jobId" element={<AssessmentBuilder />} />
      <Route path="/assessments/:jobId/fill" element={<AssessmentForm />} />
    </Routes>
  );
}
