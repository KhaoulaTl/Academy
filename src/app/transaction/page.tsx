/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-undef */
"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import React from "react";
import { deleteTransactionThunk, getAllTransactionsThunk, getTransactionHistoryThunk } from "@/lib/services/transaction/transaction";
import { PlayerType, TransactionType } from "@/types/types";
import { setting } from "@/config/setting";
import Link from "next/link";
import { getAllPlayersThunk } from "@/lib/services/player/player";
import { Pagination } from "@mui/material";
import TransactionHistory from "./transactionHistory/page";

function TransactionForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { transactionDetails } = useAppSelector((state) => state.transaction);
  const [ transactions, setTransactions] = useState<TransactionType | any>(transactionDetails);
  const [searchTerm, setSearchTerm] = useState('');
  const { playerDetails } = useAppSelector((state) => state.player);
  const [players, setPlayers] = useState<PlayerType | any>(playerDetails);
  const [alertMessage, setAlertMessage] = useState("");
  const [showSuccessAlert, setSuccessShowAlert] = useState(false);
  const [showErrorAlert, setErrorShowAlert] = useState(false);

  const fetchTransactions = useCallback(async () => {
      setIsLoading(true);
      await dispatch(getAllTransactionsThunk()).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
              setTransactions(res?.payload);
              setIsLoading(false);
          }
      });
  }, [dispatch]);

  useEffect(() => {
      fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    dispatch(getAllPlayersThunk(undefined)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setPlayers(res.payload);
      }
    });
  }, [dispatch]);

  const [paymentHistory, setPaymentHistory] = useState([]);

// Appel pour récupérer l'historique des paiements
useEffect(() => {
  const fetchPaymentHistory = async () => {
    // Replace 'somePlayerId' with the actual playerId you need to fetch the transaction history for
    const playerId = "somePlayerId"; 
    const response = await dispatch(getTransactionHistoryThunk(playerId)); // Pass the playerId here
    if (response.meta.requestStatus === "fulfilled") {
      setPaymentHistory(response.payload);
    }
  };
  fetchPaymentHistory();
}, [dispatch]);


