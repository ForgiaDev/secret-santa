import { format } from "date-fns";

const SantaDeliveryCard: React.FC = () => {
  const deliveryDay = format(new Date(), "dd MMMM yyyy");

  return (
    <div className="flex flex-col items-center gap-10 rounded-xl bg-base-200 p-6">
      <p className="text-3xl">Updates from your Secret Santa</p>
      <ul className="steps w-full">
        <li className="step-primary step">Ordered</li>
        <li className="step">Shipped</li>
        <li className="step">Arrived</li>
      </ul>

      <p className="font-semibold">Estimated delivery: {deliveryDay}</p>
    </div>
  );
};

export default SantaDeliveryCard;
