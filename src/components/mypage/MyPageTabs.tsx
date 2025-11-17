import { cn } from "../../ui/utils";

interface TabItem {
  id: string;
  label: string;
}

interface MyPageTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function MyPageTabs({ tabs, activeTab, onChange }: MyPageTabsProps) {
  return (
    <div className="mb-6 grid w-full grid-cols-3 gap-2 rounded-lg bg-gray-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-md px-3 py-2 text-center text-sm font-medium transition-all",
            activeTab === tab.id ? "bg-white shadow-sm" : "hover:bg-gray-200"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

