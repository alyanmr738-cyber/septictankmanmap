import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Reviews Map",
  description: "Approximate locations of Septic Tank Man customers who left public reviews.",
  robots: { index: false, follow: false },
};

export default function MapLayout({ children }: LayoutProps<"/map">) {
  return <div className="stm-embed">{children}</div>;
}
