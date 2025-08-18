import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contacts";
import NotFound from "./pages/NotFound";

// Blog Components
import BlogLayout from "./pages/Blog/BlogLayout";
import BlogList from "./pages/Blog/BlogList";
import BlogPostSingle from "./pages/Blog/BlogPostSingle";
import CreateBlogPost from "./pages/Blog/CreateBlogPost";
import ProfilePage from "./pages/Profile/ProfilePage";

// Auth Components
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Admin Components
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PostApproval from "./pages/Admin/PostApproval";
import RequireAuth from "./utils/requireAuth";
import UserManagement from "./pages/Admin/UserManagement";

function App() {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />

        {/* Blog Routes */}
        <Route path="blog" element={<BlogLayout />}>
          <Route index element={<BlogList />} />
          <Route path="Create-Blog" element={<CreateBlogPost />} />{" "}
          {/* ✅ Add this */}
          <Route path=":id" element={<BlogPostSingle />} />
        </Route>
          <Route path="profile" element={<ProfilePage />} />

        {/* Auth Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Admin Routes (Separate layout) */}
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
        <Route path="manage-posts" element={<PostApproval />} />
        <Route path="manage-users" element={<UserManagement />} />{" "}
        {/* ✅ Added */}
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
