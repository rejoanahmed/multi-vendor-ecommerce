/* eslint-disable @next/next/no-img-element */
import React from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Addproduct from "~/components/Addproduct";

function StorePage() {
  const router = useRouter();
  const { data: store, isLoading } = api.vendorStore.getStore.useQuery(
    {
      id: router.query.storeId as string,
    },
    {
      enabled: !!router.query.storeId,
    },
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1 className="mt-6 text-center text-xl font-bold underline">
        {store?.name}
      </h1>
      <p className="mb-6 text-center">{store?.description}</p>
      <Separator />
      <div className="mt-4 flex justify-between">
        <h1 className="text-3xl">Products</h1>
        <Addproduct />
      </div>
      <Table>
        <TableCaption>A list of Products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]"></TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {store?.products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                <img
                  src={product.images[0]?.url}
                  alt={product.description}
                  width={140}
                  height={100}
                  className="object-contain"
                />
              </TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default StorePage;
