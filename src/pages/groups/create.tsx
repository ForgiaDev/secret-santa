import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { api } from "~/utils/api";

// TODO: Add form validation
const CreateGroup: NextPage = () => {
  const createGroup = api.groups.create.useMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  console.log(image);

  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    void createGroup
      .mutateAsync({ name, description, image })
      .then((res) => {
        void router.push(`/groups/${res.id}`);
      })
      .catch((err) => {
        // TODO: Handle error
        console.error(err);
      });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      {/* Title */}
      <h1 className="text-3xl font-medium tracking-wide">
        Create a{" "}
        <span className="relative bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text px-4 text-transparent">
          <span className="absolute left-0 top-0 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-sm text-transparent">
            ✨
          </span>
          new
          <span className="absolute right-0 top-0 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-sm text-transparent">
            ✨
          </span>
        </span>{" "}
        group
      </h1>

      <form
        className="form-control flex w-1/2 flex-col gap-8 rounded-xl border border-gray-600 bg-base-200 p-4"
        onSubmit={onSubmit}
      >
        <div className="flex items-center justify-center gap-4">
          <div className="flex basis-2/3 flex-col gap-8">
            {/* Name */}
            <div className="flex flex-col">
              <label htmlFor="name" className="label">
                Group name
              </label>
              <input
                className="input rounded-md border border-gray-600 bg-base-100 p-2"
                placeholder="e.g. My Secret Santa"
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label htmlFor="description" className="label">
                Group description
              </label>
              <textarea
                className="resize-none rounded-md border border-gray-600 bg-base-100 p-2"
                placeholder="e.g. Best Secret Santa ever"
                name="description"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex w-full basis-1/3 flex-col gap-4">
            <input
              type="file"
              id="group-pic"
              accept="image/*"
              onChange={(e) => {
                const img = e.target.files?.[0] ?? "";
                if (!img) {
                  setImage("");
                } else {
                  setImage(
                    URL.createObjectURL(
                      e.target.files?.[0] ?? new MediaSource()
                    )
                  );
                }
              }}
              hidden
            />
            <label htmlFor="group-pic" className="px-8">
              {!image ? (
                <div className="flex aspect-square w-full items-center justify-center gap-2 rounded-lg border-4 border-dashed border-gray-600 ">
                  <BiImageAdd color="#4b5563" size={30} />
                  <p className="font-bold uppercase text-gray-600">add image</p>
                </div>
              ) : (
                <div className="group/img relative">
                  <Image
                    src={image}
                    alt="group image"
                    width={1000}
                    height={1000}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <div className=" absolute top-0 flex aspect-square w-full items-center justify-center rounded-lg transition-colors group-hover/img:bg-black/50 group-hover/img:backdrop-blur-sm">
                    <p className="hidden font-bold uppercase text-white group-hover/img:block">
                      change image
                    </p>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>
        <button
          className="btn rounded-md bg-gradient-to-br from-green-500 to-green-700 px-4 py-2 font-bold text-white"
          type="submit"
        >
          Create group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
