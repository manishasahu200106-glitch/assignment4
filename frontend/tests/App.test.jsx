import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../src/App';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('App Component', () => {
  it('renders the header and main title', () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    expect(screen.getByText(/MERN/i)).toBeInTheDocument();
    expect(screen.getByText(/MERN Cloud Architecture Blog/i)).toBeInTheDocument();
    expect(screen.getByText(/\+ New Blog Post/i)).toBeInTheDocument();
  });
});
