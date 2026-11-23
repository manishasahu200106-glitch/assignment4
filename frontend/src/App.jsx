import React, { useState } from 'react';
import Header from './components/Header';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import './App.css';

export default function App() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTag, setActiveTag] = useState(null);

  const tags = ['react', 'docker', 'cloud', 'devops', 'nodejs', 'mongodb'];

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-text">
            <h1>MERN Cloud Architecture Blog</h1>
            <p>A full-stack containerized blog application deployed with CI/CD</p>
          </div>
          <div>
            <button
              className="btn-primary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Close Editor' : '+ New Blog Post'}
            </button>
          </div>
        </section>

        {showCreateForm && (
          <PostForm onClose={() => setShowCreateForm(false)} />
        )}

        <div className="filter-bar">
          <button
            className={`filter-pill ${activeTag === null ? 'active' : ''}`}
            onClick={() => setActiveTag(null)}
          >
            All Categories
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              className={`filter-pill ${activeTag === tag ? 'active' : ''}`}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            >
              #{tag}
            </button>
          ))}
        </div>

        <PostList activeTag={activeTag} setActiveTag={setActiveTag} />
      </main>

      <footer className="footer">
        <p>MERN Stack Containerized Blog • Designed for Cloud Deployment & DevOps CI/CD</p>
      </footer>
    </div>
  );
}
