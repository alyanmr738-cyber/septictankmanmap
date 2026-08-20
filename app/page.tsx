import Link from "next/link";

export default function HomePage() {
  return (
    <main className="stm-home">
      <div className="stm-home-card">
        <p className="stm-map-kicker">Septic Tank Man</p>
        <h1>Customer Review Map</h1>
        <p>
          This Vercel app powers the interactive review map embedded on the WordPress contact page.
          WordPress keeps the header, quote form, and footer.
        </p>
        <div className="stm-actions">
          <Link className="stm-btn stm-btn-primary" href="/map">
            Open public map
          </Link>
          <Link className="stm-btn" href="/admin">
            Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
