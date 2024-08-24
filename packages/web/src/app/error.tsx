'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">L1sload Oracle</h1>
      <Card className="bg-red-900">
        <CardContent>
          <p className="text-red-300">Error: {error.message}</p>
          <button onClick={reset} className="mt-4 bg-red-700 text-white px-4 py-2 rounded">Try again</button>
        </CardContent>
      </Card>
    </div>
  );
}