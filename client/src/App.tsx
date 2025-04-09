import { useState } from "react";
import ControlTable from "./components/ControlTable";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <Router>
        <div className="mx-10">
          <Routes>
            <Route path="*" element={<ControlTable />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}
