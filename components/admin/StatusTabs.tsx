import Link from "next/link";
import type { MatchStatus } from "@/lib/types";

const TABS: Array<{ href: string; label: string; status?: MatchStatus | "pending" }> = [
  { href: "/admin", label: "Pending", status: "pending" },
  { href: "/admin?status=needs_review", label: "Needs Review", status: "needs_review" },
  { href: "/admin?status=approved", label: "Approved", status: "approved" },
  { href: "/admin?status=unmatched", label: "Unmatched", status: "unmatched" },
  { href: "/admin?status=rejected", label: "Rejected", status: "rejected" },
];

export function StatusTabs({ active }: { active: string }) {
  return (
    <nav className="stm-tabs" aria-label="Review queues">
      {TABS.map((tab) => {
        const isActive =
          active === tab.status || (active === "matched" && tab.status === "pending");
        return (
          <Link key={tab.href} href={tab.href} className={isActive ? "is-active" : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
