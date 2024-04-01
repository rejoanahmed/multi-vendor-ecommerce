import React from "react";
import CreateStore from "~/components/CreateStore";
import { api } from "~/utils/api";

function AccountPage() {
  // TODO: redirect to login page if not logged in
  const { data: user, isLoading } = api.user.getUser.useQuery();
  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      <div className="">{user?.isVendor && <CreateStore />}</div>
    </>
  );
}

export default AccountPage;
