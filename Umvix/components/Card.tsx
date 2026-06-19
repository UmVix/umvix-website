import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded border border-brand-black-soft bg-brand-black-soft p-6 ${className}`}
    >
      {children}
    </div>
  );
}
