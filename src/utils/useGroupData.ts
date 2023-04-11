import { Message, User } from "@prisma/client";
import { api } from "~/utils/api";
import { useSocket } from "~/utils/useSocketHook";

type SocketMessageType = Omit<Message, "createdAt"> & {
  author: User;
  createdAt: string;
};

export const useGroupData = (id: string) => {
  const query = api.groups.get.useQuery({ id });

  const apiContext = api.useContext();

  useSocket<SocketMessageType>({
    channelName: `group-${id}`,
    eventName: "new-message",
    callback: (data) => {
      apiContext.groups.get.setData({ id }, (group) => {
        if (!group) return group;

        return {
          ...group,
          messages: [
            ...group.messages,
            { ...data, createdAt: new Date(data.createdAt) },
          ],
        };
      });
    },
  });

  return query;
};
