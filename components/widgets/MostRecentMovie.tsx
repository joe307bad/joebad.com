export default function MostRecentMovie({ title, description, thumbnail }) {
  return (
    <div className="max-w-sm rounded overflow-hidden border-2 border-sky-500">
      <img src={thumbnail} alt="Sunset in the mountains" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
    </div>
  );
}
