import Image from "next/image";
import DashboardPage from "@/components/DashboardPage";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>3D Ai Avatar</h1>
      <DashboardPage />
    </main>
  );
}
