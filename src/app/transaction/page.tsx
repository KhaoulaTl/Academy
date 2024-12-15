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
import { getAllTransactionsThunk } from "@/lib/services/transaction/transaction";
import { PlayerType, TransactionType } from "@/types/types";
import { setting } from "@/config/setting";
import Link from "next/link";
import { getAllPlayersThunk } from "@/lib/services/player/player";
import { Pagination } from "@mui/material";
import router, { useRouter } from "next/router";

function TransactionForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { transactionDetails } = useAppSelector((state) => state.transaction);
  const [ transactions, setTransactions] = useState<TransactionType | any>(transactionDetails);
  const [searchTerm, setSearchTerm] = useState('');
  const { playerDetails } = useAppSelector((state) => state.player);
  const [players, setPlayers] = useState<PlayerType | any>(playerDetails);
  const [paymentDate, setPaymentDate] = useState<string[]>([]);  

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
  const itemsPerPage = 5; // Nombre d'éléments par page
  
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

  const handleTransactionClick = async (transactionId: string) => {
    const router = useRouter();
    try {
      console.log(`Navigating to transaction history for ID: ${transactionId}`);
      router.push(`/transaction/transactionHistory/${transactionId}`);
    } catch (error) {
      console.error("Erreur lors de la navigation vers l'historique :", error);
    }
  };
  
  
  
  return (
      <DefaultLayout>
          <Breadcrumb pageName="Liste de paiements"/>

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
            Montant Payé
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
      <p className="hidden text-black dark:text-white sm:block">{transaction.amountPaid}</p>
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
      </DefaultLayout>
  )
}

export default TransactionForm;
