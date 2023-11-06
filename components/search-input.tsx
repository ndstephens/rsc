'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import { Spinner } from '@/components/spinner';

export function SearchInput({ search }: { search: string }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const isSearching = isPending || timeoutId;

  return (
    <div className="relative mt-1 rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon
          className="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </div>
      <input
        type="text"
        name="search"
        id="search"
        className="block w-full rounded-md border-gray-300 px-10 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
        placeholder="Search"
        defaultValue={search}
        onChange={(event) => {
          clearTimeout(timeoutId);
          const id = setTimeout(() => {
            startTransition(() => {
              if (event.target.value.trim()) {
                router.push(`/?search=${event.target.value.trim()}`);
              } else {
                router.push('/');
              }
              setTimeoutId(undefined);
            });
          }, 300);
          setTimeoutId(id);
        }}
      />
      {isSearching && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Spinner
            className="w-5 animate-spin text-gray-400"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
