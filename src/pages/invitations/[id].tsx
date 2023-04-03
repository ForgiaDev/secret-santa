import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const AcceptInvitationPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: invitation } = api.invitations.get.useQuery({
    invitationId: id,
  });

  const acceptInvitation = api.invitations.accept.useMutation();

  const router = useRouter();

  const onAcceptInvitation = () => {
    void acceptInvitation
      .mutateAsync({ invitationId: id })
      .then((res) => {
        void router.push(`/groups/${res.id}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      Accept invitation page
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={onAcceptInvitation}
      >
        Accept invitation
      </button>
      <pre>{JSON.stringify(invitation, null, 2)}</pre>
    </div>
  );
};

AcceptInvitationPage.getInitialProps = (ctx) => {
  const id = ctx.query.id as string;

  return { id };
};

export default AcceptInvitationPage;
