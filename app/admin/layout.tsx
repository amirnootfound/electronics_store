import type { Metadata } from "next";
import "../globals.css";
import { StoreProvider } from "@/context/StoreContext";

export const metadata: Metadata = {
  title: "Admin — TechStore KG",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f5f5f7] antialiased">
        <StoreProvider>{children}</StoreProvider>
    </div>
  );
}
