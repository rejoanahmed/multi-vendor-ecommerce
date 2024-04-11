"use client";

import { usePathname } from "next/navigation";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Icons } from "./Icons";
import Link from "next/link";

const Footer = () => {
	const pathname = usePathname();
	const pathsToMinimize = ["/verify-email", "/sign-up", "/sign-in"];

	return (
		<footer className="bg-white flex-grow-0">
			<MaxWidthWrapper>
				<div className="border-t border-gray-200">
					{pathsToMinimize.includes(pathname) ? null : (
						<div className="pb-8 pt-16">
							<div className="flex justify-center">
								<Icons.logo className="h-12 w-auto" />
							</div>
						</div>
					)}
				</div>

				<div className="py-10 ">
					<p className="text-sm text-center text-muted-foreground">
						&copy; CSCI3100 : Project Demo (Group F4)
					</p>
				</div>
			</MaxWidthWrapper>
		</footer>
	);
};

export default Footer;
