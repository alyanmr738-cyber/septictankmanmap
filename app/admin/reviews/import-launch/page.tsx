import { ImportLaunchForm } from "@/components/admin/ImportLaunchForm";
import { LogoutButton } from "@/components/admin/LogoutButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminImportLaunchPage() {
  return (
    <div className="stm-admin">
      <header className="stm-admin-header">
        <div>
          <p className="stm-map-kicker">Septic Tank Man</p>
          <h1>Launch Import — Publish Reviews to Map</h1>
        </div>
        <LogoutButton />
      </header>
      <main className="stm-admin-main">
        <p className="stm-admin-copy">
          <Link href="/admin/reviews/import-csv">CRM matching batch import</Link>
          {" · "}
          <Link href="/admin/reviews/new">Single review import</Link>
          {" · "}
          <Link href="/admin?status=approved">Approved queue</Link>
        </p>
        <ImportLaunchForm />
      </main>
    </div>
  );
}
