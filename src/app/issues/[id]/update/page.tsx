import React from 'react';
import IssueFormComponent from '../../IssueForm';
import prisma from '../../../../../prisma/client';
import dynamic from 'next/dynamic';
import SelectAction from '../../SelectAction';
const IssueForm = dynamic(() => import('../../IssueForm'), {
  ssr: false,
});
interface Props {
  params: { id: string };
}

async function page({ params }: Props) {
  const issue = await prisma.issue.findUnique({
    where: { id: Number(params.id) },
  });

  return (
    <div className="d-flex ">
      <IssueForm issue={issue} />
      <SelectAction issue={issue} />
    </div>
  );
}

export default page;
