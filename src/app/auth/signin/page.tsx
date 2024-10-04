/* eslint-disable react/no-unescaped-entities */
"use client"; 
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch } from "@/hooks/hooks";
import Link from "next/link";
import Image from "next/image";
import AuthLayout from "@/components/Layouts/AuthLayout";
import { loginThunk } from "@/lib/services/auth";
import { setting } from "@/config/setting";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const schemaLogin = yup.object({
email: yup.string()
    .required('L\'adresse e-mail est requise')
    .email('Format d\'adresse e-mail invalide'),
  password: yup.string()
    .required('Le mot de passe est requis')
    }).required();



const SignIn = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showSuccessAlert, setSuccessShowAlert] = useState(false);
  const [showErrorAlert, setErrorShowAlert] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaLogin),
  });

  const onSubmit = (data: any) => {
    dispatch(loginThunk(data)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        router.push(setting.routes.Home);
        setAlertMessage("Connexion réussie ! Bienvenue !");
        setSuccessShowAlert(true); // Show the success alert
        setErrorShowAlert(false);
      } else {
        setAlertMessage("Échec de la connexion. Vérifiez vos informations et réessayez.");
        setErrorShowAlert(true);   // Show the error alert
        setSuccessShowAlert(false); // Hide the success alert
      }
    });
  };

  useEffect(() => {
    if (showSuccessAlert || showErrorAlert) {
      const timer = setTimeout(() => {
        setSuccessShowAlert(false);
        setErrorShowAlert(false);
        setAlertMessage ("");
      }, 3000); // Alert shows for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert, showErrorAlert]);

  return (
    <AuthLayout>
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
     <div className="mb-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
     <div className="flex flex-wrap items-center">
      
          <div className="hidden w-full xl:block xl:w-1/2">

          <div className="px-26 py-17.5 text-center">
              <Link className="mb-5.5 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo.png"}
                  alt="Logo"
                  width={100}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo.png"}
                  alt="Logo"
                  width={100}
                  height={32}
                />
              </Link>
              <p className="2xl:px-20">
              Remplissez les champs ci-dessous pour vous connecter en tant qu'administrateur et accéder à l'académie.
              </p>

              <span className="mt-15 inline-block">
              <Image
                  src={"/images/soccer-player.png"}
                  alt="Logo"
                  width={490}
                  height={290}
                />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Se connecter à l'académie
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <input
                    {...register("email")}
                      type="email"
                      placeholder="Entrez votre adresse e-mail"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                    {...register("password")}
                    type={showPassword ? 'text' : 'password'}
                      placeholder="Entrez votre mot de passe"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <div className="absolute top-1/2 right-4 flex items-center -translate-y-1/2">
                    {/* Icône pour afficher/masquer le mot de passe */}
                    <span onClick={handleClickShowPassword} className="cursor-pointer">
              {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {/* Icône personnalisée pour masquer le mot de passe */}
                <path d="M12 1C7 1 2.73 4.11 1 8.5 2.73 12.89 7 16 12 16s9.27-3.11 11-7.5C21.27 4.11 17 1 12 1zm0 13c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                <circle cx="12" cy="8.5" r="2.5" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {/* Icône personnalisée pour afficher le mot de passe */}
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5h2v5h-2zm0-7V7h2v2.5h-2z" />
              </svg>
            )}
          </span>
          </div>
        </div>
        </div>
        
                <div className="mb-5">
                  <input
                    type="submit"
                    value="Se connecter"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>

                <div className="mt-6 text-center">
                <p className="text-center text-sm text-bodydark dark:text-bodydark">
                  Vous n'avez pas de compte ?{" "}
                  <Link
                    className="font-medium text-primary transition hover:underline"
                    href={setting.routes.SignUp}
                  >
                    Inscrivez-vous
                  </Link>
                </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
