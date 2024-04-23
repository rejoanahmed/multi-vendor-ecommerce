import { LucideProps } from 'lucide-react'
import Image from 'next/image'

export const Icons = {
  logo: (props: LucideProps) => (
    <Image src='/logo-red.jpeg' alt='Logo' width={150} height={25} />
  )
}
