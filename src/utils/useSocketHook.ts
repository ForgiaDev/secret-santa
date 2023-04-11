import Pusher from "pusher-js";
import { useEffect } from "react";
import { env } from "~/env.mjs";

const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: "eu",
});

export const useSocket = <T>({
  channelName,
  eventName,
  callback,
  context,
}: {
  eventName: string;
  channelName: string;
  callback: (data: T) => void;
  context?: any;
}) => {
  return useEffect(() => {
    const channel = pusher.subscribe(channelName);

    channel.bind(eventName, callback, context);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [eventName, channelName, callback, context]);
};
