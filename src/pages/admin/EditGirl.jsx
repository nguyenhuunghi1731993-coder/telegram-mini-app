import GirlForm from "./GirlForm";

export default function EditGirl() {
  return (
    <div className="max-w-5xl">
      <h1 className="mb-2 text-3xl font-bold">
        Edit Girl
      </h1>

      <p className="mb-8 text-zinc-500">
        Update profile, images and videos
      </p>

      <GirlForm mode="edit" />
    </div>
  );
}