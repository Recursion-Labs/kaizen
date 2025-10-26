import "@src/Options.css";
import { SettingsDashboard } from "./components/SettingsDashboard";
import { useStorage, withErrorBoundary, withSuspense } from "@extension/shared";
import { exampleThemeStorage } from "@extension/storage";
import { cn, ErrorDisplay, LoadingSpinner } from "@extension/ui";

const Options = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const isDark = !isLight;

  return (
    <div
      className={cn(
        "w-screen h-screen overflow-hidden",
        isLight ? "bg-kaizen-light-bg" : "bg-kaizen-dark-bg",
        isDark && "dark",
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
