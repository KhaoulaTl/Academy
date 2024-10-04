"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { Provider } from "react-redux";
import { store } from "@/hooks/store";
import { setting } from "@/config/setting";
import { getCookies } from "@/utils/functions";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const router = useRouter();

  useEffect(() => {
    const user = getCookies("user");

    // Check if the user is authenticated
    if (!user) {
      // Redirect unauthenticated users to the sign-in page
      router.push(setting.routes.SignIn);
    } else {
      // Allow access if authenticated
      setLoading(false);
    }
  }, [router]);
  

  return (
    <Provider store={store}>
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : children}
        </div>
      </body>
    </html>
    </Provider>
  );
}
