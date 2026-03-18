import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import VideosPage from './pages/VideosPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import VideoDetailsPage from './pages/VideoDetailsPage.jsx'
import WatchPage from './pages/WatchPage.jsx'

export default function App() {
  return (
    <div>
      <div className="topbar">
        <div className="nav">
          <div className="brand">Streaming Admin</div>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/videos">Videos</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/watchlist">Watchlist</NavLink>
          <NavLink to="/history">History</NavLink>
        </div>
      </div>

      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/videos/:id" element={<VideoDetailsPage />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </div>
  )
}
