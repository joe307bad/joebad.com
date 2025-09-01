"use client";

import { ReactNode } from "react";

interface StickyProps {
  header: string;
  children: ReactNode;
}

export function Sticky({ header, children }: StickyProps) {
  return (
    <div className="mb-6 p-4 border border-(--color-border) bg-(--color-surface)">
      <h3 className="font-mono font-bold text-(--color-accent-500) text-sm mb-3 border-b border-(--color-border) pb-2">
        {header}
      </h3>
      <div className="text-(--color-text) text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}