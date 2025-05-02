import React from 'react';
import prisma from '../../../../../prisma/client';
import dynamic from 'next/dynamic';

const IssueForm = dynamic(() => import('../../components/IssueForm'), {
  ssr: false,
});

interface Props {
  params: { id: string }; // FIXED: Removed `Promise<>` – `params` is not async
}

async function page({ params }: Props) {
  const issue = await prisma.issue.findUnique({
    where: { id: Number(params.id) },
    include: {
      issueImages: {
        select: {
          id: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!issue) {
    return <div>Issue not found</div>;
  }

  const { issueImages, ...rest } = issue;

  const formattedIssue = {
    ...rest,
    images: issueImages.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
    })),
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="grid gap-4 md:grid-cols-[1fr_150px] lg:grid-cols-3 mt-5 mx-auto lg:gap-8 w-[80%]">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <IssueForm issue={formattedIssue} />
        </div>

      </div>
    </div>
  );
}

export default page;
