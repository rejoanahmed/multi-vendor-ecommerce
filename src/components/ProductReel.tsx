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
    <div className='flex flex-col sm:flex-row gap-3 items-center pb-6 pt-6'>
      <Input
        className='w-full h-16 px-4 rounded-full text-xl font-bold text-center placeholder-gray-300 border-2 border-red-500'
        placeholder='Search Product...'
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
    </div>
    <div className='flex gap-3'>
    <div className='max-w-6xl pr-4 lg:max-w-4xl lg:px-0'>
      </div>
      <h2 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl py-4'>
        Enter {' '}
        <span className='text-red-600'>Starting Price </span>
        and {''}
        <span className='text-red-600'>Ending Price</span>
      </h2>
      <div className='ml-6'>
        <Label>Start Price ($)</Label>
        <Input
          className='w-full h-10 px-4 rounded-lg border-2 border-red-500'
          placeholder='Min Price'
          type='number'
          value={minPr}
          onChange={(e) => setMinPr(e.target.value as unknown as number)}
        />
      </div>

      <div>
        <Label>End Price ($)</Label>
        <Input
          className='w-full h-10 px-4 rounded-lg border-2 border-red-500'
          placeholder='Max Price'
          type='number'
          value={maxPr}
          onChange={(e) => setMaxPr(e.target.value as unknown as number)}
        />
      </div>
    </div>
    <div className="py-6">
      <div className='md:flex md:items-center md:justify-between mb-4'>
      <div className='max-w-6xl pr-4 lg:max-w-4xl lg:px-0'>
        {title ? (
          <h1 className='text-7xl font-bold text-black-600 sm:text-4xl'> 
            {title}
          </h1>
        ) : null}
        {subtitle ? (
          <p className='mt-2 text-xl text-red-500'>{subtitle}</p> 
        ) : null}
      </div>

        {href ? (
          <Link
          href={href}
          className='hidden text-lg font-medium text-red-500 hover:text-red-500 md:block'
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
    </div>
    </section>
  )
}

export default ProductReel
