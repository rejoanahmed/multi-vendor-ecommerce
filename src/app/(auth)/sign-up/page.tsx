'use client'

import { Icons } from '@/components/Icons'
import {
  Button,
  buttonVariants,
} from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from '@/lib/validators/account-credentials-validator'
import { trpc } from '@/trpc/client'
import { toast } from 'sonner'
import { ZodError } from 'zod'
import { useRouter } from 'next/navigation'

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  })

  const router = useRouter()

  const { mutate, isLoading } =
    trpc.auth.createPayloadUser.useMutation({
      onError: (err) => {
        if (err.data?.code === 'CONFLICT') {
          toast.error(
            'This email is already in use. Sign in instead?'
          )

          return
        }

        if (err instanceof ZodError) {
          toast.error(err.issues[0].message)

          return
        }

        toast.error(
          'Something went wrong. Please try again.'
        )
      },
      onSuccess: ({ sentToEmail }) => {
        toast.success(
          `Verification email sent to ${sentToEmail}.`
        )
        router.push('/verify-email?to=' + sentToEmail)
      },
    })

  const onSubmit = ({
    email,
    password,
  }: TAuthCredentialsValidator) => {
    mutate({ email, password })
  }

  return (
<>
  <div className='container relative flex pt-32 flex-col items-center justify-center lg:px-0'>
    <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]'>
      <div className='flex flex-col items-center space-y-4 text-center'>
        <Icons.logo className='h-24 w-24' />
        <h1 className='text-3xl font-semibold tracking-tight'>
          Create an account
        </h1>

        <Link
          className={buttonVariants({
            variant: 'link',
            className: 'gap-2 text-xl text-red-500',
          })}
          href='/sign-in'>
          Already have an account? Sign-in
          <ArrowRight className='h-6 w-6' />
        </Link>
      </div>

      <div className='grid gap-8'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            <div className='grid gap-2 py-4'>
              <Label htmlFor='email' className='text-lg'>Email</Label>
              <Input
                {...register('email')}
                className={cn({
                  'focus-visible:ring-red-500': errors.email,
                })}
                placeholder='you@example.com'
                style={{ fontSize: '1.5rem', padding: '0.5rem' }}
              />
              {errors?.email && (
                <p className='text-base text-red-500'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='grid gap-2 py-4'>
              <Label htmlFor='password' className='text-lg'>Password</Label>
              <Input
                {...register('password')}
                type='password'
                className={cn({
                  'focus-visible:ring-red-500': errors.password,
                })}
                placeholder='Password'
                style={{ fontSize: '1.5rem', padding: '0.5rem' }}
              />
              {errors?.password && (
                <p className='text-base text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button variant='destructive' style={{ fontSize: '1.5rem', padding: '0.75rem 1.5rem' }}>
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</>
  )
}

export default Page
