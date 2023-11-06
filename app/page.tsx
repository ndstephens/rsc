import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

import { SearchInput } from '@/components/search-input';

import { prisma } from '@/lib/prisma';

export default async function Users({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search =
    typeof searchParams.search === 'string' ? searchParams.search : '';
  const totalUsers = await prisma.user.count({
    where: {
      name: {
        contains: search,
      },
    },
  });
  const perPage = 7;
  const maxPage = Math.max(Math.ceil(totalUsers / perPage), 1);

  // page remains a number between 1 and maxPage, regardless of the query string
  const page = Math.min(
    Math.max(Number(searchParams.page ?? '1') || 1, 1),
    maxPage,
  );

  const users = await prisma.user.findMany({
    take: perPage,
    skip: (page - 1) * perPage,
    where: {
      name: {
        contains: search,
      },
    },
  });

  const currentRangeStart = totalUsers > 0 ? (page - 1) * perPage + 1 : 0;
  const currentRangeEnd = Math.min(page * perPage, totalUsers);

  return (
    <div className="min-h-screen bg-gray-50 px-8 pt-12">
      {/* HEADER ROW */}
      <div className="flex items-center justify-between">
        {/* SEARCH INPUT */}
        <div className="w-80">
          <SearchInput search={search} />
        </div>
        {/* ADD USER BUTTON */}
        <div className="ml-16 mt-0 flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="mt-8 flow-root">
        <div className="-mx-6 -my-2">
          <div className="inline-block min-w-full px-6 py-2 align-middle">
            <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">
                      ID
                    </th>
                    <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="relative py-3.5 pl-3 pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                        {user.id}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-4 pr-6 text-right text-sm font-medium">
                        <a
                          href="#"
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                          <ChevronRightIcon className="h-4 w-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex items-center justify-between">
        <p className="select-none text-sm text-gray-700">
          Showing <span className="font-semibold">{currentRangeStart}</span> to{' '}
          <span className="font-semibold">{currentRangeEnd}</span> of{' '}
          <span className="font-semibold">{totalUsers}</span> users
        </p>
        <div className="space-x-2">
          <Link
            href={`/?page=${page - 1 || 1}`}
            aria-disabled={page <= 1}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 aria-disabled:pointer-events-none  aria-disabled:opacity-50"
          >
            Previous
          </Link>
          <Link
            href={`/?page=${page + 1}`}
            aria-disabled={page >= maxPage}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 aria-disabled:pointer-events-none  aria-disabled:opacity-50"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
