import { type NextPageContext, type NextPage } from "next";
import { api } from "~/utils/api";

const GroupPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: group, refetch } = api.groups.get.useQuery({ id });

  const crateInvitationLink = api.invitations.create.useMutation();

  const onCreateInvitationLink = () => {
    void crateInvitationLink
      .mutateAsync({ groupId: id })
      .then(() => void refetch())
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      Group page
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={onCreateInvitationLink}
      >
        Create invitation link
      </button>
      <pre>{JSON.stringify(group, null, 2)}</pre>
    </div>
  );
};

GroupPage.getInitialProps = (ctx: NextPageContext) => {
  const id = ctx.query.id as string;

  return { id };
};

export default GroupPage;
