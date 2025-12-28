import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function AdminHeaderWrapper({
  title,
  description,
  breadcrumb = [],
  children,
}) {
  return (
    <div className="w-full space-y-6">
      {/* Header + Breadcrumb Section */}
      <div className="bg-[var(--color-bg)] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Title & Description */}
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-heading)]">
            {title}
          </h1>
          {description && (
            <p className="text-[var(--color-text-body)] mt-1">{description}</p>
          )}
        </div>

        {/* Right: Breadcrumb Navigation */}
        <div className="flex items-center flex-wrap text-sm text-[var(--color-text-muted)]">
          {breadcrumb.map((item, index) => (
            <div key={index} className="flex items-center">
              {item.to ? (
                <Link
                  to={item.to}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-[var(--color-text-heading)]">
                  {item.label}
                </span>
              )}

              {index < breadcrumb.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Page Content */}
      {/* <div className="bg-[var(--color-surface)] shadow p-6 rounded-2xl">
        {children}
      </div> */}
    </div>
  );
}
