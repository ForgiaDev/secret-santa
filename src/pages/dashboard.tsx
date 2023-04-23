import CreateGroupButton from "~/components/buttons/CreateGroupButton";
import GroupCard from "~/components/cards/GroupCard";
import PrimaryLayout from "~/components/layouts/PrimaryLayout";
import Loading from "~/components/utility/Loading";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "./page";

const Dashboard: NextPageWithLayout = () => {
  const { data: groups, isLoading, isError } = api.groups.getAll.useQuery();
  const numGroups = groups?.length ?? 0;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <>
      {/* <Navbar /> */}
      {numGroups > 0 ? (
        <div className="flex flex-col gap-10 bg-red-100 p-16 text-3xl">
          <div className="flex w-full items-center gap-10 bg-purple-100 font-bold text-black">
            <h2>You have {numGroups} groups</h2>
            <CreateGroupButton />
          </div>
          <GroupView />
        </div>
      ) : (
        <div className="">You have no groups yet.</div>
      )}
    </>
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

Dashboard.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

Dashboard.requireAuth = true;
