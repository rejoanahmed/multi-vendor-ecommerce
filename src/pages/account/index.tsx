import Link from "next/link";
import React from "react";
import CreateStore from "~/components/CreateStore";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

function AccountPage() {
  // TODO: redirect to login page if not logged in
  const { data: user, isLoading } = api.user.getUser.useQuery();
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="">
        {!user?.isVendor ? (
          <CreateStore />
        ) : (
          <Link href={`/store/${user.vendorStore?.id}`}>
            <Button>Go to Store</Button>
          </Link>
        )}
      </div>
    </>
  );
}

export default AccountPage;
