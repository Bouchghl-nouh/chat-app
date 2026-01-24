import { Skeleton } from "@/components/ui/skeleton";

const ProfileFormSkeleton = () => {
  return (
    <div className="space-y-6 p-10 animate-pulse">
      {/* Avatar */}
      <div className="flex justify-center">
        <Skeleton className="w-44 h-44 rounded-full" />
      </div>

      {/* Fields */}
      <div className="grid grid-cols-8 gap-4">
        <div className="col-span-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="col-span-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="col-span-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="col-span-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="col-span-8 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-30 w-full rounded-md"/>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
};

export default ProfileFormSkeleton;
