import { group } from "console";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CreateGroupButton from "~/components/buttons/CreateGroupButton";
import GroupCard from "~/components/cards/GroupCard";
import { api } from "~/utils/api";

const Dashboard: NextPage = () => {
  //const { data: session, status } = useSession();
  const { data: groups, isLoading, isError } = api.groups.getAll.useQuery();
  const numGroups = groups?.length ?? 0;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <div className="h-full">
      {numGroups > 0 ? (
        <div className="flex h-full flex-col gap-10 bg-red-100 p-16 text-3xl">
          <div className="flex w-full items-center gap-10 bg-purple-100 font-bold text-black">
            <h2>You have {numGroups} groups</h2>
            <CreateGroupButton />
          </div>
          <GroupView />
        </div>
      ) : (
        <div className="">You have no groups yet.</div>
      )}
    </div>
  );
};

export default Dashboard;

const GroupView = () => {
  const { data: groups, isLoading, isError } = api.groups.getAll.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <ul className="flex flex-row gap-4">
        {groups.map((group) => (
          <li key={group.id}>
            <GroupCard group={group} />
          </li>
        ))}
      </ul>
    </div>
  );
};
