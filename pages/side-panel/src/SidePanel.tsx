import "@src/SidePanel.css";
import { ChatInterface } from "./components/ChatInterface";
import { useStorage, withErrorBoundary, withSuspense } from "@extension/shared";
import { exampleThemeStorage } from "@extension/storage";
import { cn, ErrorDisplay, LoadingSpinner } from "@extension/ui";

const SidePanel = () => {
  const { isLight } = useStorage(exampleThemeStorage);

  return (
    <div
      className={cn(
        "flex flex-col h-screen w-full",
        isLight ? "bg-slate-50" : "bg-gray-900",
      )}
    >
      <ChatInterface theme={isLight ? "light" : "dark"} />
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(SidePanel, <LoadingSpinner />),
  ErrorDisplay,
);
