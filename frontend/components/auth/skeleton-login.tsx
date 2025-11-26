import { Skeleton } from "@/components/ui/skeleton"

export function LoginSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <Skeleton className="h-8 w-3/4" />
        </div>
        
        <div className="space-y-6">
          <div>
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div>
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
    </div>
  )
}