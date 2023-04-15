import type { User } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

const SantaInfoCard: React.FC<{ recipient: User }> = ({ recipient }) => {
  const [hide, setHide] = useState(true);

  return (
    <div className="flex flex-col gap-12 rounded-xl bg-base-200 p-12">
      <div className="flex justify-between">
        <p className="text-3xl font-semibold">Your recipient:</p>
        <button
          className={clsx("btn w-32", { "btn-active": !hide })}
          onClick={() => setHide(!hide)}
        >
          {hide ? "show" : "hide"}
        </button>
      </div>
      <div className="flex items-center gap-8 text-2xl">
        <Image
          src={recipient.image ?? ""}
          alt="profile pic"
          width={1000}
          height={1000}
          className={`aspect-square w-20 flex-none overflow-hidden rounded-full ${
            hide ? `blur-lg` : "animate-unblur_img"
          }`}
        />
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-end gap-2 font-bold">
            <p>Name:</p>
            <p>Address: </p>
          </div>
          <div
            className={`flex flex-col gap-2 ${
              hide ? "blur" : "animate-unblur"
            }`}
          >
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
