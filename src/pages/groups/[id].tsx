import type { Message, User } from "@prisma/client";
import { type NextPage, type NextPageContext } from "next";
import { FloatingChat } from "~/components/chat/FloatingChat";
import { api } from "~/utils/api";
import { useGroupData } from "~/utils/useGroupData";

const GroupPage: NextPage<{ groupId: string }> = ({ groupId }) => {
  const {
    data: group,
    isLoading: isGroupLoading,
    isError: isGroupError,
    refetch: refetchGroup,
  } = useGroupData(groupId);

  const createInvitationLink = api.invitations.create.useMutation({
    onSuccess: () => void refetchGroup(),
  });

  const onCreateInvitationLink = () => {
    void createInvitationLink.mutateAsync({ groupId });
  };

  if (isGroupLoading) return <div>Loading...</div>;
  if (isGroupError || group === null) return <div>Error</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      Group page
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={onCreateInvitationLink}
      >
        Create invitation link
      </button>
      <div className="flex w-full gap-8 p-8">
        <pre className="w-1/2 overflow-hidden">
          {JSON.stringify(
            group,
            Object.keys(group).filter((key) => key !== "messages"),
            2
          )}
        </pre>
      </div>
      <FloatingChat messages={group.messages} groupId={groupId} />
    </div>
  );
};

export type MessageType = Message & { author: User };

GroupPage.getInitialProps = (ctx: NextPageContext) => {
  const id = ctx.query.id as string;

  return { groupId: id };
};

export default GroupPage;
