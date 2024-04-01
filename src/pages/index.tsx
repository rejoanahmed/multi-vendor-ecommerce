import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "~/components/Navbar";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";

export default function Home() {
  // const products = api.products.getProductList.useQuery();
  // console.log(products.data);
  return (
    <>
      <Head>
        <title>MultiStore</title>
        <meta name="description" content="Multi vendor Ecommerce app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full gap-3">
        <Button onClick={() => signIn()}>SignIn</Button>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </main>
    </>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.products.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined },
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
