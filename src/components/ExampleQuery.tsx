import { useQuery } from '@tanstack/react-query'

interface User {
  id: number
  name: string
  email: string
}

// Example query function
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/users')
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

export function ExampleQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Users</h2>
      <ul className="list-disc list-inside">
        {data?.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}

