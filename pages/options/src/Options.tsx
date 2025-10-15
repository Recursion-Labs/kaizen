import "@src/Options.css";
import { useStorage, withErrorBoundary, withSuspense } from "@extension/shared";
import { exampleThemeStorage } from "@extension/storage";
import { cn, ErrorDisplay, LoadingSpinner } from "@extension/ui";
import { SettingsDashboard } from "./components/SettingsDashboard";

const Options = () => {
  const { isLight } = useStorage(exampleThemeStorage);

  return (
    <div
      className={cn(
        "w-full h-screen overflow-hidden",
        isLight ? "bg-slate-50" : "bg-gray-900",
      )}
    >
      <SettingsDashboard theme={isLight ? "light" : "dark"} />
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Options, <LoadingSpinner />),
  ErrorDisplay,
);
