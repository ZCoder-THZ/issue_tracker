import dynamic from 'next/dynamic';
// const IssueChart = dynamic(() => import('./IssueChart'), { ssr: false });
function page() {
  return (
    <div className="container mx-auto p-4">
      {/* <IssueChart /> */}
    </div>
  );
}

export default page;
