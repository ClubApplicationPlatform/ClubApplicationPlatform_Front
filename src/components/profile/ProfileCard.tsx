import React from "react";
import type { User } from "../../types/user";
import Avatar from "../common/Avatar";

export default function ProfileCard({ user }: { user: User }) {
  return (
    <section className="flex items-center gap-4 p-6 bg-brandBlue text-white">
      <Avatar src={user.avatarUrl ?? null} alt={user.name} size={72} />
      <div>
        <h2 className="text-xl font-bold">{user.name} ✍</h2>
        {user.studentId && <p className="text-sm opacity-90">{user.studentId}</p>}
        {user.major && <p className="text-sm opacity-90">{user.major}</p>}
      </div>
      <div className="ml-auto bg-blue-900 px-4 py-2 rounded-lg text-sm shadow hidden md:block">
        <p>전공 동아리 : <span className="font-semibold">{user.majorClub?.name ?? "(없음)"}</span></p>
        <p>일반 동아리 : <span>{user.generalClub?.name ?? "(없음)"}</span></p>
      </div>
    </section>
  );
}
