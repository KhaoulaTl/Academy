/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getUserThunk, updateUserThunk } from "@/lib/services/user";
import { getCookies } from "@/utils/functions";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  newPassword?: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  _id?: number;
}

const Profile = () => {
  const dispatch = useAppDispatch();
  const userId = getCookies("user"); 
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  
  const { userDetails } = useAppSelector((state) => state.user);
  const [user, setUser] = useState<User | any>(userDetails);

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const fetchUser = () => {
    dispatch(getUserThunk(userId)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") setUser(res?.payload);
    });
  };

  useEffect(() => {
    fetchUser();
  }, [userId, dispatch]);

  const schema = yup.object({
    firstName: yup.string().required('Le prénom est requis'),
    lastName: yup.string().required('Le nom de famille est requis'),
    email: yup.string()
      .required('L\'adresse e-mail est requise')
      .email('Format d\'adresse e-mail invalide'),
    password: yup.string()
      .required('Le mot de passe est requis')
  }).required();

  const {
    register,
    reset,
    handleSubmit: handleSubmitProfile,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({});

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
        newPassword: '',
      });
    }
  }, [user, reset]);

  const onSubmitProfile: SubmitHandler<FormFields> = async (data) => {
    dispatch(updateUserThunk({ id: user._id, requestData: data })).then(
      (res) => {
        if (res.meta.requestStatus === "fulfilled")
        fetchUser();
        toast.success("Profil mis à jour avec succès");
      }
    );
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Profil" />

        <div className="grid z-20">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Informations personnelles
                </h3>
              </div>
              <div className="p-7">
              <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
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
                      htmlFor="emailAddress"
                    >
                      Adresse email
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
                              d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                      {...register('email')}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="email@example.com"
                      />
                    </div>
                    {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                  </div>

                  {/* Lien pour afficher les champs de mot de passe */}
                  <div className="mb-5.5">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        togglePasswordFields();
                      }}
                      className="text-primary hover:underline"
                    >
                      {showPasswordFields ? "Annuler" : "Cliquez ici pour changer le mot de passe"}
                    </a>
                  </div>

                  
                  <div className="mb-4">
                  {showPasswordFields && (
                    <>


                      {/* Champ pour le nouveau mot de passe */}
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="newPassword"
                        >
                          Nouveau mot de passe
                        </label>
                        <div className="relative">
                        <input
                        {...register('newPassword')}
                          className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type={showPassword ? 'text' : 'password'}
                          name="newPassword"
                          id="newPassword"
                          placeholder="Saisir le nouveau mot de passe"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
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
                    </>
                  )}
          {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}
          </div>
            
          <div className="mb-4">

                    {/* Champ pour le mot de passe actuel */}
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="password"
                        >
                          Mot de passe actuel (saisir pour confirmer les modifications)
                        </label>
                        <div className="relative">
                        <input
                        {...register('password')}
                          className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          id="password"
                          placeholder="Saisir votre mot de passe"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
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
          {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}
                      </div>
                  <div>
                    <button
                      className="w-full rounded bg-primary py-3 text-white hover:bg-primary-dark focus:outline-none"
                      type="submit"
                    >
                      Mettre à jour le profil
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
