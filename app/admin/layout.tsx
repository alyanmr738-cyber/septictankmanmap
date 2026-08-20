import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Map Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="stm-admin-root">{children}</div>;
}
