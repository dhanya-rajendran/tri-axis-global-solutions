export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Placeholder testimonials are clearly labelled and must be replaced with approved content. */
  placeholder?: boolean;
  order: number;
}
