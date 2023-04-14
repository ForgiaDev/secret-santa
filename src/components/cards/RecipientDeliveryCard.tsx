const RecipientDeliveryCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-10 rounded-xl bg-base-200 p-6">
      <p className="text-3xl">Update your recipient!</p>
      <ul className="steps w-full">
        <li className="step-primary step">Ordered</li>
        <li className="step-primary step">Shipped</li>
        <li className="step hover:step-primary">Delivered</li>
      </ul>
      <form
        onSubmit={() => console.log("Save estimated delivery")}
        className="flex items-center gap-4"
      >
        <label className="font-semibold" htmlFor="estimated-delivery">
          Estimated delivery:
        </label>
        <input type="date" id="estimated-delivery" />
        <button className="btn">Save</button>
      </form>
    </div>
  );
};

export default RecipientDeliveryCard;
