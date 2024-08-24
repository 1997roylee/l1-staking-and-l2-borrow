import React from 'react';
import L1Dashboard from '@/components/L1Dashboard';

async function getL1Data() {
  // In a real app, this would be an external API call
  const res = await fetch('http://localhost:3000/api/l1-data', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch L1 data');
  }
  return res.json();
}

export default async function Home() {
  const initialL1Data = await getL1Data();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">L1sload Oracle</h1>
      <L1Dashboard initialData={initialL1Data} />
    </div>
  );
}