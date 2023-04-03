import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

// TODO: Add form validation
const CreateGroup: NextPage = () => {
  const createGroup = api.groups.create.useMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    void createGroup
      .mutateAsync({ name, description })
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
      Group creation page
      <form
        className="flex w-1/2 flex-col gap-8 rounded-xl border border-gray-300 bg-gray-200 p-4"
        onSubmit={onSubmit}
      >
        <label htmlFor="name">Group name</label>
        <input
          className="rounded-md border border-gray-300 bg-white p-2"
          placeholder="e.g. My Secret Santa"
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="description">Group description</label>
        <textarea
          className="rounded-md border border-gray-300 bg-white p-2"
          placeholder="e.g. Best Secret Santa ever"
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          type="submit"
        >
          Create group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
