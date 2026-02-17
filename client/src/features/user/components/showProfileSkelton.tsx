import { Skeleton } from "@/components/ui/skeleton";

const DisplayProfileSkelton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 mt-4 space-y-6">
      
      {/* Header Section Mirror */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          {/* Avatar Circle */}
          <Skeleton className="w-20 h-20 sm:w-32 sm:h-32 rounded-full" />
          
          {/* Title and Subtitle */}
          <div className="hidden sm:block space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
        </div>
      </div>

      {/* Fields Grid Mirror */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

        {/* Username */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Bio (Span 2) */}
        <div className="lg:col-span-2 space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default DisplayProfileSkelton;