export interface Statistic {
  id: string;
  /** Display value without suffix, e.g. "12". */
  value: string;
  suffix?: string;
  label: string;
  /** Placeholder values render in [brackets] until confirmed figures are supplied. */
  placeholder?: boolean;
  highlight?: boolean;
  order: number;
}
