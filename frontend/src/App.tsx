import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Layout } from '@/components/layout/Layout'
import { listBlogMeta } from '@/lib/blog'
import AboutPage from '@/pages/AboutPage'
import BlogIndexPage from '@/pages/BlogIndexPage'
import BlogPostPage from '@/pages/BlogPostPage'
import DashboardPage from '@/pages/DashboardPage'
import HomePage from '@/pages/HomePage'
import ProjectDetailPage from '@/pages/ProjectDetailPage'
import ProjectsIndexPage from '@/pages/ProjectsIndexPage'

const blogPosts = listBlogMeta()

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/blog" element={<BlogIndexPage posts={blogPosts} />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/projects" element={<ProjectsIndexPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
