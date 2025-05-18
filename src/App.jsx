import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import GameBar from "./components/GameBar";
// import MoonwalkApp from "./components/MoonwalkApp";

function App() {
  return (
    <Router>
      <main className="relative min-h-screen w-screen overflow-x-hidden">
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                <Features />
                <Story />
                <Contact />
                <Footer />
              </>
            }
          />
          <Route path="/gamebar" element={<GameBar />} />
          {/* <Route path="/moonwalk" element={<MoonwalkApp />} /> */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
