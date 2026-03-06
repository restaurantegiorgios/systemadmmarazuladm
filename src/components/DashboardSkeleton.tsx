import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const DashboardSkeleton: React.FC<{ viewMode: 'table' | 'cards' }> = ({ viewMode }) => {
  const statCards = Array.from({ length: 6 });
  const listItems = Array.from({ length: 8 });

  return (
    <div className="animate-pulse">
      {/* Stats Skeleton */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-8">
        {statCards.map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* List/Card View Skeleton */}
      {viewMode === 'table' ? (
        <div className="bg-card rounded-lg shadow-elegant overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left"><Skeleton className="h-4 w-10" /></th>
                  <th className="p-4 text-left"><Skeleton className="h-4 w-20" /></th>
                  <th className="p-4 text-left hidden md:table-cell"><Skeleton className="h-4 w-24" /></th>
                  <th className="p-4 text-left hidden lg:table-cell"><Skeleton className="h-4 w-32" /></th>
                  <th className="p-4 text-left hidden lg:table-cell"><Skeleton className="h-4 w-20" /></th>
                  <th className="p-4 text-left"><Skeleton className="h-4 w-16" /></th>
                  <th className="p-4 text-right"><Skeleton className="h-4 w-16" /></th>
                </tr>
              </thead>
              <tbody>
                {listItems.map((_, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="p-4"><Skeleton className="h-8 w-8 rounded-full" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-4 hidden md:table-cell"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-4 hidden lg:table-cell"><Skeleton className="h-4 w-40" /></td>
                    <td className="p-4 hidden lg:table-cell"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                    <td className="p-4 text-right"><div className="flex justify-end gap-2"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-8 w-8 rounded-full" /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {listItems.map((_, index) => (
            <Card key={index} className="h-full">
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardSkeleton;