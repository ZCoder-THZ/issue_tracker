'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChangeHandler = (e: any) => {
    const params = new URLSearchParams(searchParams.toString());
    const searchValue = e.target.value;

    if (searchValue.length > 0) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <Input
      type="text"
      placeholder="Search"
      onChange={(e) => onChangeHandler(e)}
    />
  );
}
