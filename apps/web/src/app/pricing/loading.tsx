export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <header className="bg-white border-b border-gray-200 h-[60px]" />
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="text-center mb-16">
          <div className="h-4 w-24 bg-gray-200 rounded mx-auto mb-4" />
          <div className="h-10 w-80 bg-gray-200 rounded mx-auto mb-4" />
          <div className="h-4 w-64 bg-gray-200 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="h-5 w-20 bg-gray-200 rounded mb-4" />
              <div className="h-10 w-32 bg-gray-200 rounded mb-6" />
              {[0, 1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 w-full bg-gray-100 rounded mb-3" />
              ))}
              <div className="h-12 w-full bg-gray-200 rounded-xl mt-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
