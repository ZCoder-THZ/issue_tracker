'use client';

import dynamic from 'next/dynamic';



const IssueForm = dynamic(() => import('../components/IssueForm'), {
  ssr: false,
});

export default function Dashboard() {

  return (
    <div className="flex flex-col min-h-screen w-full bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-4 lg:gap-2">
              <div className="lg:col-span-4">
                <IssueForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
