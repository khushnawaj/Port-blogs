import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contacts";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import BlogLayout from "./pages/Blog/BlogLayout";
import BlogPosts from "./pages/Blog/BlogPosts";
import BlogPost from "./pages/Blog/BlogPostSingle";
import Login from "./pages/Login"; // Make sure this exists
import RequireAuth from "./utils/requireAuth";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PostApproval from "./pages/Admin/PostApproval";

function App() {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />
        <Route path="blog" element={<BlogLayout />}>
          <Route index element={<BlogPosts />} />
          <Route path=":slug" element={<BlogPost />} />
        </Route>
      </Route>

      {/* Login route outside layout */}
      <Route path="/login" element={<Login />} />

      {/* Admin routes with different layout */}
      <Route 
        path="admin" 
        element={
          <RequireAuth adminOnly>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="posts" element={<PostApproval />} />
      </Route>

      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;