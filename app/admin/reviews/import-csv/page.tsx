import { ImportCsvForm } from "@/components/admin/ImportCsvForm";
import { LogoutButton } from "@/components/admin/LogoutButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminImportCsvPage() {
  return (
    <div className="stm-admin">
      <header className="stm-admin-header">
        <div>
          <p className="stm-map-kicker">Septic Tank Man</p>
          <h1>Batch Import Google Reviews</h1>
        </div>
        <LogoutButton />
      </header>
      <main className="stm-admin-main">
        <p className="stm-admin-copy">
          <Link href="/admin/reviews/new">← Single review import</Link>
          {" · "}
          <Link href="/admin?status=pending">Admin queues</Link>
        </p>
        <ImportCsvForm />
      </main>
    </div>
  );
}
