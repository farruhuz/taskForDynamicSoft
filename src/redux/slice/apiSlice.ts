// apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const mockApi = createApi({
  reducerPath: 'mockApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://66260426052332d553214ba8.mockapi.io/' }),
  endpoints: (builder) => ({
    // getUsers: builder.query({
    //   query: () => 'users',
    // }),
    getUsers: builder.query({
      query: ({ page = 1, limit = 3, filter = '' }) => ({
        url: `users?page=${page}&limit=${limit}&filter=${filter}`,
      }),
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: 'users',
        method: 'POST',
        body: user,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...user }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: user,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetUsersQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation } = mockApi;
