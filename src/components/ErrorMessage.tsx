import React, { PropsWithChildren } from 'react'
import { AlertCircle } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"
function ErrorMessage({children}:PropsWithChildren) {
    if(!children)return null;

  return (
    <Alert variant="destructive">
   
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>
        {children}
    </AlertTitle>
 
  </Alert>
  )
}

export default ErrorMessage