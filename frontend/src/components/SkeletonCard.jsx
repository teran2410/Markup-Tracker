// components/SkeletonCard.jsx

const SkeletonCard = () => (
  <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
    <div className="p-4 pl-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-5 w-16 bg-secondary rounded-md" />
        <div className="h-4 w-12 bg-secondary rounded" />
      </div>
      <div className="h-5 w-3/4 bg-secondary rounded" />
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-secondary" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-16 bg-secondary rounded" />
          <div className="h-4 w-28 bg-secondary rounded" />
        </div>
      </div>
      <div className="h-px bg-border" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="h-3 w-20 bg-secondary rounded" />
          <div className="h-4 w-14 bg-secondary rounded" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-12 bg-secondary rounded" />
          <div className="h-4 w-16 bg-secondary rounded" />
        </div>
      </div>
    </div>
  </div>
);

const SkeletonTable = () => (
  <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
    <div className="p-3 border-b border-border flex gap-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-4 flex-1 bg-secondary rounded" />)}
    </div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="p-3 border-b border-border/50 flex gap-4">
        {[...Array(6)].map((_, j) => <div key={j} className="h-4 flex-1 bg-secondary/60 rounded" />)}
      </div>
    ))}
  </div>
);

export { SkeletonCard, SkeletonTable };
export default SkeletonCard;
