import {
  Award, BadgeCheck, Banknote, Boxes, Briefcase, Clock, Cog, Compass, ConciergeBell, Crown, Droplets, Factory,
  FileText, Fuel, Globe, GraduationCap, HandHeart, Handshake, HeartPulse, Landmark, Layers, MapPin, MessageCircle,
  Monitor, Package, Route, Search, ShieldCheck, Ship, ShoppingBag, ShoppingCart, Store, Target, TrendingUp, Truck,
  UserCheck, UserSearch, Users, Workflow, type LucideIcon,
} from "lucide-react";

/**
 * Must match the icon registry in the website (components/ui/Icon.tsx).
 * Content stores the string key; the website renders the matching icon.
 */
export const iconRegistry: Record<string, LucideIcon> = {
  award: Award, "badge-check": BadgeCheck, banknote: Banknote, boxes: Boxes, briefcase: Briefcase, clock: Clock,
  cog: Cog, compass: Compass, "concierge-bell": ConciergeBell, crown: Crown, droplets: Droplets, factory: Factory,
  "file-text": FileText, fuel: Fuel, globe: Globe, "graduation-cap": GraduationCap, "hand-heart": HandHeart,
  handshake: Handshake, "heart-pulse": HeartPulse, landmark: Landmark, layers: Layers, "map-pin": MapPin,
  "message-circle": MessageCircle, monitor: Monitor, package: Package, route: Route, search: Search,
  "shield-check": ShieldCheck, ship: Ship, "shopping-bag": ShoppingBag, "shopping-cart": ShoppingCart, store: Store,
  target: Target, "trending-up": TrendingUp, truck: Truck, "user-check": UserCheck, "user-search": UserSearch,
  users: Users, workflow: Workflow,
};

export const iconNames = Object.keys(iconRegistry).sort();

export function IconPreview({ name, className }: { name: string; className?: string }) {
  const Cmp = iconRegistry[name] ?? Layers;
  return <Cmp aria-hidden className={className ?? "size-4"} strokeWidth={1.75} />;
}
