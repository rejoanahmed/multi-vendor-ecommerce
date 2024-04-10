import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PRODUCT_CATEGORIES } from '@/config'

type Param = string | string[] | undefined

interface ProductsPageProps {
  searchParams: { [key: string]: Param }
}

const parse = (param: Param) => {
  return typeof param === 'string' ? param : undefined
}

const ProductsPage = ({ searchParams }: ProductsPageProps) => {
  const sort = parse(searchParams.sort)
  const category = parse(searchParams.category)

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label

  return (
    <MaxWidthWrapper>
      <div className='mt-10'>
        <Label>Search</Label>
        <div className='flex'>
          <Input className='flex-grow' placeholder='' />
        </div>
      </div>
      <ProductReel
        title={label ?? 'Browse high-quality assets'}
        query={{
          category,
          limit: 40,
          sort: sort === 'desc' || sort === 'asc' ? sort : undefined
        }}
      />
    </MaxWidthWrapper>
  )
}

export default ProductsPage
