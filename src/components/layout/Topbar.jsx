import { Bell, Search, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Topbar = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  const labelMap = {
    dashboard: "Dashboard",
    requests: "Requests",
    teachers: "Teachers",
    students: "Students",
    parents: "Parents",
    "add-teacher": "Add Teacher",
  };

  const breadcrumbs = segments.length
    ? segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const key = segment.toLowerCase();
        const label =
          labelMap[key] ||
          segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
        return {
          label,
          path,
          isLast: index === segments.length - 1,
        };
      })
    : [
        {
          label: "Dashboard",
          path: "/",
          isLast: true,
        },
      ];

  return (
    <header className="bg-card border-b border-border px-6 py-3 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="text-foreground font-medium hover:underline">
                  Application
                </Link>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-2">
                  <span>&gt;</span>
                  {crumb.isLast ? (
                    <span className="text-foreground font-medium capitalize">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.path}
                      className="hover:underline capitalize"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-10 bg-muted/30 border-border h-9 text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Notification Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg hover:bg-muted">
                <Bell className="w-4 h-4 text-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <p className="text-xs text-muted-foreground mt-1">You have 5 unread notifications</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 hover:bg-muted cursor-pointer border-b">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium">New student request</p>
                      <p className="text-xs text-muted-foreground mt-1">John Smith requested admission to Class 5</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-muted cursor-pointer border-b">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium">Document uploaded</p>
                      <p className="text-xs text-muted-foreground mt-1">Dr. Sarah Johnson uploaded notes for Class 10 Mathematics</p>
                      <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-muted cursor-pointer border-b">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium">Fee payment received</p>
                      <p className="text-xs text-muted-foreground mt-1">Payment of ₹25,000 received from Rajesh Sharma</p>
                      <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-muted cursor-pointer border-b">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium">New message</p>
                      <p className="text-xs text-muted-foreground mt-1">Neha Patel sent you a message</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-muted cursor-pointer">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium">System update</p>
                      <p className="text-xs text-muted-foreground mt-1">New features have been added to the dashboard</p>
                      <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 border-t text-center">
                <Button variant="link" className="text-xs">View all notifications</Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-9 px-3 rounded-lg hover:bg-muted">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                  A
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-sm font-medium">
                <p className="text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@lms.com</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
