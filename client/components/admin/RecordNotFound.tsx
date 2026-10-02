import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmptyState } from "./ui";

export default function RecordNotFound({ noun, backHref }: { noun: string; backHref: string }) {
  return (
    <div className="card py-16">
      <EmptyState
        title={`This ${noun} doesn’t exist`}
        description="It may have been deleted, or the link is out of date."
        action={
          <Link href={backHref} className="btn-secondary btn-sm">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to the list
          </Link>
        }
      />
    </div>
  );
}
