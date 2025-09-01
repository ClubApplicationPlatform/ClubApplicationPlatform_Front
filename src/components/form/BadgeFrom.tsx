export type Tone = "neutral" | "blue" | "gray";
interface BadgeProps { children: React.ReactNode; tone?: Tone }


function Badge({ children, tone = "neutral" }: BadgeProps) {
  const map: Record<Tone, string> = {
    neutral: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-200 text-gray-700",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${map[tone]}`}>{children}</span>
  );
}



export default Badge;