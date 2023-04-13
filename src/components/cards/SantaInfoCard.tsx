import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

const SantaInfoCard: React.FC<{ recipient: User }> = ({ recipient }) => {
  const [hide, setHide] = useState(true);
  const { data } = useSession();
  return (
    <div className="flex flex-col gap-8 rounded-xl bg-base-200 p-6">
      <div className="flex justify-between">
        <p className="text-3xl font-semibold">Your recipient:</p>
        <button className="btn" onClick={() => setHide(!hide)}>
          {hide ? "show" : "hide"}
        </button>
      </div>
      <div className="flex items-center gap-10 text-2xl">
        <Image
          src={data?.user.image ?? ""}
          alt="profile pic"
          width={1000}
          height={1000}
          className={`aspect-square w-20 overflow-hidden rounded-full ${
            hide ? "blur-xl" : ""
          }`}
        />
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-end gap-2">
            <p>Name:</p>
            <p>Address: </p>
          </div>
          <div className={`flex flex-col gap-2 ${hide ? "blur" : ""}`}>
            <p>{recipient.name}</p>
            <p>{recipient.id}</p>
          </div>
        </div>
      </div>
      <div className="w-full rounded-md bg-base-100 px-4 py-2">
        <div className="inline-flex items-center gap-2">
          <span className="text-xl font-semibold text-purple-400">NB:</span>
          <p>
            don&apos;t show this information to anyone else, that&apos;s a
            secret! 🤫
          </p>
        </div>
      </div>
    </div>
  );
};

export default SantaInfoCard;
