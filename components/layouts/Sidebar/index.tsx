"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Home,
  BookOpen,
  FileText,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronsLeft,
} from "lucide-react";
import { Logo } from "@/components/common";

type NavItem = {
  name: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  hasNotification?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: "General",
    items: [
      { name: "Dashboard", icon: Home, href: "/" },
      { name: "Flashcards", icon: BookOpen, href: "/flashcards", badge: 12 },
      {
        name: "Lessons",
        icon: FileText,
        href: "/lessons",
        hasNotification: true,
      },
      { name: "Community", icon: Users, href: "/community" },
    ],
  },
  // {
  //   title: "Tools",
  //   items: [
  //     { name: "Progress", icon: BarChart3, href: "/progress" },
  //     {
  //       name: "Settings",
  //       icon: Settings,
  //       href: "/settings",
  //       hasNotification: true,
  //     },
  //     { name: "Help", icon: HelpCircle, href: "/help" },
  //   ],
  // },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`
         flex flex-col h-screen sticky top-0
         duration-300 ease-in-out p-2
        ${isCollapsed ? "w-[72px]" : "w-64"}
      `}
    >
      <div className="bg-white shadow-sm p-4 space-y-8 border border-slate-100 h-full rounded-2xl">
        {/* Header - Logo & Collapse Button */}
        <Logo
          className={isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
        />

        {/* <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
            p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50
            transition-all duration-300
            ${isCollapsed ? "absolute -right-3 top-5 bg-white shadow-sm" : ""}
          `}
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronsLeft
              className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button> */}

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-4">
              <p
                className={`
                text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2
                transition-all duration-300
                ${isCollapsed ? "text-center" : ""}
              `}
              >
                {isCollapsed ? "•" : section.title}
              </p>

              <div className="space-y-2">
                {section.items.map(
                  ({ name, icon: Icon, href, badge, hasNotification }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`
                      group relative   flex items-center gap-3 px-3 py-3 rounded-xl
                      transition-all duration-200
                      ${isCollapsed ? "justify-center" : ""}
                      ${
                        isActive
                          ? "bg-primary-50 text-primary-600"
                          : "text-neutral-600  hover:bg-neutral-50"
                      }
                    `}
                      >
                        <div className="relative shrink-0">
                          <Icon
                            className={`w-5 h-5 transition-colors ${
                              isActive
                                ? "text-primary-500"
                                : "group-hover:text-neutral-600"
                            }`}
                          />
                          {hasNotification && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary-500 rounded-full" />
                          )}
                        </div>

                        <span
                          className={`
                        flex-1 text-sm  whitespace-nowrap
                        transition-all duration-300
                        ${isCollapsed ? "hidden" : "block"}
                      `}
                        >
                          {name}
                        </span>
                      </Link>
                    );
                  },
                )}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
