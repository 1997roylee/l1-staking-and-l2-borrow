"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface L1Data {
  id: number;
  name: string;
  symbol: string;
  price: number;
}

interface L1DashboardProps {
  initialData: L1Data[];
}

export default function L1Dashboard({ initialData }: L1DashboardProps) {
  const [l1Data, setL1Data] = useState<L1Data[] | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/l1-data");
        if (!response.ok) {
          throw new Error("Failed to fetch L1 data");
        }
        const data = await response.json();
        setL1Data(data);
      } catch (err) {
        console.error("Failed to fetch updated L1 data", err);
        setError("Failed to fetch L1 data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return (
      <Card className="bg-gray-900">
        <CardContent>
          <p className="text-[#101010]">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#101010]">#</TableHead>
              <TableHead className="text-[#101010]">Name</TableHead>
              <TableHead className="text-[#101010] text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || !l1Data
              ? // Loading state
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={3}>
                      <Skeleton className="h-12 w-full bg-gray-800" />
                    </TableCell>
                  </TableRow>
                ))
              : // Data display
                l1Data.map((l1) => (
                  <TableRow key={l1.id}>
                    <TableCell className="font-medium text-[#101010]">
                      {l1.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-6 h-6 mr-2 bg-gray-700 rounded-full"></div>
                        <div className="flex flex-col">
                          <span className="text-[#101010]">{l1.name}</span>
                          <span className="text-sm text-gray-400">
                            {l1.symbol}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[#101010]">
                      $
                      {l1.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
