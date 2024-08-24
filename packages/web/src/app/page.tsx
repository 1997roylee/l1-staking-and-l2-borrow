// import React from "react";
// import L1Dashboard from "@/components/L1Dashboard";
import { redirect } from "next/navigation";

// async function getL1Data() {
//   // In a real app, this would be an external API call
//   const res = await fetch("http://localhost:3000/api/l1-data", {
//     cache: "no-store",
//   });
//   if (!res.ok) {
//     throw new Error("Failed to fetch L1 data");
//   }
//   return res.json();
// }

export default async function Home() {
  redirect("/staking");
}
