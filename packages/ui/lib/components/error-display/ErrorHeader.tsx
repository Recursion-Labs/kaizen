import { t } from "@extension/i18n";
import { AlertTriangle } from "lucide-react";

export const ErrorHeader = () => (
  <div className="text-center">
    <AlertTriangle className="mx-auto h-24 w-24 text-red-500" />
    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
      {t("displayErrorInfo")}
    </h2>
    <p className="mt-2 text-sm text-gray-600">
      {t("displayErrorDescription")}.
    </p>
  </div>
);
