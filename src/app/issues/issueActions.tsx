import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { sessionAuth } from '@/lib/sessionAUth';
async function IssueActions() {
  const session = await sessionAuth();
  return (
    <div className="">
      <Button className="" className="mb-1 bg-blue-500 text-white">
        {session ? <Link href="/issues/new">New Issue</Link> : 'Please Login'}
      </Button>
    </div>
  );
}

export default IssueActions;
