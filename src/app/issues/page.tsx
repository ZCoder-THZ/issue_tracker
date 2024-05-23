import React from 'react'
import Link from 'next/link'
import { Button } from '@radix-ui/themes'
function IssuesPage() {
  return (
    <div>

      <Button>
        <Link className="text-primary underline-offset-4 text-white hover:underline" href="/issues/new">Add Issue</Link>
      </Button>
    </div>
  )
}

export default IssuesPage