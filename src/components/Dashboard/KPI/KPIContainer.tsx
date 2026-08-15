
import type { ReactNode } from "react";

interface KPIContainerProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

export default function KPIContainer({
  children,
  columns = 4,
}: KPIContainerProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]}`}>
      {children}
    </div>
  );
}