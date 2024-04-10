import { LucideProps } from 'lucide-react'
import Image from 'next/image'

export const Icons = {
  logo: (props: LucideProps) => (
    <Image src='/logo.jpeg' alt='Logo' width={100} height={25} />
  )
}
