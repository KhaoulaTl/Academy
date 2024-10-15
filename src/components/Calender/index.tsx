/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { EventType } from '@/types/types';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { createEventThunk, deleteEventThunk, getAllEventsThunk } from '@/lib/services/event';

interface AddEventFormData {
  _id: string;
  name: string;
  date: Date;
  location: string;
}

interface DayWithEvents {
  day: number | null;
  events?: EventType[];
}


const Calendar = () => {
  const [date, setDate] = useState(moment());
  const [days, setDays] = useState<DayWithEvents[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const { eventDetails } = useAppSelector((state) => state.event);
  const [events, setEvents] = useState<EventType | any>(eventDetails);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  
  const handleCreateEvent = () => {
    setShowModal(true);
  };

  
const {
  register,
  reset,
  handleSubmit: handleSubmitEvent,
  reset: resetAddEventForm,
} = useForm<AddEventFormData>({});

const fetchEvents = useCallback(async () => {
  setIsLoading(true);
  await dispatch(getAllEventsThunk(undefined)).then((res) => {
    if (res.meta.requestStatus === "fulfilled") {
      setEvents(res?.payload);
      setIsLoading(false);
    }
  });
}, [dispatch]);

useEffect(() => {
  fetchEvents();
}, [fetchEvents]);


const handleAddEvent = async (data: AddEventFormData) => {
  setIsLoading(true);
  const eventData = { ...data, date: new Date(data.date) };
  
  dispatch(createEventThunk(eventData)).then((res) => {
    if (res.meta.requestStatus === "fulfilled") {
      const newEvent = { ...eventData, _id: res.payload._id };  // Update with response _id
      setEvents((prevEvents: EventType[]) => [...prevEvents, newEvent]);

      // Update the days with the new event
      const updatedDays = days.map((dayObj) => {
        if (dayObj.day === eventData.date.getDate()) {
          return { 
            ...dayObj, 
            events: [...(dayObj.events || []), newEvent] 
          };
        }
        return dayObj;
      });
      setDays(updatedDays);  
    }
    setIsLoading(false);
    resetAddEventForm();
    setShowModal(false);
  });
};

const handleDeleteEvent = async (eventId: string) => {
  if (!eventId) {
    console.error("Event ID is undefined");
    return;
  }
  setIsLoading(true);

  await dispatch(deleteEventThunk(eventId)).then((res) => {
    if (res.meta.requestStatus === "fulfilled") {
      // Remove the event from the list of events
      setEvents((prevEvents: EventType[]) => prevEvents.filter((event) => event._id !== eventId));

      // Remove the event from the calendar days
      const updatedDays = days.map((dayObj) => {
        if (dayObj.events) {
          return {
            ...dayObj,
            events: dayObj.events.filter((event) => event._id !== eventId),
          };
        }
        return dayObj;
      });
      setDays(updatedDays);  
    }
    setIsLoading(false);
  });
};



useEffect(() => {
  const daysInMonth = date.daysInMonth();
  const firstDay = date.clone().startOf('month').day();
  const lastDay = date.clone().endOf('month').day();
  const daysArray: DayWithEvents[] = [];

  // Ajout des jours vides avant le premier jour du mois
  for (let i = 0; i < firstDay; i++) {
    daysArray.push({ day: null });
  }

  // Ajout des jours du mois et association des événements
  for (let i = 1; i <= daysInMonth; i++) {
    const dayEvents = events ? events.filter((event: EventType) =>
      moment(event.date).isSame(date.clone().date(i), 'day')
    ) : [];
    
    daysArray.push({ day: i, events: dayEvents });
  }
  

  // Ajout des jours vides après le dernier jour du mois
  for (let i = 0; i < 6 - lastDay; i++) {
    daysArray.push({ day: null });
  }

  setDays(daysArray);
}, [date, events]);  



  const handlePrevMonth = () => {
    setDate(date.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setDate(date.clone().add(1, 'month'));
  };



  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Calendrier" />

      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between p-5">
  <button onClick={handlePrevMonth} className="flex items-center">
    <ChevronLeftIcon className="w-5 h-5 text-black dark:text-white" />
  </button>
  <div className="flex items-center">
    <span className="font-bold text-black dark:text-white px-5">{date.format('MMMM YYYY')}</span>
    <button onClick={handleCreateEvent} className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5">
      Créer un événement
    </button>
  </div>
    <button onClick={handleNextMonth} className="flex items-center">
    <ChevronRightIcon className="w-5 h-5 text-black dark:text-white" />
  </button>
</div>

        <table className="w-full">
           <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Dimanche </span>
		<span className="block lg:hidden"> Dim </span>
		</th>
<th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Lundi </span>
		<span className="block lg:hidden"> Lun </span>
		</th>
<th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Mardi </span>
		<span className="block lg:hidden"> Mar </span>
		</th>
<th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Mercredi </span>
		<span className="block lg:hidden"> Mer </span>
		</th>
<th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Jeudi </span>
		<span className="block lg:hidden"> Jeu </span>
		</th>
<th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Vendredi </span>
		<span className="block lg:hidden"> Ven </span>
		</th>
<th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Samedi </span>
		<span className="block lg:hidden"> Sam </span>
		</th>
         
            </tr>
          </thead>
          <tbody>
  {days.map((dayObj, index) => {
    if (index % 7 === 0) {
      return (
        <tr className="grid grid-cols-7" key={index}>
          {days.slice(index, index + 7).map((dayObj, idx) => (
            <td
              key={idx}
              className={`ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500
                ${dayObj.day === moment().date() ? 'bg-primary text-white' : 'hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4'}
                ${dayObj.events && dayObj.events.length > 0 ? 'bg-lightYellow' : ''}
                md:h-26 md:p-5 xl:h-34`}
            >
              {dayObj.day !== null && (
                <span className="font-medium text-black dark:text-white">
                  {dayObj.day}
                  {dayObj.events && dayObj.events.length > 0 && (
                    <div className="event invisible absolute left-1 z-99 mb-1 flex w-[200%] flex-col rounded-sm border-l-[3px] border-primary bg-gray px-3 py-2 text-left opacity-0 group-hover:visible group-hover:opacity-100 dark:bg-meta-4 md:visible md:w-[150%] md:opacity-100">
                      <ul>
                        {dayObj.events.map((event) => (
                          <li key={event._id} className="text-sm">
                            <span className="event-name text-sm font-semibold text-black dark:text-white">{event.name}</span> <br />
                            <span className="time flex items-center text-sm font-medium text-black dark:text-white">
                              <svg
                                className="fill-primary dark:fill-white mr-1" // Added margin right for spacing
                                width="16"
                                height="16"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                  <g id="Icon-Set" transform="translate(-104.000000, -411.000000)" fill="#000000">
                                    <path
                                      d="M116,426 C114.343,426 113,424.657 113,423 C113,421.343 114.343,420 116,420 C117.657,420 119,421.343 119,423 C119,424.657 117.657,426 116,426 L116,426 Z M116,418 C113.239,418 111,420.238 111,423 C111,425.762 113.239,428 116,428 C118.761,428 121,425.762 121,423 C121,420.238 118.761,418 116,418 L116,418 Z M116,440 C114.337,440.009 106,427.181 106,423 C106,417.478 110.477,413 116,413 C121.523,413 126,417.478 126,423 C126,427.125 117.637,440.009 116,440 L116,440 Z M116,411 C109.373,411 104,416.373 104,423 C104,428.018 114.005,443.011 116,443 C117.964,443.011 128,427.95 128,423 C128,416.373 122.627,411 116,411 L116,411 Z"
                                      id="location"
                                    ></path>
                                  </g>
                                </g>
                              </svg>
                              {event.location}
                            </span>
                            <div className="mt-1">
                              
                                  <button
                                    className="inline-flex items-center justify-center rounded-full bg-primary px-1 py-1 text-center font-normal text-white hover:bg-opacity-90 lg:px-4 xl:px-4"
                                    onClick={() => handleDeleteEvent(event._id)}
                                  >
                                    Supprimer
                                  </button>
                                </div>
                           
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </span>
              )}
            </td>
          ))}
        </tr>
      );
    }
    return null;
  })}
</tbody>


        </table>
      </div>

      
      {showModal && (
  <div className="fixed top-0 left-10 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white rounded-sm p-5 w-1/2">
      <h2 className="text-lg font-bold mb-4">Créer un événement</h2>
      <form onSubmit={handleSubmitEvent(handleAddEvent)}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventName">
            Nom de l'événement
          </label>
          <input
          {...register('name')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="eventName"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventDate">
            Date de l'événement
          </label>
          <input
          {...register('date')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventLocation">
            Lieu de l'événement
          </label>
          <input
          {...register('location')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="eventLocation"
            type="text"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded mr-4"
          >
            Ajouter événement
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
            onClick={() => setShowModal(false)}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>


  );
};

export default Calendar;