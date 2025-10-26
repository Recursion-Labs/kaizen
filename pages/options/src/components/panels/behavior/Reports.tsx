import { cn } from "@extension/ui";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";
import type {
  BehaviorReport,
  ExportFormat,
  ReportCardProps,
  ReportsPanelProps,
  ReportType,
  ReportTypeButtonProps,
} from "./types";
import type React from "react";

const Reports: React.FC<ReportsPanelProps> = ({ theme }) => {
  const [selectedType, setSelectedType] = useState<ReportType>("weekly");
  const [generating, setGenerating] = useState(false);
  const [recentReports, setRecentReports] = useState<BehaviorReport[]>([
    {
      id: "1",
      type: "weekly",
      generatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      period: { start: "2025-10-12", end: "2025-10-18" },
      summary: {
        totalTime: 840,
        productiveTime: 580,
        topSites: [
          { url: "github.com", time: 120 },
          { url: "stackoverflow.com", time: 90 },
        ],
      },
    },
  ]);

  const generateReport = async () => {
    setGenerating(true);
    try {
      // TODO: Implement actual report generation
      // const reportGenerator = new ReportGenerator();
      // const report = await reportGenerator.generateReport({ type: selectedType });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock report
      const newReport: BehaviorReport = {
        id: Date.now().toString(),
        type: selectedType,
        generatedAt: Date.now(),
        period: { start: "2025-10-12", end: "2025-10-19" },
        summary: {
          totalTime: 1020,
          productiveTime: 720,
          topSites: [],
        },
      };

      setRecentReports([newReport, ...recentReports]);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setGenerating(false);
    }
  };

  const exportReport = async (reportId: string, format: ExportFormat) => {
    // TODO: Implement export functionality
    console.log(`Exporting report ${reportId} as ${format}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2
          className={cn(
            "text-2xl font-bold",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Behavior Reports
        </h2>
        <p
          className={cn(
            "text-sm",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
          )}
        >
          Generate and export comprehensive behavior analytics
        </p>
      </div>

      {/* Generate New Report */}
      <div
        className={cn(
          "rounded-lg border p-6",
          theme === "light"
            ? "border-kaizen-border bg-kaizen-surface"
            : "border-kaizen-border bg-kaizen-dark-surface",
        )}
      >
        <h3
          className={cn(
            "mb-4 text-lg font-semibold",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Generate New Report
        </h3>

        {/* Report Type Selection */}
        <div className="mb-4 flex space-x-3">
          <ReportTypeButton
            label="Daily"
            icon={<Calendar className="h-4 w-4" />}
            active={selectedType === "daily"}
            onClick={() => setSelectedType("daily")}
            theme={theme}
          />
          <ReportTypeButton
            label="Weekly"
            icon={<TrendingUp className="h-4 w-4" />}
            active={selectedType === "weekly"}
            onClick={() => setSelectedType("weekly")}
            theme={theme}
          />
          <ReportTypeButton
            label="Monthly"
            icon={<FileText className="h-4 w-4" />}
            active={selectedType === "monthly"}
            onClick={() => setSelectedType("monthly")}
            theme={theme}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateReport}
          disabled={generating}
          className={cn(
            "w-full rounded-lg px-6 py-3 font-semibold transition-colors",
            generating
              ? "cursor-not-allowed bg-kaizen-muted text-kaizen-light-muted"
              : theme === "light"
              ? "bg-kaizen-accent text-kaizen-light-bg hover:bg-kaizen-accent/80"
              : "bg-kaizen-accent-dark text-kaizen-dark-text hover:bg-kaizen-accent/80",
          )}
        >
          {generating
            ? "Generating Report..."
            : `Generate ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Report`}
        </button>
      </div>

      {/* Recent Reports */}
      <div
        className={cn(
          "rounded-lg border p-6",
          theme === "light"
            ? "border-kaizen-border bg-kaizen-surface"
            : "border-kaizen-border bg-kaizen-dark-surface",
        )}
      >
        <h3
          className={cn(
            "mb-4 text-lg font-semibold",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Recent Reports
        </h3>

        {recentReports.length === 0 ? (
          <p
            className={cn(
              "text-center text-sm",
              theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
            )}
          >
            No reports generated yet. Create your first report above!
          </p>
        ) : (
          <div className="space-y-3">
            {recentReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onExport={exportReport}
                theme={theme}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ReportTypeButton: React.FC<ReportTypeButtonProps> = ({
  label,
  icon,
  active,
  onClick,
  theme,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-1 items-center justify-center space-x-2 rounded-lg border px-4 py-3 transition-colors",
      active
        ? theme === "light"
          ? "border-kaizen-accent bg-kaizen-accent/10 text-kaizen-accent"
          : "border-kaizen-accent-dark bg-kaizen-accent-dark/10 text-kaizen-accent-dark"
        : theme === "light"
        ? "border-kaizen-border text-kaizen-light-text hover:bg-kaizen-surface"
        : "border-kaizen-border text-kaizen-dark-text hover:bg-kaizen-dark-surface",
    )}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const ReportCard: React.FC<ReportCardProps> = ({ report, onExport, theme }) => {
  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString();

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        theme === "light"
          ? "border-kaizen-border bg-kaizen-surface"
          : "border-kaizen-border bg-kaizen-dark-surface",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4
            className={cn(
              "font-semibold",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
            )}
          >
            {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
          </h4>
          <p
            className={cn(
              "mt-1 text-sm",
              theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
            )}
          >
            {report.period.start} to {report.period.end}
          </p>
          <p
            className={cn(
              "mt-2 text-xs",
              theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
            )}
          >
            Generated: {formatDate(report.generatedAt)}
          </p>
        </div>

        {/* Export Dropdown */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onExport(report.id, "pdf")}
            className={cn(
              "rounded-lg p-2 transition-colors",
              theme === "light"
                ? "text-kaizen-accent hover:bg-kaizen-accent/10"
                : "text-kaizen-accent-dark hover:bg-kaizen-accent-dark/10",
            )}
            title="Export as PDF"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { Reports };
