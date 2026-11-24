import { Link, Route, Routes } from "react-router-dom";
import Shell from "./components/Shell";
import Overview from "./screens/Overview";
import Assessments from "./screens/Assessments";
import AssessmentDetail from "./screens/AssessmentDetail";
import Builder from "./screens/Builder";
import Candidates from "./screens/Candidates";
import Library from "./screens/Library";
import Reports from "./screens/Reports";
import Report from "./screens/Report";
import Compare from "./screens/Compare";
import Team from "./screens/Team";
import Billing from "./screens/Billing";
import Settings from "./screens/Settings";
import OrgOverview from "./screens/org/OrgOverview";
import Branches from "./screens/org/Branches";
import Templates from "./screens/org/Templates";
import OrgCandidates from "./screens/org/OrgCandidates";
import OrgCompare from "./screens/org/OrgCompare";

const S = (el: React.ReactNode) => <Shell>{el}</Shell>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={S(<Overview />)} />
      <Route path="/assessments" element={S(<Assessments />)} />
      <Route path="/assessments/new" element={<Builder />} />
      <Route path="/assessments/:id" element={S(<AssessmentDetail />)} />
      <Route path="/candidates" element={S(<Candidates />)} />
      <Route path="/library" element={S(<Library scope="branch" />)} />
      <Route path="/reports" element={S(<Reports />)} />
      <Route path="/reports/:id" element={S(<Report />)} />
      <Route path="/compare" element={S(<Compare />)} />
      <Route path="/team" element={S(<Team scope="branch" />)} />
      <Route path="/billing" element={S(<Billing scope="branch" />)} />
      <Route path="/settings" element={S(<Settings />)} />

      <Route path="/org" element={S(<OrgOverview />)} />
      <Route path="/org/branches" element={S(<Branches />)} />
      <Route path="/org/templates" element={S(<Templates />)} />
      <Route path="/org/candidates" element={S(<OrgCandidates />)} />
      <Route path="/org/compare" element={S(<OrgCompare />)} />
      <Route path="/org/library" element={S(<Library scope="chain" />)} />
      <Route path="/org/users" element={S(<Team scope="chain" />)} />
      <Route path="/org/billing" element={S(<Billing scope="chain" />)} />
      <Route
        path="*"
        element={
          <div className="flex min-h-screen flex-col items-center justify-center gap-2">
            <p className="text-lg font-semibold">Page not found</p>
            <Link to="/" className="font-semibold text-primary underline">
              Back to overview
            </Link>
          </div>
        }
      />
    </Routes>
  );
}
