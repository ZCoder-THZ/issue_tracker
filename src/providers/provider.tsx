'use client'
import React from 'react'
import QueryclientProvider from './QueryClientProvider'
import ToastProvider from './toastProvider'
function Provider({children}:any) {
  return (
    <div>
      <QueryclientProvider>
        {/* <ToastProvider/> */}
        {children}
      </QueryclientProvider>
    </div>
  )
}

export default Provider