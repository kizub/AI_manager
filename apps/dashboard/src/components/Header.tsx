export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div className="text-sm text-gray-500">
        Welcome back, <span className="font-medium text-gray-900">Admin</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
          AD
        </div>
      </div>
    </header>
  );
}
