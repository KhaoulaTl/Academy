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
import { TransactionType } from "@/types/types";
import { Pagination } from "@mui/material";
import { useRouter } from "next/router";

const TransactionHistory = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { transactionDetails } = useAppSelector((state) => state.transaction);
    const [transactions, setTransactions] = useState<TransactionType| any>(transactionDetails);
    const [searchTerm, setSearchTerm] = useState('');
  
    const router = useRouter();
  
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
  
    const filteredTransactions = transactions.filter((transaction: { invoiceNumber: any; }) => {
      const facture = `${transaction.invoiceNumber}`;
      return facture.toLowerCase().includes(searchTerm.toLowerCase());
    });
  
    const handlePageChange = (event: any, value: number) => {
      setCurrentPage(value);
    };
  
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  
    const formatDate = (date: string | number | Date) => {
      const formattedDate = new Date(date);
      if (isNaN(formattedDate.getTime())) {
        return "Date invalide";
      }
      return formattedDate.toLocaleDateString();
    };
  
    const [transactionsDetails, setTransactionsDetails] = useState<TransactionType | null>(null);
    const { transactionDetails: allTransactions } = useAppSelector((state) => state.transaction) as unknown as { transactionDetails: TransactionType[] };
    const { transactionId } = router.query;
  
    useEffect(() => {
      if (transactionId && allTransactions) {
        const transaction = allTransactions.find(
          (transaction: TransactionType) => transaction._id === transactionId
        );
        if (transaction) {
          setTransactionsDetails(transaction);
        }
      }
    }, [transactionId, allTransactions]);
  
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Historique des paiements" />
        <div className="mb-20 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {transactionDetails ? (
            <div className="flex flex-col">
              <div className="grid grid-cols-11 sm:grid-cols-11 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-4 2xl:px-6">
                <div className="hidden items-center p-3.5 sm:flex xl:p-5">
                  <h5 className="text-sm font-medium xsm:text-base">Facture</h5>
                </div>
                <div className="hidden items-center p-3.5 sm:flex xl:p-5">
                  <h5 className="text-sm font-medium xsm:text-base">Date de paiement</h5>
                </div>
                <div className="hidden items-center p-3.5 sm:flex xl:p-5">
                  <h5 className="text-sm font-medium xsm:text-base">Montant payé</h5>
                </div>
              </div>
  
              {currentTransactions.map((transaction: TransactionType) => (
                <div
                  className={`grid grid-cols-11 sm:grid-cols-11 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5`}
                  key={transaction._id}
                >
                  {transaction.paymentHistory.map((history, index) => (
                    <React.Fragment key={index}>
                      <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                        <p className="hidden text-black dark:text-white sm:block">{history.invoiceNumber}</p>
                      </div>
                      <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                        <p className="hidden text-black dark:text-white sm:block">{formatDate(history.date)}</p>
                      </div>
                      <div className="hidden items-center p-2.5 sm:flex xl:p-5">
                        <p className="hidden text-black dark:text-white sm:block">{history.amount}</p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              ))}
  
              <div className="flex justify-end mt-4 mb-4">
                <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
              </div>
            </div>
          ) : (
            <p>Chargement des détails...</p>
          )}
        </div>
      </DefaultLayout>
    );
  };
  
  export default TransactionHistory;
  