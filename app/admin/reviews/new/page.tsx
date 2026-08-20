import { ImportReviewForm } from "@/components/admin/ImportReviewForm";
import { LogoutButton } from "@/components/admin/LogoutButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminImportReviewPage() {
  return (
    <div className="stm-admin">
      <header className="stm-admin-header">
        <div>
          <p className="stm-map-kicker">Septic Tank Man</p>
          <h1>Import Real Google Review</h1>
        </div>
        <LogoutButton />
      </header>
      <main className="stm-admin-main">
        <p className="stm-admin-copy">
          <Link href="/admin?status=pending">← Back to admin queues</Link>
          {" · "}
          <Link href="/admin/reviews/import-csv">Batch CSV import</Link>
          {" · "}
          <Link href="/admin/reviews/import-launch">Launch import (map)</Link>
        </p>
        <ImportReviewForm />
      </main>
    </div>
  );
}
