"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backUrl?: string;
  actions?: React.ReactNode;
}

export default function DashboardHeader({
  title,
  description,
  showBackButton = false,
  backUrl = "/dashboard",
  actions
}: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="mb-6 sm:mb-8">
      {/* Back Button */}
      {showBackButton && (
        <Link
          href={backUrl}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-orange-400 transition mb-4 group"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>
      )}

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <Link href="/dashboard" className="hover:text-orange-400 transition">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-slate-300">
          {title}
        </span>
      </div>
    </div>
  );
}
