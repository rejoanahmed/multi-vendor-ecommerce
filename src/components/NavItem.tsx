'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NavItem = () => {
  const pathname = usePathname()

  const routes = [
    {
      href: `/products?category=electronics`,
      label: 'Electronics',
      active: pathname === `/products?category=electronics`
    },
    {
      href: `/products?category=clothing`,
      label: 'Clothing',
      active: pathname === `/products?category=clothing`
    }
  ]

  return (
    <div className='flex'>
      <nav className='relative flex gap-5 items-center justify-center '>
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'gap=3.0',
              route.active
                ? 'text-black dark:text-white'
                : 'text-muted-foreground'
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default NavItem
