import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  usersReadUserMeOptions,
  usersUpdateUserMeMutation,
  usersUpdatePasswordMeMutation
} from "@/client/@tanstack/react-query.gen"
import type { AxiosError } from "axios"
import { UserPublic, UserUpdateMe } from "@/client/types.gen"
import { useAuth } from "@/context/AuthContext"

/**
 * Hook to get current user data
 * Uses the generated React Query options and types
 */
export const useCurrentUserData = () => {
  const { authToken } = useAuth()
  
  return useQuery({
    ...usersReadUserMeOptions({
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    }),
    enabled: !!authToken,
    retry: (failureCount, error) => {
      if ((error as AxiosError)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

/**
 * Hook to update current user data
 * Uses the generated React Query mutation and types
 */
export const useUpdateCurrentUserData = () => {
  const queryClient = useQueryClient()
  const { authToken } = useAuth()
  
  return useMutation({
    ...usersUpdateUserMeMutation({
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    }),
    onSuccess: (updatedUser) => {
      // Update the current user query with the updated data
      queryClient.setQueriesData(
        { 
          queryKey: [{ _id: 'usersReadUserMe' }], 
          exact: false 
        },
        updatedUser
      );
    },
  })
}

/**
 * Hook to update current user password
 * Uses the generated React Query mutation and types
 */
export const useUpdateCurrentUserPasswordData = () => {
  const { authToken } = useAuth()
  
  return useMutation({
    ...usersUpdatePasswordMeMutation({
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    }),
  })
}
