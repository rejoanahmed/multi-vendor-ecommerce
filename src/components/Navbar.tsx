import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

function Navbar() {
  const { data } = useSession();
  const user = data?.user;
  return (
    <nav className="flex h-14 items-center border px-10 py-1">
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={120} height={30} />
      </Link>
      {user && (
        <Link href="/account" className="ml-auto">
          <Avatar>
            <AvatarImage src={user.image!} />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
