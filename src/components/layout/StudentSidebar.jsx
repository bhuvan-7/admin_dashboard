import { useState } from "react";
import { useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, ClipboardList, CalendarCheck2, Megaphone, Award, Layers } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const StudentSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const linkClasses =
    "flex items-center gap-3 px-4 py-3 text-sidebar-foreground/80 hover:bg-sidebar-hover hover:text-sidebar-foreground transition-all duration-200 ease-in-out group relative";
  const activeClasses =
    "bg-background text-primary font-semibold border-l-4 border-primary pointer-events-none after:content-[''] after:absolute after:inset-y-0 after:-right-6 after:w-6 after:bg-background";

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
    { icon: BookOpen, label: "Subjects", path: "/student/subjects" },
    { icon: CalendarCheck2, label: "Exams", path: "/student/exams" },
    { icon: ClipboardList, label: "Assignments", path: "/student/assignments" },
    { icon: CalendarCheck2, label: "Attendance", path: "/student/attendance" },
    { icon: Megaphone, label: "Announcements", path: "/student/announcements" },
    { icon: Award, label: "Results", path: "/student/results" },
  ];

  const MenuItem = ({ item }) => {
    const isActive =
      location.pathname === item.path ||
      (item.path !== "/student" && location.pathname.startsWith(item.path));

    const content = (
      <>
        <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
        {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
      </>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink to={item.path} className={linkClasses} activeClassName={activeClasses}>
              {content}
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <NavLink to={item.path} className={cn(linkClasses, isActive && activeClasses)} activeClassName={activeClasses}>
        {content}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn("bg-sidebar flex flex-col transition-all duration-300 ease-in-out", isCollapsed ? "w-20" : "w-64")}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className={cn("border-b border-sidebar-border/30 transition-all duration-300", isCollapsed ? "p-4" : "p-6")}>
        <div className="flex items-center gap-2">
          <Layers
            className={cn(
              "text-sidebar-foreground flex-shrink-0 transition-all duration-300",
              isCollapsed ? "w-8 h-8" : "w-6 h-6",
            )}
          />
          {!isCollapsed && <h1 className="text-xl font-bold text-sidebar-foreground whitespace-nowrap">LMS Student</h1>}
        </div>
        {!isCollapsed && <p className="text-sm text-sidebar-foreground/70 mt-1">Student Portal</p>}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <MenuItem key={item.path} item={item} />
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border/30">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg hover:bg-sidebar-hover transition-colors cursor-pointer",
            isCollapsed ? "px-2 py-3 justify-center" : "px-4 py-3",
          )}
        >
          <div className="w-10 h-10 rounded-full bg-sidebar-accent text-sidebar-foreground flex items-center justify-center font-semibold flex-shrink-0">
            S
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-medium text-sm text-sidebar-foreground">Student</p>
              <p className="text-xs text-sidebar-foreground/60">student@lms.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;

