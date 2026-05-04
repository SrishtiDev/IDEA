import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Idea } from "./pages/Idea";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/idea" element={<Idea />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
