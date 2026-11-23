import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api/postsApi';

export default function PostForm({ onClose }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setTitle('');
      setAuthor('');
      setTagsInput('');
      setContent('');
      setErrorMessage('');
      if (onClose) onClose();
    },
    onError: (err) => {
      const msg = err.response?.data?.errors?.[0]?.message ||
                  err.response?.data?.message ||
                  'Failed to create post. Check backend connection.';
      setErrorMessage(msg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMessage('Title and content are required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    mutation.mutate({
      title: title.trim(),
      author: author.trim() || 'Anonymous',
      tags,
      content: content.trim(),
    });
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h3>Create New Blog Post</h3>
        {onClose && (
          <button className="btn-secondary" onClick={onClose}>
            ✕ Cancel
          </button>
        )}
      </div>

      {errorMessage && (
        <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            placeholder="e.g. Modern CI/CD with Docker and Cloud Run"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={150}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={50}
            />
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. docker, react, render"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Content *</label>
          <textarea
            placeholder="Write your article content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          {onClose && (
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn-primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
