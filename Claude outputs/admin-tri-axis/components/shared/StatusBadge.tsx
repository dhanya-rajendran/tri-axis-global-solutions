import { Badge } from "@/components/ui/badge";
import { labels } from "@/lib/constants";

const jobVariant = { open: "success", closed: "secondary", draft: "warning" } as const;
const enquiryVariant = { new: "gold", in_progress: "teal", closed: "secondary", spam: "destructive" } as const;

export function JobStatusBadge({ status }: { status: keyof typeof jobVariant }) {
  return <Badge variant={jobVariant[status]}>{labels.jobStatus[status]}</Badge>;
}
export function EnquiryStatusBadge({ status }: { status: keyof typeof enquiryVariant }) {
  return <Badge variant={enquiryVariant[status]}>{labels.enquiryStatus[status]}</Badge>;
}
export function PublishedBadge({ published }: { published: boolean }) {
  return published ? <Badge variant="success">Published</Badge> : <Badge variant="warning">Hidden</Badge>;
}
