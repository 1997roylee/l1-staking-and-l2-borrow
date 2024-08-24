import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">L1sload Oracle</h1>
      <Card className="bg-gray-900">
        <CardContent>
          <div className="space-y-2">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-gray-800" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
