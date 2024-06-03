import React from 'react';
import { Button } from '@radix-ui/themes';
import Link from 'next/link';
function IssueActions() {
  return (
    <div className="">
      <Button className="">
        <Link href="/issues/new">New Issue</Link>
      </Button>
    </div>
  );
}

export default IssueActions;
