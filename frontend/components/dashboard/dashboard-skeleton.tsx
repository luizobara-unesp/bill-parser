import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="w-full p-6 mx-auto">
      <div className="flex justify-between items-center mb-6 px-4 lg:px-6">
        <Skeleton className="h-8 w-64" />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
              <Skeleton className="h-[180px] rounded-xl" />
              <Skeleton className="h-[180px] rounded-xl" />
              <Skeleton className="h-[180px] rounded-xl" />
              <Skeleton className="h-[180px] rounded-xl" />
            </div>

            <div className="px-4 lg:px-6">
              <Skeleton className="h-[350px] w-full rounded-xl" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}