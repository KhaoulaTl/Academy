/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-undef */
"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { FormProvider, useForm } from 'react-hook-form';
import { createCoachThunk, getAllCoachesThunk } from "@/lib/services/coach/coach";
import MultiSelect from "@/components/FormElements/MultiSelect";
import { useRouter } from 'next/navigation';
import { setting } from "@/config/setting";
import { CoachType } from "@/types/types";

interface AddCoachFormData {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  ageCategory: string[];
  playerIds: string[];
}

interface Option {
  value: string;
  text: string;
  selected: boolean;
  element?: HTMLElement;
}


interface MultiSelectRef {
  reset(): unknown;
  setSelected: (selected: number[]) => void;
  setDropdownOptions: (options: Option[]) => void;
  dropdownOptions: Option[];
}

const Coach = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { coachDetails } = useAppSelector((state) => state.coach);
  const [coaches, setCoaches] = useState<CoachType | any>(coachDetails);
  const dispatch = useAppDispatch();
  const [alertMessage, setAlertMessage] = useState("");
  const [showSuccessAlert, setSuccessShowAlert] = useState(false);
  const [showErrorAlert, setErrorShowAlert] = useState(false);

  const multiSelectRef = useRef<MultiSelectRef>(null);

  const router = useRouter();


  const {
    register,
    reset,
    control,
    handleSubmit: handleSubmitCoach,
    formState: { errors }, // Added to retrieve errors
  } = useForm<AddCoachFormData>({
    defaultValues: {
      ageCategory: []
    }
  });

  const fetchCoaches = useCallback(async () => {
    setIsLoading(true);
    const res = await dispatch(getAllCoachesThunk(undefined));
      if (res.meta.requestStatus === "fulfilled") {
        setCoaches(res?.payload);
      } else {
        console.log("Failed to fetch coaches:", res);
      }
      setIsLoading(false);
}, [dispatch]);

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);


  useEffect(() => {
    
    
    if (coaches) {
      reset({
        firstName: coaches.firstName || "",
        lastName: coaches.lastName || "",
        phone: coaches.phone || "",
        ageCategory: coaches.ageCategory || [],
        playerIds: coaches.playerIds || [],
      });
    }
  
    if (showSuccessAlert || showErrorAlert) {
      const timer = setTimeout(() => {
        setSuccessShowAlert(false);
        setErrorShowAlert(false);
        setAlertMessage("");
      }, 3000);
      return () => clearTimeout(timer);

    }
  }, [coaches, reset, showSuccessAlert, showErrorAlert]);
  

  const handleAddCoach = async (data: AddCoachFormData) => {
    setIsLoading(true);
    const coachData = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      ageCategory: data.ageCategory,
    };

      const res = await dispatch(createCoachThunk(coachData)).then(async (res) => {
      if (res.meta.requestStatus === "fulfilled") {
        fetchCoaches();
        setAlertMessage("Un nouveau entraîneur a été créé avec succès.");
        setSuccessShowAlert(true);
        reset({
          firstName: "",
          lastName: "",
          phone: "",
          ageCategory: [],
        });
        if (multiSelectRef.current) {
          multiSelectRef.current.reset();
        }
        router.push(setting.routes.Coachs);

      } else {
        setAlertMessage("Échec de la création de l'entraîneur.");
        setErrorShowAlert(true);   
        setIsLoading(false);  

      }
    reset();
  });
  };
  


  const methods = useForm<AddCoachFormData>(); // Create methods from useForm
  useEffect(() => {
  }, [methods.watch("ageCategory")]);

  const handleCancel = () => {
    // Optionnel : réinitialiser le formulaire si nécessaire
    reset();  
    // Retourner à la page précédente
    router.back();
    setErrorShowAlert(false); 
  };

  return (
    <FormProvider {...methods}> 
    <DefaultLayout>
      <Breadcrumb pageName="Entraîneurs" />

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
                Nouveau Entraîneur
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmitCoach(handleAddCoach)}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
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

                <div className="w-full sm:w-1/2">
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
                <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phone"
                    >
                        Téléphone
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                      <path
                        d="M6.62 10.79C8.06 13.64 10.36 15.94 13.21 17.38L15.34 15.25C15.69 14.9 16.21 14.79 16.66 14.94C17.97 15.37 19.39 15.61 20.87 15.61C21.48 15.61 22 16.12 22 16.73V20.5C22 21.33 21.33 22 20.5 22C10.22 22 2 13.78 2 3.5C2 2.67 2.67 2 3.5 2H7.27C7.88 2 8.39 2.52 8.39 3.12C8.39 4.61 8.63 6.03 9.06 7.34C9.2 7.79 9.1 8.31 8.75 8.66L6.62 10.79Z"
                        fill=""
                     />  
                    </svg>

                        </span>
                      <input
                      {...register('phone')}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder="Téléphone"
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                  )}


<div className="mb-5.5">
  <label
    className="mb-3 block text-sm font-medium text-black dark:text-white"
    htmlFor="ageCategory"
  >
    Tranches d'âge entraînées
  </label>
  <div className="relative">
  <MultiSelect
              id="categories"
              control={control}
              {...register("ageCategory")}
            />
    <div id="selectedCategories" className="mt-2"></div>
  </div>
</div>

{errors.ageCategory && (
  <p className="text-red-500 text-sm">{errors.ageCategory.message}</p>
)}

                  <div className="flex justify-end gap-4.5">

                <button
                  type="submit"
                  className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? "Chargement..." : "Ajouter Entraîneur"}
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
    </FormProvider>
  );
};

export default Coach;
