import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        // Log In
        login: builder.mutation({
            query:(data)=>({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            }),
        }),
        //Register
        register: builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}`,
                method:'POST',
                body:data,
            })
        }),
        //Log Out
        logout: builder.mutation({
            query:()=>({
                url: `${USERS_URL}/logout`,
                method: 'POST'
            })
        }),
        //Profile
        profile: builder.mutation({
            query:(data)=>({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            })
        })
    })
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileMutation } = usersApiSlice