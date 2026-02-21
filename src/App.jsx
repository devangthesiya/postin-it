import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Post from './pages/Post';
import About from './pages/About';
import Contact from './pages/Contact';
import Bookmarks from './pages/Bookmarks';

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:slug" element={<Post />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="bookmarks" element={<Bookmarks />} />
        </Route>
      </Routes>
      <Analytics />
    </>
  );
}
