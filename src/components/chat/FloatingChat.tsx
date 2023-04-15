import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { type MessageType } from "~/pages/groups/[id]/general";
import { api } from "~/utils/api";

export const FloatingChat = ({
  groupId,
  messages,
}: {
  groupId: string;
  messages: MessageType[];
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-8 right-8 flex w-full max-w-sm flex-col items-end justify-end gap-4">
      {isChatOpen && (
        <div className="flex w-full flex-col gap-2 rounded-xl bg-base-300 p-4 pr-2 shadow-lg">
          <div className="flex max-h-96 w-full flex-col-reverse gap-2 overflow-y-auto">
            {messages
              .map((message) => <Message key={message.id} message={message} />)
              .reverse()}
          </div>
          <MessageForm groupId={groupId} />
        </div>
      )}
      <button
        className={clsx("btn-primary  btn-circle btn shadow-lg", {
          "btn-active": isChatOpen,
          // "btn-error": isChatOpen,
        })}
        onClick={toggleChat}
      >
        {isChatOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

const Message = ({ message }: { message: MessageType }) => {
  const { data: session } = useSession();

  const isUser = message.author.id === session?.user.id;

  return (
    <div
      className={clsx("chat w-full", {
        "chat-start": !isUser,
        "chat-end": isUser,
      })}
    >
      {!isUser && (
        <>
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <Image
                src={message.author.image || "/images/avatar.png"}
                alt={message.author.name || "Avatar"}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          </div>
        </>
      )}
      <div className="chat-header pb-0.5">
        {!isUser && `${message.author.name ?? ""} · `}
        <time className="text-xs opacity-50">
          {formatDistanceToNow(message.createdAt)} ago
        </time>
      </div>
      <div className="chat-bubble">{message.content}</div>
    </div>
  );
};

const MessageForm = ({ groupId }: { groupId: string }) => {
  const [content, setContent] = useState("");

  const createMessage = api.groups.postMessage.useMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) return;

    void createMessage.mutateAsync({ groupId, content });
    setContent("");
  };

  return (
    <form className="form-control mr-2" onSubmit={(e) => handleSubmit(e)}>
      <div className="input-group">
        <input
          type="text"
          placeholder="Type here"
          className="input w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="btn-primary btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};
