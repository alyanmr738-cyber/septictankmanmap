import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="stm-login">
      <div className="stm-home-card">
        <p className="stm-map-kicker">Septic Tank Man</p>
        <h1>Admin sign in</h1>
        <p>This dashboard is for internal review matching and map approval only.</p>
        <LoginForm />
      </div>
    </main>
  );
}
