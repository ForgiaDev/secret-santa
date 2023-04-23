import { type Group, type User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const GroupCard: React.FC<{
  group: Group & {
    users: User[];
  };
}> = ({ group }) => {
  return (
    <Link
      href={`/groups/${group.id}/general`}
      className="btn-ghost flex h-32 items-center gap-8 rounded-full border border-base-300 bg-base-100 px-8 py-5 font-bold"
    >
      {/* Group pic */}
      <div className="aspect-square h-full rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-600"></div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <h3 className="text-4xl tracking-wide">{group.name}</h3>
          <p className="text-sm">
            <span className="uppercase tracking-widest text-white">
              {group.users.length} participants
            </span>{" "}
            • <span>{group.users.map((user) => user.name).join(", ")}</span>
          </p>
        </div>
        {group.description && (
          <p className="pr-8 text-sm italic text-gray-600">
            &quot;{group.description}&quot;
          </p>
        )}
      </div>
    </Link>
  );
};

export default GroupCard;
