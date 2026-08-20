import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ReviewCard } from "@/components/admin/ReviewCard";
import { StatusTabs } from "@/components/admin/StatusTabs";
import { getAdminReviewCards } from "@/lib/admin/queries";
import { hasDatabase, isMockMode } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = status ?? "pending";
  const reviews = await getAdminReviewCards(status ?? "pending");

  return (
    <div className="stm-admin">
      <header className="stm-admin-header">
        <div>
          <p className="stm-map-kicker">Septic Tank Man</p>
          <h1>Review Map Admin</h1>
        </div>
        <div className="stm-admin-actions">
          <Link className="stm-btn" href="/admin/reviews/import-csv">
            Batch CSV import
          </Link>
          <Link className="stm-btn stm-btn-primary" href="/admin/reviews/new">
            Import real Google review
          </Link>
          <LogoutButton />
        </div>
      </header>
      {!hasDatabase() ? (
        <p className="stm-banner">
          {isMockMode()
            ? "Mock mode is on and no database is connected. Seed data is in memory and will reset on restart."
            : "No database is connected. Add DATABASE_URL to persist reviews."}
        </p>
      ) : null}
      <main className="stm-admin-main">
        <StatusTabs active={active} />
        {reviews.length === 0 ? (
          <p className="stm-admin-copy">No reviews in this queue.</p>
        ) : (
          <div className="stm-review-grid">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
