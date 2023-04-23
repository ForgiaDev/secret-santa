import Link from "next/link";

const CreateGroupButton: React.FC = () => {
  return (
    <Link
      className="btn-ghost btn rounded border border-gray-500 bg-base-100 px-4 py-2 text-lg font-bold shadow-lg"
      href="/groups/create"
    >
      Create a group
    </Link>
  );
};

export default CreateGroupButton;
