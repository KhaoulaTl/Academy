/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-undef */
"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import { setting } from "@/config/setting";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { createPlayerThunk, getAllPlayersThunk } from "@/lib/services/player/player";
import { CategoryType, CoachType, ParentType } from "@/types/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {  useForm } from 'react-hook-form';

interface AddPlayerFormData {
    _id: string;
    firstName: string;
    lastName: string;
    birthDate: Date | null;
    parentId: string;
    coachId: string;
    skillLevel: string;
  }
  
  interface PlayerType {
    _id: string;
    firstName: string;
    lastName: string;
    birthDate: Date | null;
    parentId: string;
    coachId: string;
    skillLevel: string;
  }



const Player = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { playerDetails } = useAppSelector((state) => state.player);
 
    const [players, setPlayers] = useState<PlayerType | any>(playerDetails);
    const dispatch = useAppDispatch();
    const [alertMessage, setAlertMessage] = useState("");
    const [showSuccessAlert, setSuccessShowAlert] = useState(false);
    const [showErrorAlert, setErrorShowAlert] = useState(false);

    const [birthDate, setBirthDate] = useState<Date | null>(null);


    const router = useRouter();
    
    const {
        register,
        reset,
        control,
        handleSubmit: handleSubmitPlayer,
        formState: { errors }, // Added to retrieve errors
      } = useForm<AddPlayerFormData>({
        defaultValues: {
            parentId:"",
            coachId: "",
        }
      });
    
    const fetchPlayers = useCallback(async () => {
        setIsLoading(true);
        const res = await dispatch(getAllPlayersThunk(undefined));
            if (res.meta.requestStatus === "fulfilled") {
                setPlayers(res?.payload);
            } else {
                console.log("Failed to fetch players", res);
            }
            setIsLoading(false);
    }, [dispatch]);

    

    useEffect(() => {
        fetchPlayers();
    }, [fetchPlayers]);

    useEffect(() => {
        if (players) {
            reset ({
                firstName: players.firstName || "",
                lastName: players.lastName || "",
                birthDate: players.birthDate ? new Date(players.birthDate) : null,
                parentId: players.parentId || "",
                coachId: players.coachId || "",
                skillLevel: players.skillLevel || ""

            });
        }
        if (showSuccessAlert || showErrorAlert) {
          const timer = setTimeout(() => {
            setSuccessShowAlert(false);
            setErrorShowAlert(false);
            setAlertMessage ("");
          }, 3000); // Alert shows for 2 seconds
          return () => clearTimeout(timer);
        }
      }, [players, reset, showSuccessAlert, showErrorAlert]);
    
const handleAddPlayer = async (data: AddPlayerFormData) => {
    setIsLoading(true);
    const playerData = {
        ...data,
        birthDate, 
        parentId,
        coachId,
      };
      console.log('Données du joueur à créer :', playerData);
      if (!playerData.firstName || !playerData.lastName) {
        console.error('Erreur : les champs firstName et lastName sont obligatoires');
        setAlertMessage("Erreur : les champs firstName et lastName sont obligatoires");
        setErrorShowAlert(true);
        setIsLoading(false);
        return;
      }
     dispatch(createPlayerThunk(playerData)).then(async (res) => {
        if (res.meta.requestStatus === "fulfilled" ) {
                fetchPlayers();
                setAlertMessage("Un nouveau footballeur a été créé avec succès.");
                setSuccessShowAlert(true);
                setIsLoading(false);
                reset({
                    firstName: "",
                    lastName: "",
                    birthDate: "" || null,
                    parentId:"",
                    coachId:"",
                    skillLevel:"",

                });
                router.push(setting.routes.Players);
            } else {
                console.log('Erreur lors de la création du joueur :', res);

            setAlertMessage("Échec de la création de footballeur.");
            setErrorShowAlert(true);   
            setIsLoading(false);  
        }
        reset ();

        setBirthDate(null);
    });

};


const handleCancel = () => {
    reset();  
    router.back();
  };

const [parentId, setParentId] = useState<any>();
const [coachId, setCoachId] = useState<any>();

// Ajouter des annotations de type pour les variables
const { parentDetails }: { parentDetails: ParentType | any } = useAppSelector((state) => state.parent);
const { coachDetails }: { coachDetails: CoachType | any } = useAppSelector((state) => state.coach);
// Ajouter des annotations de type pour les fonctions
const handleParentChange = (value: string) => {
    setParentId(value);
  };
  
  const handleCoachChange = (value: string) => {
    setCoachId(value);
  };
  

