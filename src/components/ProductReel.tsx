'use client'

import { TQueryValidator } from '@/lib/validators/query-validator'
import { Product } from '@/payload-types'
import { trpc } from '@/trpc/client'
import Link from 'next/link'
import ProductListing from './ProductListing'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProductReelProps {
  title: string
  subtitle?: string
  href?: string
  query: TQueryValidator
}

const FALLBACK_LIMIT = 4

const ProductReel = (props: ProductReelProps) => {
  const { title, subtitle, href, query } = props

  const { data: queryResults, isLoading } =
    trpc.getInfiniteProducts.useInfiniteQuery(
      {
        limit: query.limit ?? FALLBACK_LIMIT,
        query
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage
      }
    )
  const [q, setQ] = useState('')
  const [minPr, setMinPr] = useState<number>(0)
  const [maxPr, setMaxPr] = useState<number>(0)
  const products = queryResults?.pages.flatMap((page) => page.items)
  const filteredProducts = products?.filter((product) => {
    if (!product) return false

    if (q.length === 0) return true

    const search = q.toLowerCase()
    const name = product.name.toLowerCase()
    const description = product.description?.toLowerCase()
    const price = product.price
    const minPrice = minPr
    const maxPrice = maxPr

    if (minPrice && price < minPrice) return false
    if (maxPrice && price > maxPrice) return false

    return name.includes(search) || description?.includes(search)
  })

  let map: (Product | null)[] = []
  if (filteredProducts && filteredProducts.length) {
    map = filteredProducts
  } else if (isLoading) {
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null)
  }

  return (
    <section className='py-2'>
      <div className='flex gap-3'>
        <div>
          <Label>Search</Label>
          <Input
            className='flex-grow'
            placeholder='Search Product...'
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div>
          <Label>Min Price</Label>
          <Input
            className='flex-grow'
            placeholder='Min Price'
            type='number'
            value={minPr}
            onChange={(e) => setMinPr(e.target.value as unknown as number)}
          />
        </div>

        <div>
          <Label>Max Price</Label>
          <Input
            className='flex-grow'
            placeholder='Max Price'
            type='number'
            value={maxPr}
            onChange={(e) => setMaxPr(e.target.value as unknown as number)}
          />
        </div>
      </div>
      <div className='md:flex md:items-center md:justify-between mb-4'>
        <div className='max-w-2xl px-4 lg:max-w-4xl lg:px-0'>
          {title ? (
            <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className='mt-2 text-sm text-muted-foreground'>{subtitle}</p>
          ) : null}
        </div>

        {href ? (
          <Link
            href={href}
            className='hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block'
          >
            Shop the collection <span aria-hidden='true'>&rarr;</span>
          </Link>
        ) : null}
      </div>

      <div className='relative'>
        <div className='mt-6 flex items-center w-full'>
          <div className='w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8'>
            {map.map((product, i) => (
              <ProductListing
                key={`product-${i}`}
                product={product}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductReel
