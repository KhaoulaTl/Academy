/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-undef */
"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import React from "react";
import { getAllTransactionsThunk } from "@/lib/services/transaction/transaction";
import { TransactionType } from "@/types/types";
import { setting } from "@/config/setting";
import Link from "next/link";

const TransactionHistory = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { transactionDetails } = useAppSelector((state) => state.transaction);
    const [ transactions, setTransactions] = useState<TransactionType | any>(transactionDetails);
   
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

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Historique des transactions"/>

            <div className="mb-20 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    



            </div>
        </DefaultLayout>
    )
}

export default TransactionHistory