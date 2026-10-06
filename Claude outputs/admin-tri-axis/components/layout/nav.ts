import {
  BarChart3, BookOpen, Briefcase, Building2, FileText, FolderTree, Inbox, LayoutDashboard, ListChecks, MapPin,
  MessageSquareQuote, Scale, Settings, Shapes, Sparkles, UserCog, Users, type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon; adminOnly?: boolean; badge?: "newEnquiries" };
export type NavGroup = { title?: string; items: NavItem[] };

export const navigation: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Enquiries", href: "/enquiries", icon: Inbox, badge: "newEnquiries" },
    ],
  },
  {
    title: "Recruitment",
    items: [
      { label: "Jobs", href: "/jobs", icon: Briefcase },
      { label: "Locations", href: "/content/locations", icon: MapPin },
      { label: "Industries", href: "/industries", icon: Building2 },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Services", href: "/services", icon: Shapes },
      { label: "Insights", href: "/insights", icon: BookOpen },
      { label: "Insight categories", href: "/content/insight-categories", icon: FolderTree },
      { label: "Statistics", href: "/content/statistics", icon: BarChart3 },
      { label: "Testimonials", href: "/content/testimonials", icon: MessageSquareQuote },
      { label: "Feature lists", href: "/content/features", icon: Sparkles },
      { label: "Process steps", href: "/content/process-steps", icon: ListChecks },
      { label: "Team members", href: "/content/team", icon: Users },
      { label: "Legal pages", href: "/legal", icon: Scale },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Site settings", href: "/settings", icon: Settings },
      { label: "Admin users", href: "/users", icon: UserCog, adminOnly: true },
      { label: "API & integration", href: "/integration", icon: FileText },
    ],
  },
];
