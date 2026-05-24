import InfoNavigation from "../InfoNavigation";
import KpiGaugeChart from "./KpiGaugeChart";
import KPIProgressTable from "./KPIProgressTable";
import PerformancePieChart from "./PerformancePieChart";
import useThemeStore from "../../store/themeStore";

function Dashboard() {
  const dark = useThemeStore((state) => state.dark);

  return (
    <div
      className={`w-full h-full overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 transition-colors duration-300 ${
        dark ? "bg-gray-900 text-white" : "bg-[rgba(13,42,92,0.08)] text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">

        {/* Summary cards — Goals, KRAs, KPIs counts */}
        <InfoNavigation />

        {/* Charts */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <PerformancePieChart />
          <KpiGaugeChart />
        </div>

        {/* KPI Progress Table */}
        <KPIProgressTable />

      </div>
    </div>
  );
}

export default Dashboard;
