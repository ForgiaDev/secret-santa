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
        <div className="flex flex-col gap-10 bg-base-200 p-16 text-3xl">
          <div className="flex w-full items-center justify-between gap-10 font-bold text-white">
            <h2>You have {numGroups} groups :</h2>
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
    <ul className="flex flex-col gap-8">
      {groups.map((group) => (
        <li key={group.id}>
          <GroupCard group={group} />
        </li>
      ))}
    </ul>
  );
};

Dashboard.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

Dashboard.requireAuth = true;
