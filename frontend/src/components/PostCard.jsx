import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../api/postsApi';

export default function PostCard({ post, onSelectTag }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err) => {
      alert(`Failed to delete post: ${err.message}`);
    },
  });

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="post-card">
      <div>
        <div className="post-meta">
          <span>By {post.author}</span>
          <span>{formattedDate}</span>
        </div>

        <h3 className="post-title">{post.title}</h3>
        <p className="post-content">{post.content}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="tag-list">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="tag-badge"
                style={{ cursor: onSelectTag ? 'pointer' : 'default' }}
                onClick={() => onSelectTag && onSelectTag(tag)}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="post-footer">
        <span style={{ color: 'var(--text-muted)' }}>Status: Published</span>
        <button
          className="btn-delete"
          onClick={() => {
            if (window.confirm(`Delete "${post.title}"?`)) {
              deleteMutation.mutate(post._id);
            }
          }}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </article>
  );
}
