import { useState } from "react";
import { LayoutDashboard, Mail, Users, GraduationCap, UserCircle, Layers, CheckSquare, BookOpen, Megaphone, UserPlus, Award } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const linkClasses =
    "flex items-center gap-3 px-4 py-3 text-sidebar-foreground/80 hover:bg-sidebar-hover hover:text-sidebar-foreground transition-all duration-200 ease-in-out group relative";
  const activeClasses =
    "bg-background text-primary font-semibold border-l-4 border-primary pointer-events-none after:content-[''] after:absolute after:inset-y-0 after:-right-6 after:w-6 after:bg-background";

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Mail, label: "Requests", path: "/requests" },
    { icon: UserPlus, label: "Add Teacher", path: "/add-teacher" },
    { icon: Users, label: "Teachers", path: "/teachers" },
    { icon: GraduationCap, label: "Students", path: "/students" },
    { icon: UserCircle, label: "Parents", path: "/parents" },
    { icon: BookOpen, label: "Subjects", path: "/subjects" },
    { icon: CheckSquare, label: "Attendance", path: "/attendance" },
    { icon: Award, label: "Results", path: "/results" },
    { icon: Megaphone, label: "Announcements", path: "/announcements" },
  ];

  const MenuItem = ({ item, isActive }) => {
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
            <NavLink
              to={item.path}
              className={linkClasses}
              activeClassName={activeClasses}
            >
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
      <NavLink
        to={item.path}
        className={linkClasses}
        activeClassName={activeClasses}
      >
        {content}
      </NavLink>
    );
  };

  return (
    <aside 
      className={cn(
        "bg-sidebar flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className={cn(
        "border-b border-sidebar-border/30 transition-all duration-300",
        isCollapsed ? "p-4" : "p-6"
      )}>
        <div className="flex items-center gap-2">
          <Layers className={cn(
            "text-sidebar-foreground flex-shrink-0 transition-all duration-300",
            isCollapsed ? "w-8 h-8" : "w-6 h-6"
          )} />
          {!isCollapsed && (
            <>
              <h1 className="text-xl font-bold text-sidebar-foreground whitespace-nowrap">LMS Admin</h1>
            </>
          )}
        </div>
        {!isCollapsed && (
          <p className="text-sm text-sidebar-foreground/70 mt-1">Management System</p>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <MenuItem key={item.path} item={item} />
        ))}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border/30">
        <div className={cn(
          "flex items-center gap-3 rounded-lg hover:bg-sidebar-hover transition-colors cursor-pointer",
          isCollapsed ? "px-2 py-3 justify-center" : "px-4 py-3"
        )}>
          <div className="w-10 h-10 rounded-full bg-sidebar-accent text-sidebar-foreground flex items-center justify-center font-semibold flex-shrink-0">
            A
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-medium text-sm text-sidebar-foreground">Admin User</p>
              <p className="text-xs text-sidebar-foreground/60">admin@lms.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

