import type { Message, User } from "@prisma/client";
import { type NextPageContext } from "next";
import RecipientDeliveryCard from "~/components/cards/RecipientDeliveryCard";
import SantaDeliveryCard from "~/components/cards/SantaDeliveryCard";
import SantaInfoCard from "~/components/cards/SantaInfoCard";
import { FloatingChat } from "~/components/chat/FloatingChat";
import PrimaryLayout from "~/components/layouts/PrimaryLayout";
import Loading from "~/components/utility/Loading";
import { type NextPageWithLayout } from "~/pages/page";
import { api } from "~/utils/api";
import { useGroupData } from "~/utils/useGroupData";

import Image from "next/image";

const GroupPage: NextPageWithLayout<{ groupId: string }> = ({ groupId }) => {
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

  if (isGroupLoading) return <Loading />;
  if (isGroupError || group === null) return <div>Error</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 rounded-md bg-gradient-to-t from-purple-700 to-green-700 p-20">
      <div className="flex w-full items-center gap-8">
        <div className="flex basis-1/2 flex-col gap-8">
          <RecipientDeliveryCard />
          <SantaDeliveryCard />
        </div>
        <div className="basis-1/2">
          {/* TODO: obtain this from matchings */}
          <SantaInfoCard recipient={group.users[0]!} />
        </div>
      </div>
      <div className="flex w-full flex-col gap-6 rounded-xl bg-base-200 p-6">
        <p className="text-3xl font-semibold">
          {group.users.length}{" "}
          {group.users.length > 1 ? "participants" : "participant"}
        </p>
        <div className="flex flex-wrap gap-4">
          {group.users.map((user, i) => (
            <div
              className="flex items-center gap-2 rounded-md border border-base-100 bg-base-300 px-4 py-2"
              key={i}
            >
              <div className="relative aspect-square w-10 rounded-full border border-base-100 bg-base-100">
                <Image
                  className="rounded-full"
                  src={user.image ?? ""}
                  alt={`${user.name ?? ""}'s avatar`}
                  fill
                />
              </div>
              <p className="text-lg">{user.name}</p>
            </div>
          ))}
        </div>
      </div>

      <p>General page</p>
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={onCreateInvitationLink}
      >
        Create invitation link
      </button>
      <div className="flex w-full gap-8 bg-base-100 p-8">
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

GroupPage.getLayout = (page) => {
  return <PrimaryLayout groupPage>{page}</PrimaryLayout>;
};
