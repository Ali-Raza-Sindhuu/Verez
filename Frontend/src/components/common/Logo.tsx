export function VexezMark({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="grid grid-cols-2 gap-[3px]">
        <span className="h-[6px] w-[6px] rounded-full bg-[#3D6DF2]" />
        <span className="h-[6px] w-[6px] rounded-full bg-[#14151A]" />
        <span className="h-[6px] w-[6px] rounded-full bg-[#14151A]" />
        <span className="h-[6px] w-[6px] rounded-full bg-[#14151A]" />
      </div>
      <span className="font-semibold tracking-tight text-[#14151A] text-[15px]">Vexez</span>
    </div>
  );
}