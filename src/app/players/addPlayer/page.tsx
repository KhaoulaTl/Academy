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
import { CoachType, ParentType, PlayerType } from "@/types/types";
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
    setErrorShowAlert(false); 
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

        <div className="z-20 justify-center  w-400">
            <div className="mb-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Nouveau Footballeur
              </h3>
            </div>

            <div className="p-7">
                <form onSubmit={handleSubmitPlayer(handleAddPlayer)}>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-2/3">
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
                        </div>
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                        <div className="w-full sm:w-2/3">
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
                        </div>

                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                        <div className="w-full sm:w-2/3">
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
                        <div className="w-full sm:w-2/3">

                        <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="parent"
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
                        </div>
                    </div>
</div>
<div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                    <div className="w-full sm:w-2/3">

                        <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="coach"
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
                        </div>
                    </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  
                    <div className="w-full sm:w-2/3">
                        <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Niveau"
                        >
                            Niveau de catégorie ( N1, N2, ... )
                        </label>

                        <div className="relative">
                                <span className="absolute left-4.5 top-4">
                                          <svg 
          className="fill-current"
            width="25"
            height="25"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
<g display="none">
	<path display="inline" d="M20.01,36.5c-0.277,0-0.537-0.137-0.693-0.368L9.468,21.529c-1.171-1.861-1.79-3.993-1.79-6.162
		C7.678,8.824,13.206,3.5,20,3.5c6.795,0,12.322,5.324,12.322,11.867c0,2.164-0.612,4.284-1.77,6.129l-9.851,14.636
		C20.547,36.363,20.287,36.5,20.01,36.5L20.01,36.5z M20,5.17c-5.873,0-10.652,4.574-10.652,10.197c0,1.854,0.525,3.669,1.52,5.251
		l9.14,13.55l9.146-13.581c0.981-1.566,1.499-3.371,1.499-5.22C30.652,9.744,25.873,5.17,20,5.17L20,5.17z"/>
	<path display="inline" d="M20,20.857c-3.159,0-5.728-2.482-5.728-5.535c0-3.051,2.569-5.534,5.728-5.534s5.729,2.483,5.729,5.534
		C25.729,18.375,23.158,20.857,20,20.857L20,20.857z M20,11.458c-2.237,0-4.057,1.734-4.057,3.864c0,2.13,1.82,3.865,4.057,3.865
		s4.058-1.734,4.058-3.865C24.058,13.192,22.236,11.458,20,11.458L20,11.458z"/>
</g>
<path display="none" d="M36.705,34.289L26.059,23.615c3.918-4.69,3.688-11.708-0.707-16.114C23.1,5.243,20.104,4,16.919,4
	S10.74,5.243,8.488,7.501c-4.647,4.66-4.647,12.241,0,16.899c2.253,2.257,5.248,3.5,8.431,3.5c2.866,0,5.573-1.015,7.728-2.86
	l10.639,10.665C35.479,35.902,35.738,36,35.994,36s0.514-0.098,0.709-0.293C37.096,35.316,37.097,34.68,36.705,34.289z
	 M9.766,23.126c-3.945-3.958-3.945-10.395,0-14.351c1.912-1.914,4.452-2.97,7.153-2.97s5.243,1.056,7.153,2.97
	c3.946,3.956,3.946,10.394,0,14.351c-1.91,1.914-4.452,2.969-7.153,2.969S11.678,25.04,9.766,23.126z"/>
<path display="none" d="M25.38,34.848c-0.066,0-0.136-0.009-0.206-0.024l-10.498-2.561l-10.61,2.561
	c-0.069,0.016-0.139,0.024-0.205,0.024c-0.191,0-0.38-0.064-0.532-0.184C3.12,34.5,3,34.252,3,33.986V8.635
	c0-0.397,0.27-0.741,0.657-0.836l10.76-2.623l0.407,0.003l10.504,2.558l10.607-2.561c0.065-0.016,0.135-0.023,0.203-0.023
	c0.195,0,0.38,0.063,0.533,0.183C36.881,5.499,37,5.746,37,6.012v25.352c0,0.397-0.27,0.741-0.656,0.837l-10.759,2.622
	C25.516,34.839,25.446,34.848,25.38,34.848L25.38,34.848z M15.481,30.688l9.039,2.203V9.311l-9.039-2.203V30.688z M26.24,9.311
	v23.58l9.039-2.202V7.108L26.24,9.311z M4.721,9.311v23.58l9.039-2.202V7.108L4.721,9.311z"/>
<g display="none">
	<path display="inline" d="M9.708,35C7.112,35,5,32.893,5,30.303c0-2.592,2.112-4.699,4.708-4.699c2.595,0,4.707,2.107,4.707,4.699
		C14.415,32.893,12.303,35,9.708,35L9.708,35z M9.708,27.445c-1.578,0-2.863,1.281-2.863,2.857c0,1.574,1.285,2.855,2.863,2.855
		c1.578,0,2.861-1.281,2.861-2.855C12.568,28.727,11.285,27.445,9.708,27.445L9.708,27.445z"/>
	<path display="inline" d="M24.574,35c-0.621,0-1.125-0.505-1.125-1.126c0-9.552-7.771-17.324-17.323-17.324
		C5.505,16.55,5,16.045,5,15.425s0.505-1.126,1.126-1.126c10.792,0,19.573,8.781,19.573,19.575C25.699,34.495,25.193,35,24.574,35
		L24.574,35z"/>
	<path display="inline" d="M33.916,35c-0.597,0-1.082-0.486-1.082-1.084c0-14.75-12-26.751-26.751-26.751
		C5.486,7.165,5,6.68,5,6.083C5,5.486,5.486,5,6.083,5C22.027,5,35,17.972,35,33.916C35,34.514,34.514,35,33.916,35L33.916,35z"/>
</g>


<g>
	<path d="M20,21.569c-0.095,0-0.189-0.021-0.282-0.062L5.434,15.115C5.165,14.995,4.994,14.72,5,14.413
		c0.006-0.303,0.191-0.578,0.46-0.683l14.286-5.681C19.828,8.017,19.913,8,20,8c0.086,0,0.172,0.017,0.254,0.049l14.285,5.679
		c0.275,0.11,0.455,0.378,0.461,0.683c0.008,0.308-0.163,0.584-0.434,0.704L20.281,21.51C20.192,21.549,20.096,21.569,20,21.569
		L20,21.569z M7.626,14.468l12.339,5.522l12.409-5.522L20,9.549L7.626,14.468z"/>
	<path d="M5.434,20.49c-0.361-0.163-0.53-0.604-0.376-0.983c0.113-0.275,0.372-0.454,0.659-0.454c0.097,0,0.191,0.021,0.282,0.062
		l13.967,6.249l14.037-6.249c0.092-0.042,0.186-0.062,0.283-0.062c0.286,0,0.544,0.177,0.656,0.454
		c0.155,0.379-0.014,0.82-0.376,0.983L20,27.008L5.434,20.49z"/>
	<path d="M5.434,25.48c-0.362-0.164-0.531-0.604-0.376-0.981c0.113-0.275,0.372-0.454,0.659-0.454c0.097,0,0.191,0.021,0.282,0.061
		l13.967,6.25l14.037-6.25c0.09-0.039,0.186-0.061,0.283-0.061c0.286,0,0.544,0.179,0.656,0.454
		c0.155,0.378-0.014,0.819-0.375,0.981L20,32L5.434,25.48z"/>
</g>        </svg>       
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