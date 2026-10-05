import {
  Award, BadgeCheck, Banknote, Boxes, Briefcase, Clock, Cog, Compass, ConciergeBell, Crown, Droplets, Factory,
  FileText, Fuel, Globe, GraduationCap, HandHeart, Handshake, HeartPulse, Landmark, Layers, MapPin, MessageCircle,
  Monitor, Package, Route, Search, ShieldCheck, Ship, ShoppingBag, ShoppingCart, Store, Target, TrendingUp, Truck,
  UserCheck, UserSearch, Users, Workflow, type LucideIcon, type LucideProps,
} from "lucide-react";

/**
 * Icon registry. Content data references icons by string key so that it stays
 * serialisable for the Phase 2 admin/API. Add new keys here as needed.
 */
const registry: Record<string, LucideIcon> = {
  award: Award, "badge-check": BadgeCheck, banknote: Banknote, boxes: Boxes, briefcase: Briefcase, clock: Clock,
  cog: Cog, compass: Compass, "concierge-bell": ConciergeBell, crown: Crown, droplets: Droplets, factory: Factory,
  "file-text": FileText, fuel: Fuel, globe: Globe, "graduation-cap": GraduationCap, "hand-heart": HandHeart,
  handshake: Handshake, "heart-pulse": HeartPulse, landmark: Landmark, layers: Layers, "map-pin": MapPin,
  "message-circle": MessageCircle, monitor: Monitor, package: Package, route: Route, search: Search,
  "shield-check": ShieldCheck, ship: Ship, "shopping-bag": ShoppingBag, "shopping-cart": ShoppingCart, store: Store,
  target: Target, "trending-up": TrendingUp, truck: Truck, "user-check": UserCheck, "user-search": UserSearch,
  users: Users, workflow: Workflow,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = registry[name] ?? Layers;
  return <Cmp aria-hidden strokeWidth={1.5} {...props} />;
}
