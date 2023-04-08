import Link from "next/link";

const CreateGroupButton: React.FC = () => {
  return (
    <Link
      className="rounded border-2 border-black bg-yellow-100 px-4 py-2 font-bold text-black hover:bg-blue-100"
      href="/groups/create"
    >
      Create a group
    </Link>
  );
};

export default CreateGroupButton;
