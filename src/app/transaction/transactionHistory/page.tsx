/* eslint-disable react/no-unescaped-entities */

"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Modal, Pagination } from "@mui/material";
import { getAllTransactionsThunk } from "@/lib/services/transaction/transaction";
import { PlayerType, TransactionType } from "@/types/types";
import React from "react";

interface DetailsPlayerTransactionProps {
  transaction: TransactionType;
  searchTerm
  onClose: () => void;
}
const TransactionHistory: React.FC<DetailsPlayerTransactionProps> = ({
  transaction,
  searchTerm,
  onClose,
}) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Récupérer l'historique de paiement de la transaction
  const paymentHistory = transaction.paymentHistory || [];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = paymentHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);

  const handlePageChange = (event: any, value: number) => {
    setCurrentPage(value);
  };

  const formatDate = (date: string | number | Date) => {
    const formattedDate = new Date(date);
    return isNaN(formattedDate.getTime()) ? "Date invalide" : formattedDate.toLocaleDateString();
  };
  
  const { playerDetails } = useAppSelector((state) => state.player);

  const [players, setPlayers] = useState<PlayerType | any>(playerDetails);


  const getPlayerNames = (playerId: string) => {
    if (!players) {
      return "Non trouvé";
    }
    const playerFlat = Object.values(players).flat() as PlayerType[];
    const player = playerFlat.find((p) => p._id === playerId);
    return player ? `${player.firstName} ${player.lastName}` : "Non trouvé";
  };

  const [searchTermPayments, setSearchTermPayments] = useState('');

    // Filtrer les paiements en fonction du searchTerm
    const filteredPayments = paymentHistory.filter(payment => {
      return payment.invoiceNumber.toLowerCase().includes(searchTermPayments.toLowerCase());
    });

  return (
      <>
      <div className="mb-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex pl-6 py-1">
        <h1 className="text-xl font-bold mb-4 mt-4 text-primary">
          Historique de paiement de {getPlayerNames(transaction.playerId)}
        </h1>
      </div>
      {filteredPayments.length > 0 ? (
        <div className="flex flex-col">
          {/* Header */}
          <div className="grid grid-cols-4 sm:grid-cols-4 border-t border-stroke px-4 py-4 dark:border-strokedark md:px-4 2xl:px-6">
            <div className="hidden items-center p-3.5 sm:flex xl:p-5">
              <h5 className="text-sm font-medium xsm:text-base">Facture</h5>
            </div>
            <div className="hidden items-center p-3.5 sm:flex xl:p-5">
              <h5 className="text-sm font-medium xsm:text-base">Date de paiement</h5>
            </div>
            <div className="hidden items-center p-3.5 sm:flex xl:p-5">
              <h5 className="text-sm font-medium xsm:text-base">Date d'Échéance</h5>
            </div>
            <div className="hidden items-center p-3.5 sm:flex xl:p-5">
              <h5 className="text-sm font-medium xsm:text-base">Montant payé</h5>
            </div>
          </div>

          {/* Transactions */}
          {filteredPayments.map((history, index) => (
            <div
              key={index}
              className="grid grid-cols-4 sm:grid-cols-4 border-t border-stroke px-4 py-2 dark:border-strokedark md:px-6 2xl:px-7.5"
            >
              <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">
                  {history.invoiceNumber}
                </p>
              </div>
              <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">
                  {formatDate(history.date)}
                </p>
              </div>
              <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">
                  {formatDate(history.dueDate)}
                </p>
              </div>
              <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">{history.amount}</p>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-between m-6">
          
          <div>
            <button className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-1 text-center font-medium text-primary hover:bg-opacity-90 lg:px-4 xl:px-4" onClick={onClose}>Fermer</button>
          </div>
          
          <div>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary" />
          </div>
          
          </div>
        </div>
      ) : (
        <p>Aucun historique de paiement disponible.</p>
      )}
    </div></>
  );
};

export default TransactionHistory;