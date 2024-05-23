'use client'
import React from 'react'
import { QueryClientProvider ,QueryClient} from '@tanstack/react-query'
import { PropsWithChildren } from 'react';

const queryClient = new QueryClient()
function QueryclientProvider({ children }: PropsWithChildren) {
  return (
    
    <QueryClientProvider client={queryClient}>
        {children}
     </QueryClientProvider>
  )
}

export default QueryclientProvider