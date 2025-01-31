import React from 'react';
import IssueFormComponent from '../../IssueForm';
import prisma from '../../../../../prisma/client';
import dynamic from 'next/dynamic';
import SelectAction from '../../SelectAction';
const IssueForm = dynamic(() => import('../../IssueForm'), {
  ssr: false,
});
interface Props {
  params: Promise<{ id: string }>;
}

async function page(props: Props) {
  const params = await props.params;
  const issue = await prisma.issue.findUnique({
    where: { id: Number(params.id) },
    include: {
      issueImages: {
        select: {
          id: true,
          imageUrl: true
        }
      }
    }
  });

  return (
    <div className="flex min-h-screen w-full flex-col  bg-muted/40 ">
      <div className="grid gap-4 md:grid-cols-[1fr_150px] lg:grid-cols-3 mt-5 mx-auto lg:gap-8 w-[80%] ">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <IssueForm issue={issue} />
        </div>
        <div className="h-40">
          <SelectAction issue={issue} />
        </div>
      </div>
    </div>
  );
}

export default page;
