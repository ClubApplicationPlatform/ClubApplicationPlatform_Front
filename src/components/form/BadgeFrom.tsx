export type Tone = "neutral" | "blue" | "gray";
interface BadgeProps { children: React.ReactNode; tone?: Tone }


function Badge({ children, tone = "neutral" }: BadgeProps) {
  const map: Record<Tone, string> = {
    neutral: "bg-gray-100 text-gray-700",
    blue: "bg-[#054FCC] text-white",
    gray: "bg-[#4C4C4C] text-white",
  };
  return (
    <span className={`inline-flex text-[10px] items-center rounded-md px-2 py-0.5 text-xs font-medium ${map[tone]}`}>{children}</span>
  );
}



export default Badge;