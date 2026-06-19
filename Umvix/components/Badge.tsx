import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full bg-brand-red/20 px-3 py-1 text-xs font-medium text-brand-red ${className}`}
    >
      {children}
    </span>
  );
}
