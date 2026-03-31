"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/common";
import { CourseSelector } from "./CourseSelector";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SECTIONS_SIDEBAR } from "@/constants/navigation";
import { useTranslations } from "next-intl";

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const t = useTranslations("common.sidebar");
  const selectedCourse = useSelector(
    (state: RootState) => state.course.selectedCourse,
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 bg-white
        lg:static lg:z-0
        transform transition-all duration-300 ease-in-out border-r border-slate-200
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-20" : "lg:w-64 w-72"}
      `}
      >
        <div className="flex flex-col h-full relative group/sidebar">
          {/* Logo & Close/Collapse Button */}
          <div className="flex items-center justify-between p-4 h-16 shrink-0">
            <div
              className={`${isCollapsed ? "lg:hidden" : "block"} transition-all duration-300`}
            >
              <Logo />
            </div>
            <div
              className={`${isCollapsed ? "lg:flex" : "hidden"} items-center justify-center w-full`}
            >
              <Logo hideText />
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2  rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            {/* Desktop Collapse Toggle Button - Positioned absolutely or flexed */}
            <button
              onClick={onToggleCollapse}
              className={`
                hidden lg:flex absolute -right-12 cursor-pointer top-20 z-10
                w-12 h-12 items-center justify-center
                bg-white border-t border border-slate-200 
                text-slate-400 hover:text-primary-500 hover:border-primary-200
                transition-all duration-200
                scale-0 group-hover/sidebar:scale-100
              `}
            >
              {isCollapsed ? (
                <ChevronRight className="w-6 h-6" />
              ) : (
                <ChevronLeft className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="flex flex-col flex-1 min-h-0 overflow-hidden px-4 space-y-6">
            {/* Course Selector - Hidden or simplified when collapsed */}
            <div className={`${isCollapsed ? "flex justify-center" : ""}`}>
              <CourseSelector isCollapsed={isCollapsed} />
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto space-y-6 scrollbar-hide py-2">
              <div>
                {!isCollapsed && (
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-4 px-3">
                    {t("sectionTitle")}
                  </p>
                )}
                <div className="space-y-1.5">
                  {SECTIONS_SIDEBAR.map(({ nameKey, icon: Icon, href }) => {
                    const isActive = pathname === href;

                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            onClose();
                          }
                        }}
                        title={isCollapsed ? t(nameKey) : ""}
                        className={`
                              group relative flex items-center gap-3 px-3 py-3 rounded-lg
                              transition-all duration-200
                              ${
                                isActive
                                  ? "bg-primary-50 text-primary-600 shadow-sm shadow-primary-100/50"
                                  : "text-neutral-600 hover:bg-neutral-50"
                              }
                              ${isCollapsed ? "lg:justify-center lg:px-0" : ""}
                            `}
                      >
                        <div className="relative shrink-0 flex items-center justify-center">
                          <Icon
                            className={`w-5 h-5 transition-colors ${
                              isActive
                                ? "text-primary-500"
                                : "text-neutral-400 group-hover:text-neutral-600"
                            }`}
                          />
                        </div>

                        {!isCollapsed && (
                          <span className="flex-1 text-sm font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                            {t(nameKey)}
                          </span>
                        )}

                        {/* Tooltip for collapsed mode - using browser title for now or custom later */}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
