/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';


const Calendar = () => {
  const [date, setDate] = useState(moment());
  const [days, setDays] = useState<(number | null)[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const handleCreateEvent = () => {
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    // Code pour sauvegarder l'événement
    console.log('Événement créé avec succès !');
    setShowModal(false);
  };

  useEffect(() => {
    const daysInMonth = date.daysInMonth();
    const firstDay = date.clone().startOf('month').day();
    const lastDay = date.clone().endOf('month').day();
    const daysArray: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    for (let i = 0; i < 6 - lastDay; i++) {
      daysArray.push(null);
    }

    setDays(daysArray);
  }, [date]);

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
  {days.map((day, index) => {
    if (index % 7 === 0) {
      return (
        <tr className="grid grid-cols-7" key={index}>
          {days.slice(index, index + 7).map((day, idx) => (
            <td key={idx} className={`ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 ${day === moment().date() ? 'bg-primary text-white' : 'hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4'} md:h-25 md:p-6 xl:h-31`}>
              {day !== null && (
                <span className="font-medium text-black dark:text-white">
                  {day}
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
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventName">
            Nom de l'événement
          </label>
          <input
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
            onClick={handleSaveEvent}
          >
            Sauvegarder
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