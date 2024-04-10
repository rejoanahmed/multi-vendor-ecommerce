"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Label } from "@radix-ui/react-dropdown-menu";

type Category = (typeof PRODUCT_CATEGORIES)[number];

interface NavItemProps {
	category: Category;
	handleOpen: () => void;
	close: () => void;
	isOpen: boolean;
	isAnyOpen: boolean;
}

const NavItem = ({
	isAnyOpen,
	category,
	handleOpen,
	close,
	isOpen,
}: NavItemProps) => {
	const pathname = usePathname();

	const routes = [
		{
			href: `/product?category=electronics`,
			label: "Electronics",
			active: pathname === `/products?category=${category.value}`,
		},
		{
			href: `/product?category=clothing`,
			label: "Clothing",
			active: pathname === `/products?category=clothing`,
		},
	];

	return (
		<div className="flex">
			<nav className="relative flex items-center">
				{routes.map((route) => (
					<Link
						key={route.href}
						href={route.href}
						className={cn(
							"gap=3.0",
							route.active
								? "text-black dark:text-white"
								: "text-muted-foreground"
						)}
					>
						{route.label}
					</Link>
				))}
			</nav>
		</div>
	);
};

export default NavItem;
