export const Header = ({
  email,
  logout,
}: {
  email: string | null;
  logout: () => void;
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="mt-2 text-3xl font-semibold">Your Metrics</h1>
      </div>
      <div>
        <span className="px-3 py-1 rounded-full bg-slate-800 text-sm text-slate-300">
          {email}
        </span>
        <button className="px-3" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};
