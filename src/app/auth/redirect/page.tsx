"use client";

import dynamic from 'next/dynamic';

const DynamicRedirect = dynamic(() => import('../information/page'), {
  ssr: false,
});

function MyPage() {
  return <DynamicRedirect />;
}

export default MyPage;
