"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import Link from "next/link";
import { setting } from "@/config/setting";
import axiosInstance from "@/config/instanceAxios";


const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const Academy: React.FC = () => {

  const [stats, setStats] = useState({
    totalEvents: 0,
    totalCategories: 0,
    totalCoaches: 0,
    totalPlayers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const eventsResponse = await axiosInstance.get("events");
        const categoriesResponse = await axiosInstance.get("categories");
        const coachesResponse = await axiosInstance.get("coaches");
        const playersResponse = await axiosInstance.get("players");

        setStats({
          totalEvents: eventsResponse.data.length,
          totalCategories: categoriesResponse.data.length,
          totalCoaches: coachesResponse.data.length,
          totalPlayers: playersResponse.data.length,
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };

    fetchStats();
  }, []);
  return (
    <>
      <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Raccourcis
          </h3>
        </div>

        <div className="p-2 md:p-4 xl:p-7">
          <div className="mb-7 flex flex-wrap gap-4 xl:gap-4">

          <Link
              href={setting.routes.Category}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary px-8 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-"
            >
              <span>
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C12.55 2 13 2.45 13 3V11H21C21.55 11 22 11.45 22 12C22 12.55 21.55 13 21 13H13V21C13 21.55 12.55 22 12 22C11.45 22 11 21.55 11 21V13H3C2.45 13 2 12.55 2 12C2 11.45 2.45 11 3 11H11V3C11 2.45 11.45 2 12 2Z"
                    fill=""
                  />
                </svg>
            </span>

              Catégorie
              
            </Link>

            <Link
              href={setting.routes.AddCoach}
              className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-7 xl:px-6"
            >
              <span>
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C12.55 2 13 2.45 13 3V11H21C21.55 11 22 11.45 22 12C22 12.55 21.55 13 21 13H13V21C13 21.55 12.55 22 12 22C11.45 22 11 21.55 11 21V13H3C2.45 13 2 12.55 2 12C2 11.45 2.45 11 3 11H11V3C11 2.45 11.45 2 12 2Z"
                    fill=""
                  />
                </svg>
              </span>
              Nouveau Coach
            </Link>

            <Link
              href={setting.routes.AddParent}
              className="inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-7"
            >
              <span>
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C12.55 2 13 2.45 13 3V11H21C21.55 11 22 11.45 22 12C22 12.55 21.55 13 21 13H13V21C13 21.55 12.55 22 12 22C11.45 22 11 21.55 11 21V13H3C2.45 13 2 12.55 2 12C2 11.45 2.45 11 3 11H11V3C11 2.45 11.45 2 12 2Z"
                    fill=""
                  />
                </svg>
              </span>

              Nouveau Parent
            </Link>

            <Link
              href={setting.routes.AddPlayer}
              className="inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-7"
            >
              <span>
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C12.55 2 13 2.45 13 3V11H21C21.55 11 22 11.45 22 12C22 12.55 21.55 13 21 13H13V21C13 21.55 12.55 22 12 22C11.45 22 11 21.55 11 21V13H3C2.45 13 2 12.55 2 12C2 11.45 2.45 11 3 11H11V3C11 2.45 11.45 2 12 2Z"
                    fill=""
                  />
                </svg>
            </span>

              Nouveau Joueur
              
            </Link>
            

            <Link
              href={setting.routes.AddTransaction}
              className="inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-7"
            >
              <span>
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 4H4C2.897 4 2 4.897 2 6V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V6C22 4.897 21.103 4 20 4ZM4 6H20V8H4V6ZM20 18H4V10H20V18Z"
                    fill=""
                  />
                  <path
                    d="M6 14H8V16H6V14Z"
                    fill=""
                  />
                  <path
                    d="M10 14H12V16H10V14Z"
                    fill=""
                  />
                  <path
                    d="M14 14H16V16H14V14Z"
                    fill=""
                  />
                </svg>
              </span>

              Effectuer Paiement
            </Link>
          </div>
        </div>
      </div>

      

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        
      </div>
    </>
  );
};

export default Academy;
