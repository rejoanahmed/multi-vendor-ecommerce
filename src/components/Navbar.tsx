import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/button";
import Cart from "./Cart";
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import UserAccountNav from "./UserAccountNav";
import NavItem from "./NavItem";
import MobileNav from "./MobileNav";

const Navbar = async () => {
	const nextCookies = cookies();
	const { user } = await getServerSideUser(nextCookies);

	return (
		<div className="bg-white sticky z-40 top-0 inset-x-0 h-16">
			<header className="relative bg-white">
				<MaxWidthWrapper>
					<div className="border-b border-gray-200">
						<div className="flex h-20 items-center">
							<MobileNav />
							<div className="ml-4 flex lg:ml-0">
								<Link href="/">
									<Icons.logo className="h-5 w-5" />
								</Link>
							</div>

							<div className="hidden z-50 lg:ml-8 lg:flex lg:self-stretch items-center">
								<NavItem />
							</div>

							<div className="ml-auto flex items-center">
								<div className="lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
									{user ? null : (
										<Link
											href="/sign-in"
											className={`${buttonVariants({
												variant: "ghost",
											})} py-6 px-10 text-xl`} // Added py-2, px-4, and text-lg classes for increased size
										>
											Sign in
										</Link>
									)}

									{user ? null : (
										<span className="h-6 w-px bg-gray-200" aria-hidden="true" />
									)}

									{user ? (
										<UserAccountNav user={user} />
									) : (
										<Link
											href="/sign-up"
											className={`${buttonVariants({
												variant: "ghost",
											})} bg-red-500 text-white py-6 px-10 text-xl`} // Added bg-red-500 and text-white classes
										>
											Register
										</Link>
									)}

									{user ? (
										<span className="h-6 w-px bg-gray-200" aria-hidden="true" />
									) : null}

									{user ? null : (
										<div className="flex lg:ml-6">
											<span
												className="h-6 w-px bg-gray-200"
												aria-hidden="true"
											/>
										</div>
									)}

									<div className="ml-4 flow-root lg:ml-6">
										<Cart />
									</div>
								</div>
							</div>
						</div>
					</div>
				</MaxWidthWrapper>
			</header>
		</div>
	);
};

export default Navbar;
