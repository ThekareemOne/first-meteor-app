import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddArticle from "./pages/AddArticle";
import Article from "./pages/Article";
import EditArticle from "./pages/EditArticle";
import Login from "./pages/Login";
import MyArticles from "./pages/MyArticles";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ProtectedRoute from "./hoc/ProtectedRoute";
import Navbar from "./components/Navbar";

export const App = () => {
  return (
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/article/add"
            element={
              <ProtectedRoute>
                <AddArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article/mine"
            element={
              <ProtectedRoute>
                <MyArticles />
              </ProtectedRoute>
            }
          />
          <Route path="/article/:id" element={<Article />} />
          <Route
            path="/article/:id/edit"
            element={
              <ProtectedRoute>
                <EditArticle />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    </Router>
  );
};
