"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/common";
import { CourseSelector } from "./CourseSelector";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SECTIONS_SIDEBAR } from "@/constants/navigation";
import { useTranslations } from "next-intl";

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("common.sidebar");
  const selectedCourse = useSelector(
    (state: RootState) => state.course.selectedCourse,
  );

  return (
    <aside className="flex flex-col h-screen sticky top-0 w-64 p-2">
      <div className="bg-white p-4 space-y-6 border border-slate-200 h-full rounded-2xl flex flex-col">
        {/* Logo */}
        <Logo />

        {/* Course Selector */}
        <CourseSelector />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-6 ">
          <p className="text-xs  text-neutral-500 uppercase tracking-wider mb-2 ">
            {t("sectionTitle")}
          </p>
          <div className="space-y-2">
            {SECTIONS_SIDEBAR.map(({ nameKey, icon: Icon, href }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                        group relative flex items-center gap-3 px-3 py-3 rounded-lg
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-primary-50 text-primary-600"
                            : "text-neutral-600 hover:bg-neutral-100"
                        }
                      `}
                >
                  <div className="relative shrink-0">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? "text-primary-500"
                          : "text-neutral-400 group-hover:text-neutral-600"
                      }`}
                    />
                  </div>

                  <span className="flex-1 text-sm ">{t(nameKey)}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
