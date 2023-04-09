import { type NextPageContext, type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { api } from "~/utils/api";
import Pusher from "pusher-js";
import { env } from "~/env.mjs";
import { Message } from "@prisma/client";

const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: "eu",
});

const GroupPage: NextPage<{ id: string }> = ({ id }) => {
  const {
    data: group,
    isLoading: isGroupLoading,
    isError: isGroupError,
    refetch,
  } = api.groups.get.useQuery({ id });

  const crateInvitationLink = api.invitations.create.useMutation();
  const apiContext = api.useContext();

  const onCreateInvitationLink = () => {
    void crateInvitationLink
      .mutateAsync({ groupId: id })
      .then(() => void refetch())
      .catch((err) => {
        console.error(err);
      });
  };

  React.useEffect(() => {
    const channel = pusher.subscribe(`group-${id}`);

    channel.bind("new-message", (data: Message) => {
      apiContext.groups.get.setData({ id }, (group) => {
        if (!group) return group;

        return {
          ...group,
          messages: [...group.messages, data],
        };
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [id]);

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
          {JSON.stringify(group, null, 2)}
        </pre>
        <div>
          Chat
          {group.messages.map((message) => (
            <div key={message.id}>{message.content}</div>
          ))}
          <NewMessageForm groupId={id} />
        </div>
      </div>
    </div>
  );
};

const NewMessageForm = ({ groupId }: { groupId: string }) => {
  const [content, setContent] = React.useState("");

  const createMessage = api.groups.postMessage.useMutation();

  return (
    <form
      className="flex gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        void createMessage
          .mutateAsync({ groupId, content })
          .then(() => void setContent(""))
          .catch((err) => {
            console.error(err);
          });
      }}
    >
      <input
        className="rounded border border-gray-300 px-4 py-2"
        value={content}
        onChange={(e) => void setContent(e.target.value)}
      />
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        type="submit"
      >
        Send
      </button>
    </form>
  );
};

GroupPage.getInitialProps = (ctx: NextPageContext) => {
  const id = ctx.query.id as string;

  return { id };
};

export default GroupPage;
