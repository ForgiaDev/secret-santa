import { type Group, type User } from "@prisma/client";
import Link from "next/link";

const GroupCard: React.FC<{
  group: Group & {
    users: User[];
  };
}> = ({ group }) => {
  return (
    <div className="tooltip tooltip-bottom" data-tip={group.description}>
      <Link
        href={`/groups/${group.id}/general`}
        className="flex items-center gap-3 rounded border-2 border-black bg-white px-4 py-2 font-bold text-black hover:bg-blue-100"
      >
        {/* Group pic */}
        <div className="aspect-square w-12 rounded-full bg-purple-500"></div>

        <div className="flex flex-col gap-1">
          <h3>{group.name}</h3>
          <p className="text-sm">{group.users.length} participants</p>
        </div>
      </Link>
    </div>
  );
};

export default GroupCard;
