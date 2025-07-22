'use client';
const getRiskColor = (risk) => {
  switch (risk?.toLowerCase()) {
    case "low":
      return "text-green-400 bg-green-600/20 border-green-500/30";
    case "medium":
      return "text-orange-400 bg-orange-600/20 border-orange-500/50";
    case "high":
      return "text-red-400 bg-red-600/20 border-red-500/50";
    default:
      return "text-neutral-400 bg-neutral-600/20 border-neutral-500/50";
  }
};

const exampleData = [
  {
    id: 3,
    address: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
    chain: "base",
    name: "Virtuals Protocol",
    symbol: "VIRTUAL",
    createdAt: "2025-07-15T12:48:00.711Z",
    updatedAt: "2025-07-15T12:48:00.711Z",
  },
];

const LoadingSkeleton = () => (
  <div className="space-y-2">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg border border-neutral-700/50"
      >
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-neutral-700/50 rounded animate-pulse mb-1 w-32"></div>
          <div className="h-3 bg-neutral-700/50 rounded animate-pulse w-80"></div>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <div className="h-5 w-14 bg-neutral-700/50 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-neutral-700/50 rounded animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

export const LatestCard = ({ data, handleTokenClick, loading }) => {
  return (
    <div className="bg-neutral-900/20 bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-neutral-200 mb-4">Recent Security Audits</h3>
      
      <div className="space-y-2">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {(data || []).map((token, index) => (
              <div
                key={token.id || index}
                className="group flex items-center justify-between p-3 bg-neutral-800/30 hover:bg-neutral-800/50 rounded-lg cursor-pointer transition-all duration-200 border border-neutral-700/50 hover:border-neutral-600/50"
                onClick={() => handleTokenClick(token)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-neutral-200 mb-1">
                    {token.name}
                  </div>
                  <div className="text-xs text-neutral-400 font-mono truncate">
                    {token.address}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  {token.risk && (
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getRiskColor(
                        token.risk
                      )}`}
                    >
                      {token.risk}
                    </div>
                  )}
                  <svg
                    className="w-3 h-3 text-neutral-500 group-hover:text-neutral-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default LatestCard;
