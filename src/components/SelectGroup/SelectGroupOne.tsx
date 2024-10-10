"use client";
import React, { useCallback, useEffect, useState } from "react";
import { getAllCategoriesThunk } from "@/lib/services/category/category";
import { getAllCoachesThunk } from "@/lib/services/coach/coach";
import { getAllParentsThunk } from "@/lib/services/parent/parent";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { CategoryType, CoachType, ParentType } from "@/types/types";


interface Option {
  value: string;
  text: string;
  selected: boolean;
}
interface SelectGroupOneProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

  const SelectGroupOne: React.FC<SelectGroupOneProps> = ({
    options,
    value,
    onChange,
    label,
  }) => {
    const dispatch = useAppDispatch();

    const [dropdownOptions, setDropdownOptions] = useState<Option[]>([]);
  
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  
    const { coachDetails } = useAppSelector((state) => state.coach);
    const [coaches, setCoaches] = useState<CoachType | any>(coachDetails);
    
    const { parentDetails } = useAppSelector((state) => state.parent);
    const [parents, setParents] = useState<ParentType | any>(parentDetails);
  
  const fetchParents = useCallback(async () => {
      const response = await dispatch(getAllParentsThunk(undefined));
      if (response.meta.requestStatus === "fulfilled") {
          const parents = response.payload;
          setParents(parents);
          const newOptions = parents.map((parent: ParentType) => ({
            value: parent._id,
            text: parent.firstName && parent.lastName,
            selected: false,
          }));
          setDropdownOptions(newOptions);
        }
  }, [dispatch]);
  
  const fetchCoaches = useCallback(async () => {
      const response = await dispatch(getAllCoachesThunk(undefined));
      if (response.meta.requestStatus === "fulfilled") {
          const coaches = response.payload;
          setCoaches(coaches);
          const newOptions = coaches.map((coach: CoachType) => ({
            value: coach._id,
            text: coach.firstName && coach.lastName,
            selected: false,
          }));
          setDropdownOptions(newOptions);
        }
    }, [dispatch]);
  
    useEffect(() => {
      fetchCoaches();
    }, [fetchCoaches]);
  
  useEffect(()=> {
      fetchParents();
  }, [fetchParents]);
  
  
    const changeTextColor = () => {
      setIsOptionSelected(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOption(e.target.value);
      onChange(e.target.value);
    };

  return (
    <div className="mb-4.5">
      

      <div className="relative z-20 bg-transparent dark:bg-form-input">
      <select
        value={selectedOption}
        onChange={handleChange}
        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>

        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill=""
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SelectGroupOne;
