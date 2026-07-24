import GirlForm from "./GirlForm";

export default function AddGirl() {
  return (
    <div className="max-w-5xl">
      <h1 className="mb-8 text-3xl font-bold">
        Add Girl
      </h1>

      <GirlForm mode="add" />
    </div>
  );
}