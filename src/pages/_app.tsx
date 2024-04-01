import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Navbar from "~/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main
        className={`font-sans ${inter.variable} flex min-h-screen flex-col border`}
      >
        <Navbar />
        <div className="flex-1">
          <Component {...pageProps} />
        </div>
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