const getPlayerNames = (playerId: string) => {
    if (!players) {
      return "Non trouvé";
    }
    const playerFlat = Object.values(players).flat() as PlayerType[];
    const player = playerFlat.find((p) => p._id === playerId);
    return player ? `${player.firstName} ${player.lastName}` : "Non trouvé";
  };

  const filteredTransactions = Array.isArray(transactions) ? transactions.filter((transaction: { invoiceNumber:any; }) => {
    const facture = `${transaction.invoiceNumber}`;
    return facture.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];


  const handlePageChange = (event: any, value: SetStateAction<number>) => {
    setCurrentPage(value);
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Nombre d'éléments par page
  
  // Calcul des indices pour les items de la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem); // Items de la page actuelle
  
  // Total des pages
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  
  const formatDate = (date: string | number | Date) => {
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return "Date invalide"; // Fallback text for invalid date
    }
    return formattedDate.toLocaleDateString();
  };

  const [showDetails, setShowDetails] = useState(false); // Interface de détails

  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);

  const handleTransactionClick = async (transactionId: string) => {
      // Récupérer les détails de la transaction en utilisant l'ID
      const transaction = transactions.find((t: TransactionType) => t._id === transactionId);
      
      if (transaction) {
          // Mettre à jour l'état avec la transaction sélectionnée
          setSelectedTransaction(transaction);
          // Afficher les détails de la transaction
          setShowDetails(true);
      } else {
          // Gérer le cas où la transaction n'est pas trouvée
          setAlertMessage("Transaction non trouvée.");
          setErrorShowAlert(true);
      }
 
};



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
  
  const handleDelete = async (transactionId: string) => {
    await dispatch(deleteTransactionThunk(transactionId));
    setTransactions((prev: any[]) => prev.filter((c) => c._id !== transactionId));
    setAlertMessage("La transaction a été supprimée avec succès.");
    setSuccessShowAlert(true);
    fetchTransactions();
  };
  
  return (
      <DefaultLayout>
          <Breadcrumb pageName="Liste de paiements"/>
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
</div>
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
  placeholder="Rechercher paiement par numéro de facture"
  className="w-full bg-transparent  py-2 pl-2  font-medium focus:outline-none xl:w-90"
                          />

                      </div>
                  </div>

                  <div className="font-medium border-stroke px-6 py-3 dark:border-strokedark">
              <Link
                  href={setting.routes.AddTransaction}
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
                  Effectuer paiement
              </Link>
              </div>
              </div>


              <div className="flex flex-col">
              <div className="grid grid-cols-11 sm:grid-cols-11 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-4 2xl:px-6">

              <div className="hidden items-center  p-3.5 sm:flex xl:p-5">
                <h5 className="text-sm font-medium  xsm:text-base">
                Facture
                </h5>
              </div>

              <div className="hidden items-center  p-3.5 sm:flex xl:p-5">
                <h5 className="text-sm font-medium  xsm:text-base">
                Joueur
                </h5>
              </div>

              <div className="hidden items-center  p-3.5 sm:flex xl:p-5">
            <h5 className="text-sm font-medium  xsm:text-base">
            Type Abonnement
            </h5>
            </div>

            <div className="hidden items-center  p-3.5 sm:flex xl:p-5">
            <h5 className="text-sm font-medium  xsm:text-base">
            Date de Paiement
            </h5>
            </div>

            <div className="hidden items-center  p-3.5 sm:flex xl:p-5">
            <h5 className="text-sm font-medium  xsm:text-base">
            Date d'Échéance
            </h5>
            </div>

            <div className="hidden items-center  p-3.5 sm:flex xl:p-5">
            <h5 className="text-sm font-medium  xsm:text-base">
            Statut du Paiement
            </h5>
            </div>

            <div className="hidden items-center  p-3.5 sm:flex xl:p-5">
            <h5 className="text-sm font-medium  xsm:text-base">
            Assurance Statut
            </h5>
            </div>

            <div className="hidden items-center  p-3.5 sm:flex xl:p-5">
            <h5 className="text-sm font-medium  xsm:text-base">
            Montant Payé Assurance
            </h5>
            </div>

            <div className="hidden items-center  p-3.5 sm:flex xl:p-5">
            <h5 className="text-sm font-medium  xsm:text-base">
            Date de Paiement Assurance
            </h5>
            </div>

            
            <div className="hidden items-center  p-3.5 sm:flex xl:p-5">
            <h5 className="text-sm font-medium  xsm:text-base">
            Historique des paiements
            </h5>
            </div>

            <div className="hidden items-center  p-3.5 sm:flex xl:p-5">
            <h5 className="text-sm font-medium  xsm:text-base">
            Actions
            </h5>
            </div>

              </div>
              </div>

              {currentTransactions.map((transaction: TransactionType) => (
                <div
    className={`grid grid-cols-11 sm:grid-cols-11 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5 ${
      transactions.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
    }`}
    key={transaction._id}
  >
<div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="hidden text-black dark:text-white sm:block">{transaction.invoiceNumber}</p>
    </div>
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="hidden text-black dark:text-white sm:block">{getPlayerNames(transaction.playerId)}</p>
    </div>
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="hidden text-black dark:text-white sm:block">{transaction.subscriptionType}</p>
    </div>
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
    <p className="hidden text-black dark:text-white sm:block">{formatDate(transaction.PaymentDate)}</p>
    </div>
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="hidden text-black dark:text-white sm:block">{formatDate(transaction.dueDate)}</p>
    </div>
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="hidden text-black dark:text-white sm:block">{transaction.paymentStatus}</p>
    </div>
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="hidden text-black dark:text-white sm:block"> {transaction.insurancePaid ? "Oui" : "Non"}</p>
    </div>
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="hidden text-black dark:text-white sm:block">{transaction.insuranceAmount}</p>
    </div>
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
      <p className="hidden text-black dark:text-white sm:block">{formatDate(transaction.insurancePaymentDate)}</p>
    </div> 
    <div className="hidden items-center  p-2.5 sm:flex xl:p-5">
    <button
                className="text-primary underline"
                onClick={() => handleTransactionClick(transaction._id)}
            >
                Voir l'historique
            </button>
    </div>
    <div className="flex items-center justify-center p-3 xl:p-5">
      
        {/* Icône de suppression */}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-5 w-6 text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={() => handleDelete(transaction._id)} 
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
          {showDetails && selectedTransaction && (
            <TransactionHistory 
            transaction={selectedTransaction}
            searchTerm={searchTerm}
            onClose={() => setShowDetails(false)} 
            />
        )}
      </DefaultLayout>
  );
};

export default TransactionForm;
