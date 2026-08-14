import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-lg border border-neutral-200 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}