// Utiliser les annotations de type pour les options de sélection
const parents = parentDetails && parentDetails.map((parent: { _id: any; firstName: any; lastName: any; }) => ({
    value: parent._id,
    text: `${parent.firstName} ${parent.lastName}`,
    selected: false,
  }));
  
  const coaches = coachDetails && coachDetails.map((coach: { _id: any; firstName: any; lastName: any; }) => ({
    value: coach._id,
    text: `${coach.firstName} ${coach.lastName}`,
    selected: false,
  }));
  

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Footballeurs" />

<div className="flex flex-col gap-10">
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
        </div>
        <br />

        <div className="grid z-20">
            <div className="mb-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Nouveau Footballeur
              </h3>
            </div>

            <div className="p-7">
                <form onSubmit={handleSubmitPlayer(handleAddPlayer)}>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/3">
                            <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="firstName"
                            >
                            Prénom
                            </label>
                            <div className="relative">
                                <span className="absolute left-4.5 top-4">
                                <svg
                                className="fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <g opacity="0.8">
                                <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                                />
                                <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                                />
                                </g>
                                </svg>
                                </span>
                                <input
                                {...register('firstName')}
                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                name="firstName"
                                id="firstName"
                                placeholder="Prénom"
                                />
                            </div>
                            {errors.firstName && (
                                <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                            )}
                        </div>
                        <div className="w-full sm:w-1/3">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="lastName"
                            >
                            Nom
                            </label>
                            <div className="relative">
                                <span className="absolute left-4.5 top-4">
                                <svg
                                className="fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <g opacity="0.8">
                                <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                                />
                                <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                                />
                                </g>
                                </svg>
                                </span>
                                <input
                                    {...register('lastName')}
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    placeholder="Nom"
                                />
                            </div>
                        </div>
                        {errors.lastName && (
                            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                        )}

                        <div className="w-full sm:w-1/3">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="lastName"
                            >
                            Date de naissance
                            </label>
                            <DatePickerOne onDateChange={setBirthDate} />
                        </div>
                        {errors.birthDate && (
                            <p className="text-red-500 text-sm">{errors.birthDate.message}</p>
                        )}
                
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">

                        <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phone"
                        >
                            Sélectionner un parent
                        </label>
                        <div className="relative">
                        <SelectGroupOne
                        options={parents || []}
                        value={coachId}
                        onChange={handleParentChange}
                        label="Sélectionner un parent"
                        />
                            <div className="mt-2"></div>
                        </div>
                    </div>

                    <div className="w-full sm:w-1/2">

                        <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phone"
                        >
                            Sélectionner un entraîneur
                        </label>
                        <div className="relative">
                        <SelectGroupOne
                                options={coaches || []}
                                value={coachId}
                                onChange={handleCoachChange}
                                label="Sélectionner un entraîneur"
                                 />
                            <div className="mt-2"></div>
                        </div>
                    </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  


                    <div className="w-full sm:w-1/2">
                        <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phone"
                        >
                            Niveau
                        </label>

                        <div className="relative">
                                <span className="absolute left-4.5 top-4">
                                <svg
                                className="fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <g opacity="0.8">
                                <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                                />
                                <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                                />
                                </g>
                                </svg>
                                </span>
                                <input
                                    {...register('skillLevel')}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-11.5 pr-4.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    type="text"
                                    name="skillLevel"
                                    id="skillLevel"
                                    placeholder="Niveau"
                                />
                            </div>
                        </div>
                        {errors.skillLevel && (
                            <p className="text-red-500 text-sm">{errors.skillLevel.message}</p>
                        )}

                </div>

                <div className="flex justify-end gap-4.5">

                    <button
                    type="submit"
                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    disabled={isLoading}
                    >
                    {isLoading ? "Chargement..." : "Ajouter Footballeur"}
                    </button>
                    <button
                    className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    type="submit"
                    disabled={isLoading}
                    onClick={handleCancel}
                    >
                    {isLoading ? "Chargement..." : "Annuler"}
                    </button>
                </div>
                </form>
            </div>
        </div>
    </div>

        </DefaultLayout>
    );
};

export default Player;