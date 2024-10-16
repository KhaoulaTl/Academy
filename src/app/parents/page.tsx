/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-undef */
"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import axiosInstance from "@/config/instanceAxios";
import { useForm } from "react-hook-form";
import React from "react";
import Link from "next/link";
import { deleteParentThunk, getAllParentsThunk } from "@/lib/services/parent/parent";
import { setting } from "@/config/setting";
import UpdateParent from "./updateParent/page";
import { PlayerType } from "@/types/types";

interface ParentType {
  _id: string;
  firstName: string;
  lastName: string;
  phone1: string;
  phone2: string;
  childIds: string[];
}


interface UpdateParentFormData {
  _id: string;
  firstName: string;
  lastName: string;
  phone1: string;
  phone2: string;
  childIds: string[];
}

const Parents  = () => {

const [isLoading, setIsLoading] = useState<boolean>(false);
const [open, setOpen] = useState(false);
const { parentDetails } = useAppSelector((state) => state.parent);
const [parents, setParents] = useState<ParentType | any>(parentDetails);
const [selectedParent, setSelectedParent] = useState<ParentType | null>(null);

const dispatch = useAppDispatch();

const [alertMessage, setAlertMessage] = useState("");
const [showSuccessAlert, setSuccessShowAlert] = useState(false);
const [showErrorAlert, setErrorShowAlert] = useState(false);

const [searchTerm, setSearchTerm] = useState('');

const { playerDetails } = useAppSelector((state) => state.player);

const [players, setPlayers] = useState<PlayerType | any>(playerDetails);


const { reset: resetUpdateParentForm,
} = useForm<UpdateParentFormData>({});

// Fonction pour fetcher les parents
const fetchParents = useCallback(async () => {
  setIsLoading(true);
  const res = await dispatch(getAllParentsThunk(undefined));
  if (res.meta.requestStatus === "fulfilled") {
    setParents(res.payload);
  }
  setIsLoading(false);
}, [dispatch]);

// Consolidation de `useEffect` pour éviter des appels répétitifs à `fetchParents`
useEffect(() => {
  fetchParents(); // Appel une seule fois pour fetcher les parents
}, [fetchParents]);

// Fetch les joueurs pour chaque parent
useEffect(() => {
    const fetchPlayersForParents = async () => {
      if (Array.isArray(parents)) {
        const newPlayers: Record<string, PlayerType[]> = {};

        for (const parent of parents) {
          if (parent.childIds && parent.childIds.length > 0) {
            const fetchedPlayers = await fetchPlayers(parent.childIds);
            newPlayers[parent._id] = fetchedPlayers;
          }
        }
        setPlayers(newPlayers);
      
    };
    fetchPlayersForParents();
  }
}, [parents, searchTerm]);

// Fonction pour fetcher les joueurs
const fetchPlayers = async (playerIds: string[]): Promise<PlayerType[]> => {
  try {
    const playerPromises = playerIds.map(async (id) => {
      const res = await axiosInstance.get(`players/${id}`);
      return res.data;
    });

    return await Promise.all(playerPromises);
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
};

// Fonction pour obtenir les noms des joueurs
const getPlayersNames = (childIds: string[]): string[] => {
  if (players) {
    const playersFlat = Object.values(players).flat() as PlayerType[];
    return childIds.map((id) => {
      const player = playersFlat.find((p) => p._id === id);
      return player ? `${player.firstName} ${player.lastName}` : "Non trouvé";
    });
  }
  return childIds.map(() => "Non trouvé");
};

// Fonction pour supprimer un parent
const handleDelete = async (parentId: string) => {
  await dispatch(deleteParentThunk(parentId));
  setParents((prev: any[]) => prev.filter((c) => c._id !== parentId));
  setAlertMessage("Le parent a été supprimé avec succès.");
  setSuccessShowAlert(true);
};

// Fonction pour éditer un parent
const handleEdit = async (parent: ParentType) => {
  setSelectedParent(parent);
  setOpen(true);
  try {
    const parentData = await axiosInstance.get(`parents/${parent._id}`);
    resetUpdateParentForm({
      _id: parentData.data._id,
      firstName: parentData.data.firstName,
      lastName: parentData.data.lastName,
      phone1: parentData.data.phone1,
      phone2: parentData.data.phone2,
    });
    fetchParents();
  } catch (error) {
    setAlertMessage("Erreur de récupération des données.");
    setErrorShowAlert(true);
  }
};

// Consolidation du gestionnaire d'alertes pour éviter des répétitions
useEffect(() => {
  if (showSuccessAlert || showErrorAlert) {
    const timer = setTimeout(() => {
      setSuccessShowAlert(false);
      setErrorShowAlert(false);
      setAlertMessage("");
    }, 3000); // Affiche l'alerte pendant 3 secondes
    return () => clearTimeout(timer);
  }
}, [showSuccessAlert, showErrorAlert]);
  
const filteredParents = Array.isArray(parents) ? parents.filter((parent: { firstName: any; lastName: any; }) => {
  const parentName = `${parent.firstName} ${parent.lastName}`;
  return parentName.toLowerCase().includes(searchTerm.toLowerCase());
}) : [];

    return (
        <DefaultLayout>
<Breadcrumb pageName="Parents"/>
<div className="col-span-5 xl:col-span-2">
  {showSuccessAlert && (
  <div className="flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
    <div className="mr-5 flex h-8 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
      <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z" fill="white" stroke="white"></path>
      </svg>
    </div>
    <div className="w-full">
      <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399] ">
        {alertMessage}
      </h5>
    </div>
  </div>
)}
 {showErrorAlert && (
<div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
            <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
              <svg
                width="15"
                height="12"
                viewBox="0 0 15 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                  fill="#ffffff"
                  stroke="#ffffff"
                ></path>
              </svg>
            </div>
            <div className="w-full">
              <h5 className="mb-3 font-semibold text-[#B45454]">
                {alertMessage}
              </h5>
              
            </div>
          </div>
)}
<br />
    <div className="mb-20 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

    
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

    
  <div className="flex pl-6 py-3">
    <button className="relative ml-2">
      <svg
        className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
          fill=""
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
          fill=""
        />
      </svg>
    </button>
    <input
      type="search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Rechercher un parent"
      className="w-full bg-transparent  py-2 pl-2  font-medium focus:outline-none xl:w-90"
    />
    
  </div>
  

    </div>
    <div className="font-medium border-stroke px-6 py-3 dark:border-strokedark">

    <Link
              href={setting.routes.AddParent}
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
              Nouveau Parent
            </Link>
            </div>
            </div>
    <div className="flex flex-col">
      <div className="grid grid-cols-6 sm:grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
        <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
            Nom
            </h5>
        </div>
        <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
            Prénom
            </h5>
        </div>
        <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
            Téléphone 1 
            </h5>
          </div>
          <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
          Téléphone 2 
            </h5>
          </div>
          <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
            Footballeurs
            </h5>
          </div>
          <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
            Actions
            </h5>
          </div>
        </div>
      </div>

      {filteredParents.map((parent: ParentType) => (
          <div
    className={`grid grid-cols-6 sm:grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5 ${
      parents.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
    }`}
    key={parent._id}
  >
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="hidden text-black dark:text-white sm:block">{parent.lastName}</p>
    </div>
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="hidden text-black dark:text-white sm:block">{parent.firstName}</p>
    </div>
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="text-black dark:text-white">{parent.phone1}</p>
    </div>
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="text-black dark:text-white">{parent.phone2}</p>
    </div>
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="text-black dark:text-white">{getPlayersNames(parent.childIds).join(", ")}</p>
    </div>
    
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      {/* Icône de mise à jour */}
      
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-6 text-blue-500 hover:text-blue-700 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={() => handleEdit(parent)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536M16 3a2.828 2.828 0 014 4L7 20H3v-4L16 3z"
        />
      </svg>
      
      

      {/* Icône de suppression */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-5 w-6 text-blue-500 hover:text-blue-700 cursor-pointer"
        onClick={() => handleDelete(parent._id)} 
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7L5 7M6 7V19a2 2 0 002 2h8a2 2 0 002-2V7M10 11v6M14 11v6M21 7a2 2 0 00-2-2H5a2 2 0 00-2 2v0"
        />
      </svg>
    </div>
  </div>
))}

      </div>

      {open && selectedParent && (
        <UpdateParent
          parent={selectedParent}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
        </DefaultLayout>
    );
};

export default Parents;