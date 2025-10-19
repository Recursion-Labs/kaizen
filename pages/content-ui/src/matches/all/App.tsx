import { t } from "@extension/i18n";
import { exampleThemeStorage } from "@extension/storage";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("[CEB] Content ui all loaded");
  }, []);

  return (
    <div className="flex items-center justify-between gap-2 rounded bg-blue-100 px-2 py-1">
      <div className="flex gap-1 text-sm text-blue-500">
        Edit{" "}
        <strong className="text-blue-700">
          pages/content-ui/src/matches/all/App.tsx
        </strong>{" "}
        and save to reload.
      </div>
      <button
        onClick={() => exampleThemeStorage.toggle()}
        className="mt-0 rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        {t("toggleTheme")}
      </button>
    </div>
  );
}
