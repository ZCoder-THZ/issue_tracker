'use client'
import React from 'react'
import QueryclientProvider from './QueryClientProvider'
import ToastProvider from './toastProvider'
import AuthProvider from './AuthProvider'
function Provider({children}:any) {
  return (
 
    <AuthProvider>
      <QueryclientProvider>
      
        {children}
      </QueryclientProvider>

    </AuthProvider>
  
  )
}

export default Provider