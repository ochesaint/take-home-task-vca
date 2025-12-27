import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
})

type FormData = z.infer<typeof formSchema>

export function ExampleForm() {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          {...register('name')}
          className="w-full px-3 py-2 border border-input rounded-md"
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-3 py-2 border border-input rounded-md"
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium mb-1">
          Age
        </label>
        <input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-input rounded-md"
        />
        {errors.age && (
          <p className="text-sm text-destructive mt-1">{errors.age.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
      >
        Submit
      </button>
    </form>
  )
}

