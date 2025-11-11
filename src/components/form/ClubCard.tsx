import type { Club } from "../../types/club";
import  UsersIcon  from "../ui/UsersIcon";
import Badge from "./BadgeFrom";

// replaceAll 대신 정규식으로 안전 처리
const toDateAttr = (s: string) => s.replace(/\./g, "-");

function ClubCard({ club }: { club: Club }) {
  console.log(club);


  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
      <div className="h-22 w-full bg-gray-200" />

      <div className="space-y-2 p-4">
        <h3 className="text-lg font-semibold text-gray-900">{club.name}</h3>
        <p className="text-sm text-gray-500">{club.summary}</p>

        <div className="flex items-center gap-2 pt-1">
          <Badge tone={club.status === "모집중" ? "blue" : "gray"}>{club.status}</Badge>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <UsersIcon />
            <span aria-label="members count">{club.members}</span>
          </div>
          <time dateTime={toDateAttr(club.updated)}>{club.updated}</time>
        </div>
      </div>
    </article>
  );
}

export default ClubCard;
