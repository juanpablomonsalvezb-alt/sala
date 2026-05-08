"use client";

// Client wrapper necesario para usar dynamic() con ssr: false
// Next.js 16 no permite dynamic({ ssr: false }) en Server Components.

import dynamic from "next/dynamic";

const CategoryMarqueeLazy = dynamic(
  () => import("@/components/home-animations").then((m) => m.CategoryMarquee),
  { ssr: false, loading: () => <div className="bg-[#111] border-y border-[#111] py-3 h-[44px]" /> }
);

export function CategoryMarqueeDynamic() {
  return <CategoryMarqueeLazy />;
}
