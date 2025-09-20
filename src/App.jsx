// /App.jsx
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer.jsx";
import AppRoutes from "./routes/routes.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Navbar />
        <div className="max-w-5xl mx-auto">
          <AppRoutes />
        </div>
        <Footer />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
