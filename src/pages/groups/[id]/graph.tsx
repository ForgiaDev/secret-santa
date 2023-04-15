import type { Message, User } from "@prisma/client";
import { type NextPage, type NextPageContext } from "next";
import { FloatingChat } from "~/components/chat/FloatingChat";
import PrimaryLayout from "~/components/layouts/PrimaryLayout";
import { api } from "~/utils/api";
import { useGroupData } from "~/utils/useGroupData";
import { type NextPageWithLayout } from "../../page";

const GraphPage: NextPageWithLayout<{ groupId: string }> = ({ groupId }) => {
  const {
    data: group,
    isLoading: isGroupLoading,
    isError: isGroupError,
    refetch: refetchGroup,
  } = useGroupData(groupId);

  if (isGroupLoading) return <div>Loading...</div>;
  if (isGroupError || group === null) return <div>Error</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      Graph page
      <FloatingChat messages={group.messages} groupId={groupId} />
    </div>
  );
};

export type MessageType = Message & { author: User };

GraphPage.getInitialProps = (ctx: NextPageContext) => {
  const id = ctx.query.id as string;

  return { groupId: id };
};

export default GraphPage;

GraphPage.getLayout = (page) => {
  return <PrimaryLayout groupPage>{page}</PrimaryLayout>;
};
