import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api/postsApi';
import PostCard from './PostCard';

export default function PostList({ activeTag, setActiveTag }) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts', activeTag],
    queryFn: () => fetchPosts({ tag: activeTag }),
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        <p>Loading blog posts...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="empty-state" style={{ borderColor: 'var(--danger)' }}>
        <h3>Error loading posts</h3>
        <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
          {error.message || 'Unable to fetch posts from backend.'}
        </p>
        <button className="btn-secondary" onClick={() => refetch()}>
          Retry Connection
        </button>
      </div>
    );
  }

  const posts = data?.data || [];

  return (
    <div>
      {activeTag && (
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>Filtering by: <strong>#{activeTag}</strong></span>
          <button
            className="btn-secondary"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
            onClick={() => setActiveTag(null)}
          >
            Clear Filter
          </button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts found</h3>
          <p>Get started by creating your first blog article above!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onSelectTag={(tag) => setActiveTag(tag)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
