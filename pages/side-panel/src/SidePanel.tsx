import "@src/SidePanel.css";
import RestructuredSidePanel from "./components/RestructuredSidePanel";
import { useStorage, withErrorBoundary, withSuspense } from "@extension/shared";
import { exampleThemeStorage } from "@extension/storage";
import { ErrorDisplay, LoadingSpinner } from "@extension/ui";

const SidePanel = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const theme = isLight ? "light" : "dark";

  // Apply theme class on documentElement for CSS variables
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }

  return (
    <div className={theme === "dark" ? "dark" : "light"}>
      <RestructuredSidePanel theme={theme} />
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(SidePanel, <LoadingSpinner />),
  ErrorDisplay,
);
