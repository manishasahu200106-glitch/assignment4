import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '../api/postsApi';

export default function Header() {
  const { data: healthData, isError } = useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
    refetchInterval: 15000,
    retry: 1,
  });

  const isOnline = !isError && healthData?.status === 'OK';

  return (
    <header className="header">
      <div className="logo-group">
        <span className="logo-badge">MERN</span>
        <h2 className="header-title">CloudBlog</h2>
      </div>
      <div className="header-status">
        <span className={`status-dot ${isOnline ? 'online' : ''}`} />
        <span>Backend API: {isOnline ? 'Online' : 'Connecting...'}</span>
      </div>
    </header>
  );
}
