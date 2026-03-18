export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <header className="border-b border-gray-100 h-[60px] bg-white" />
      <div className="mx-auto max-w-[900px] px-6 py-12">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
        <div className="grid gap-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-6">
              <div className="h-4 w-24 bg-gray-100 rounded mb-3" />
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-full bg-gray-100 rounded mb-1" />
              <div className="h-4 w-2/3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
