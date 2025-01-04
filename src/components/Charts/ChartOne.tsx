import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks/hooks";
import { getRevenueByPeriodThunk } from "@/lib/services/transaction/transaction";
import { AppDispatch } from "@/hooks/store";

const RevenueDisplay: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day'); // Périodes simplifiées : jour ou mois
  const revenueData = useAppSelector((state) => state.transaction);

  useEffect(() => {
    console.log(`Fetching data for period: ${period}`);
    dispatch(getRevenueByPeriodThunk(period));
  }, [period, dispatch]);
  
  useEffect(() => {
    console.log("Revenue Data:", revenueData);
  }, [revenueData]);
  

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-lg">Revenue</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className={`px-3 py-1 text-sm font-medium rounded ${
              period === "day" ? "bg-primary text-white" : "bg-gray-200"
            }`}
            onClick={() => setPeriod("day")}
          >
            Jour
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium rounded ${
              period === "week" ? "bg-primary text-white" : "bg-gray-200"
            }`}
            onClick={() => setPeriod("week")}
          >
            Semaine
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium rounded ${
              period === "month" ? "bg-primary text-white" : "bg-gray-200"
            }`}
            onClick={() => setPeriod("month")}
          >
            Mois
          </button>
        </div>
      </div>

      <div className="mt-5">
       
          <div className="text-center">
            <h3 className="text-2xl font-bold">
              Revenue Totale : {revenueData.transactionDetails?.totalRevenue || 0}
            </h3>
          </div>
       
      </div>
    </div>
  );
};

export default RevenueDisplay;
