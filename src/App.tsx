import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import ScrollHome from "./pages/ScrollHome";
import Home from "./pages/Home";
import Timeline from "./pages/Timeline";
import EraPage from "./pages/EraPage";
import FigurePage from "./pages/FigurePage";
import WorkPage from "./pages/WorkPage";
import Review from "./pages/Review";
import Recs from "./pages/Recs";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ScrollHome />} />
        <Route path="/overview" element={<Home />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/era/:id" element={<EraPage />} />
        <Route path="/figure/:id" element={<FigurePage />} />
        <Route path="/work/:id" element={<WorkPage />} />
        <Route path="/review" element={<Review />} />
        <Route path="/recs" element={<Recs />} />
        <Route path="*" element={<ScrollHome />} />
      </Route>
    </Routes>
  );
}
