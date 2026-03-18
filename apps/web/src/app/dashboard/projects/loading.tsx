export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-40 bg-gray-100" />
              <div className="p-4">
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
                <div className="flex gap-2 mt-4">
                  <div className="h-8 w-20 bg-gray-100 rounded-lg" />
                  <div className="h-8 w-20 bg-gray-100 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
