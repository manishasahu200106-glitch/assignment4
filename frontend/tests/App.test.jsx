import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../src/App';

// Mock API requests for fast, offline, and reliable CI test execution
vi.mock('../src/api/postsApi', () => ({
  default: {},
  fetchPosts: vi.fn().mockResolvedValue({
    success: true,
    count: 0,
    total: 0,
    data: [],
  }),
  checkHealth: vi.fn().mockResolvedValue({
    status: 'OK',
    services: { server: 'healthy', database: 'connected' },
  }),
  createPost: vi.fn().mockResolvedValue({ success: true }),
  deletePost: vi.fn().mockResolvedValue({ success: true }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('Frontend App Component', () => {
  it('renders header, title, and create post button', () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    // Specific heading checks avoiding multiple match errors
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/MERN Cloud Architecture Blog/i);
    expect(screen.getByText(/\+ New Blog Post/i)).toBeInTheDocument();
  });
});
