export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem extends NavLink {
  children?: NavLink[];
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}
