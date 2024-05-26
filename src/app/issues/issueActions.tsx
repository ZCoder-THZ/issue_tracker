import React from 'react'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'
function issueActions() {
  return (
 
         <div className="d-flex justify-end">
        <Button className='mb-3'><Link href="/issues/new">New Issue</Link></Button>
        </div>
  )
}

export default issueActions