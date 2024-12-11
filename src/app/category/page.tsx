/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-undef */
"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { createCategoryThunk, deleteCategoryThunk, getAllCategoriesThunk, updateCategoryThunk } from "@/lib/services/category/category";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { CategoryType } from "@/types/types";
import { Pagination } from "@mui/material";


interface AddCategoryFormData {
  _id: string;
  name: string;
  birthYears: number[];
  isActive: boolean;
}

interface UpdateCategoryFormData {
  _id: string;
  name: string;
  birthYears: number[];
  isActive: boolean;
}



const Category  = () => {

const [isLoading, setIsLoading] = useState<boolean>(false);
const [open, setOpen] = useState(false);
const { categoryDetails } = useAppSelector((state) => state.category);

const [categories, setCategories] = useState<CategoryType | any>(categoryDetails);

const dispatch = useAppDispatch();

const [alertMessage, setAlertMessage] = useState("");
const [showSuccessAlert, setSuccessShowAlert] = useState(false);
const [showErrorAlert, setErrorShowAlert] = useState(false);


const {
  register,
  reset,
  handleSubmit: handleSubmitCatgory,
  reset: resetAddCategoryForm,
} = useForm<AddCategoryFormData>({});

const {
  register: update,
  handleSubmit: handleUpdateCatgory,
  reset: resetUpdateCategoryForm,
} = useForm<UpdateCategoryFormData>({});


const fetchCategories = useCallback(async () => {
  setIsLoading(true);
  await dispatch(getAllCategoriesThunk(undefined)).then((res) => {
    if (res.meta.requestStatus === "fulfilled") {
      setCategories(res?.payload);
      setIsLoading(false);
    }
  });
}, [dispatch]);

useEffect(() => {
  fetchCategories();
}, [fetchCategories]);


useEffect(() => {
  if (categories) {
    reset({
      name: categories.name || '',
      birthYears: categories.birthYears || [],
      isActive: categories.isActive || true,
    });
  }
}, [categories, reset]);

const handleAddCategory = async (data: AddCategoryFormData) => {
  if (startYear !== null && endYear !== null) {
    const startYearValue = startYear.year(); 
    const endYearValue = endYear.year();
    const birthYearsArray = Array.from(
    { length: endYearValue - startYearValue + 1 },
    (_, i) => startYearValue + i
  );

    setIsLoading(true);
    const categoryData = { ...data, birthYears: birthYearsArray };

  dispatch(createCategoryThunk(categoryData)).then(async (res) => {
        if (res.meta.requestStatus === "fulfilled") {
          fetchCategories();
          setAlertMessage("Une nouvelle catégorie a été créée avec succès.");
          setSuccessShowAlert(true);
          setIsLoading(false);

        }
        resetAddCategoryForm();
        setStartYear(null);
        setEndYear(null);
      });
    } else {
      setAlertMessage("Veuillez entrer le nom de la catégorie et sélectionner l'année de début et l'année de fin.");
      setErrorShowAlert(true);
    }
  };

const [startYear, setStartYear] = useState<Dayjs | null>(null);
const [endYear, setEndYear] = useState<Dayjs | null>(null);

const [startYearUpdate, setStartYearUpdate] = useState<Dayjs | null>(null);
const [endYearUpdate, setEndYearUpdate] = useState<Dayjs | null>(null);

  const handleStartYearChange = (newValue: Dayjs | null) => {
    setStartYear(newValue);
  };
  
  const handleEndYearChange = (newValue: Dayjs | null) => {
    setEndYear(newValue);
  };

  const handleStartYearUpdateChange = (newValue: Dayjs | null) => {
    setStartYearUpdate(newValue);
  };
  
  const handleEndYearUpdateChange = (newValue: Dayjs | null) => {
    setEndYearUpdate(newValue);
  };
  
  const handleDelete = async (categoryId: string) => {
    await dispatch(deleteCategoryThunk(categoryId));
    setCategories((prev: any[]) => prev.filter((c) => c._id !== categoryId));
    setAlertMessage("La catégorie a été supprimée avec succès.");
    setSuccessShowAlert(true);
    fetchCategories();
  };

  useEffect(() => {
    if (categories) {
      resetUpdateCategoryForm({
        name: categories.name || '',
        birthYears: categories.birthYears || [],
        isActive: categories.isActive || true,
      });
    }
  }, [categories, resetUpdateCategoryForm]);

  const onSubmitCategory: SubmitHandler<UpdateCategoryFormData> = async (data) => {
    if (startYearUpdate !== null && endYearUpdate !== null) {
      const startYearUpdateValue = startYearUpdate.year();
      const endYearUpdateValue = endYearUpdate.year();
      const birthYearsArray = Array.from(
        { length: endYearUpdateValue - startYearUpdateValue + 1 },
        (_, i) => startYearUpdateValue + i
      );
  
      const updatedCategory = { ...data, birthYears: birthYearsArray };
      setIsLoading(true);
  
      dispatch(updateCategoryThunk({ id: updatedCategory._id, requestData: updatedCategory })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          fetchCategories();
          setCategories(res.payload);
          setAlertMessage("La catégorie a été mise à jour avec succès.");
          setSuccessShowAlert(true);
          setOpen(false);
          
          // Réinitialiser le formulaire et les états
          resetUpdateCategoryForm();
          setStartYearUpdate(null);
          setEndYearUpdate(null);
        }
      });
    } else {
      setAlertMessage("Veuillez sélectionner la catégorie que vous souhaitez modifier.");
      setErrorShowAlert(true);
    }
  };
  
  
  

  const handleEdit = (category: CategoryType) => {
    setOpen(true);
    
    if (category.birthYears.length > 0) {
      const firstYear = category.birthYears[0];
      const lastYear = category.birthYears[category.birthYears.length - 1];
      
      
      setStartYearUpdate(dayjs(`${firstYear}-01-01`));
      setEndYearUpdate(dayjs(`${lastYear}-12-31`));
    } else {
      setStartYearUpdate(null);
      setEndYearUpdate(null);
    }
  
    resetUpdateCategoryForm({
      _id: category._id,
      name: category.name,
      birthYears: category.birthYears,
    });
  };
  
  
  useEffect(() => {
    if (startYearUpdate && endYearUpdate) {
    }
  }, [startYearUpdate, endYearUpdate]);
  
  useEffect(() => {
    if (showSuccessAlert || showErrorAlert) {
      const timer = setTimeout(() => {
        setSuccessShowAlert(false);
        setErrorShowAlert(false);
        setAlertMessage("");
      }, 3000); // Alert shows for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert, showErrorAlert]);
  
  const router = useRouter();
  
  const handleCancel = () => {
    reset();  
    router.back();
    setErrorShowAlert(false); 
  };

  const handlePageChange = (event: any, value: SetStateAction<number>) => {
    setCurrentPage(value);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page

  // Calcul des indices pour les items de la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem); // Items de la page actuelle

  // Total des pages
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tranches d'âge"/>

<div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
  <div className="flex flex-col gap-9">
    {/* <!-- Ajouter une catégorie --> */}
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Ajouter une catégorie d'âge</h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmitCatgory(handleAddCategory)}>
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Nom de la catégorie
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="Entrez le nom de la catégorie d'âge (ex: 2004 - 2005)"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* Ligne pour Année de début et Année de fin */}
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Année de début
                </label>
                
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={['year']}
                    value={startYear} // Convert number to Dayjs
                    onChange={handleStartYearChange}
                    slotProps={{
                      textField: {
                        className: "form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      }
                    }}  
                  />
                </LocalizationProvider>
              </div>

              <div className="w-full sm:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Année de fin
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={['year']}
                    value={endYear}
                    onChange={handleEndYearChange}
                    slotProps={{
                      textField: {
                        className: "form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      }
                    }}  
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="flex justify-end gap-4.5">

            <button
            disabled={isLoading}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              {isLoading ? "Chargement..." :  "Ajouter la tranche d'âge"}
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
          </div>
        </form>
      </div>
    </div>
  </div>

  <div className="flex flex-col gap-9">
  {/* <!-- Mise à jour d'une catégorie --> */}
  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
      <h3 className="font-medium text-black dark:text-white">Mettre à jour une catégorie d'âge</h3>
    </div>
    <div className="p-7">
      <form onSubmit={handleUpdateCatgory(onSubmitCategory)}>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Nom de la catégorie
            </label>
            <input
              {...update('name')}
              type="text"
              placeholder="Nom de la catégorie"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Ligne pour Année de début et Année de fin */}
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Année de début
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['year']}
                  value={startYearUpdate} // Convert number to Dayjs
                  onChange={handleStartYearUpdateChange}
                  slotProps={{
                    textField: {
                      className: "form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    }
                  }}                 
                />
              </LocalizationProvider>
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Année de fin
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['year']}
                  value={endYearUpdate}
                  onChange={handleEndYearUpdateChange}
                  slotProps={{
                    textField: {
                      className: "form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    }
                  }}  
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="flex justify-end gap-4.5">

          <button 
            disabled={isLoading}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
            {isLoading ? "Chargement..." :  "Mettre à jour la tranche d'âge"}
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
        </div>
      </form>
    </div>
  </div>
</div>


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
  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
      <h3 className="font-medium text-black dark:text-white">
      Catégories d'âge
      </h3>
    </div>
    
    <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
            Nom de la catégorie
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
            Tranche d'âge
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
            Actions
            </h5>
          </div>
        </div>
      </div>
      
      {currentCategories.map((category: CategoryType) => (

  <div
    className={`grid grid-cols-3 sm:grid-cols-3 ${
      categories.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
    }`}
    key={category._id}
  >
    <div className="flex items-center gap-3 p-2.5 xl:p-5">
      <p className="hidden text-black dark:text-white sm:block">
        {category.name}
      </p>
    </div>
    <div className="flex items-center justify-center p-2.5 xl:p-5">
      <p className="text-black dark:text-white">{category.birthYears.join(", ")}</p>
    </div>
    <div className="flex items-center justify-center p-3 xl:p-5">
      {/* Icône de mise à jour */}
      
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-6 text-blue-500 hover:text-blue-700 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={() => handleEdit(category)}
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
        onClick={() => handleDelete(category._id)} 
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

 {/* Pagination */}
          <div className="flex justify-end mt-4 mb-4">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
      </div>
  </div>
  
</div>
      
    </DefaultLayout>
  );
};

export default Category;
