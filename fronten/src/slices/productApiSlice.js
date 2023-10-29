import { PRODUCT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getProducts: builder.query({
            query:()=>({
                url: PRODUCT_URL,
            }),
            keepUnusedDataFor: 5  //5 min
        }),

        getProductDetails: builder.query({
            query:(productId)=>({
                url: `${PRODUCT_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5  //5 min
        })
    })
})

export const { useGetProductsQuery,useGetProductDetailsQuery } = productsApiSlice