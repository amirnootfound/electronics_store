import type { Metadata } from "next";
import "../globals.css";
import { StoreProvider } from "@/context/StoreContext";

export const metadata: Metadata = {
  title: "Admin — " + (process.env.NEXT_PUBLIC_STORE_NAME),
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f5f5f7] antialiased">
        <StoreProvider>{children}</StoreProvider>
    </div>
  );
}
