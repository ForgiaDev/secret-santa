import { type NextPageContext, type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { RouterOutputs, api } from "~/utils/api";
import Pusher from "pusher-js";
import { env } from "~/env.mjs";
import { Message, User } from "@prisma/client";
import { MessageChannel } from "worker_threads";
import Image from "next/image";

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

    channel.bind("new-message", (data: MessageType) => {
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
          {JSON.stringify(
            group,
            Object.keys(group).filter((key) => key !== "messages"),
            2
          )}
        </pre>
        <div className="flex w-1/2 flex-col gap-4">
          <NewMessageForm groupId={id} />

          <div className="flex flex-col gap-4">
            {group.messages
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((message) => (
                <Message key={message.id} message={message} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type MessageType = Message & { author: User };

const Message = ({ message }: { message: MessageType }) => {
  return (
    <div className="flex gap-2">
      {message.author.image && (
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={message.author.image}
            alt={message.author.name ?? "User"}
            fill
          />
        </div>
      )}
      <div>
        <p className="flex gap-2 text-sm">
          <span className="font-bold">{message.author.name}</span>·
          <span className="text-gray-500">
            {message.createdAt.toLocaleString()}
            {/* TODO: use relative time */}
          </span>
        </p>
        <div>{message.content}</div>
      </div>
    </div>
  );
};

const NewMessageForm = ({ groupId }: { groupId: string }) => {
  const [content, setContent] = React.useState("");

  const createMessage = api.groups.postMessage.useMutation();

  return (
    <form
      className="flex w-full gap-4"
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
        className="w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
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
