import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ExtensionPage from "./pages/ExtensionPage";
import DeveloperPortal from "./pages/DeveloperPortal";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/extensions/:id" element={<ExtensionPage />} />
          <Route path="/developer" element={<DeveloperPortal />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
