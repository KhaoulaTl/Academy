/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-undef */
"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {  useForm } from 'react-hook-form';
import { PlayerType, TransactionType } from "@/types/types";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { createTransactionThunk, getAllTransactionsThunk, payTransactionThunk } from "@/lib/services/transaction/transaction";


interface AddTransactionFormData {
    _id: string;
    playerId: string; 
    subscriptionType: string;
    durationInMonths: number;
    amountPaid: number;
    PaymentDate: Date| null;
    invoiceNumber: string;
    paymentStatus: string;
    dueDate: Date | null;
    insurancePaid: boolean; 
    insuranceAmount: number;
    insurancePaymentDate: Date| null; 
    paymentHistory: { amount: number; date: Date, invoiceNumber: string }[];
  }


  const AddTransaction = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { transactionDetails } = useAppSelector((state) => state.transaction);
    const [transactions, setTransactions] = useState<TransactionType | any>(transactionDetails);
    const dispatch = useAppDispatch();
    const [alertMessage, setAlertMessage] = useState("");
    const [showSuccessAlert, setSuccessShowAlert] = useState(false);
    const [showErrorAlert, setErrorShowAlert] = useState(false);
    const router = useRouter();
    
    const { playerDetails } : { playerDetails : PlayerType | any } = useAppSelector((state) => state.player);
    const [playerId, setPlayerId] = useState<any>();
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [actionType, setActionType] = useState('create'); // 'create' or 'pay'
    const [PaymentDate, setPaymentDate] = useState<Date | null>(null);
    const [insurancePaymentDate, setInsurancePaymentDate] = useState<Date | null>(null);

    
    const { register, reset, handleSubmit, formState: { errors }, setValue } = useForm<AddTransactionFormData>({
        defaultValues: {
          playerId: '',
          
        },
      });
      
      const onSubmit = async (data: AddTransactionFormData) => {
        if (actionType === 'create') {
          handleAddTransaction(data);
        } else {
          handleAddPayment(data);
        }
      };
      
      useEffect(() => {
        console.log('Transactions reçues du backend :', transactions);
        if (transactions) {
            reset({
                playerId: transactions.playerId || "",
                subscriptionType: transactions.subscriptionType || "",
                durationInMonths: transactions.durationInMonths || "",
                amountPaid: transactions.amountPaid || "",
                invoiceNumber: transactions.invoiceNumber || "",
                paymentStatus: transactions.paymentStatus || "",
                dueDate: transactions.dueDate ? new Date(transactions.dueDate) : null,  // Vérifiez ici
                insurancePaid: transactions.insurancePaid || false,
                insuranceAmount: transactions.insuranceAmount || 0,
                insurancePaymentDate: transactions.insurancePaymentDate ? new Date(transactions.insurancePaymentDate) : null,
                paymentHistory: transactions.paymentHistory || [],
                PaymentDate: transactions.PaymentDate ? new Date(transactions.PaymentDate) : null
            });
        }
    }, [transactions]);
    
    

    useEffect(() => {
        dispatch(getAllTransactionsThunk());
    }, [dispatch]);


    const handleAddPayment = async (data: AddTransactionFormData) => {
        setIsLoading(true);
    
        const amountPaid = Number(data.amountPaid); // Assurez-vous que amountPaid est un nombre valide
        if (isNaN(amountPaid)) {
            setErrorShowAlert(true); // Montrez un message d'erreur si ce n'est pas un nombre valide
            setIsLoading(false);
            return;
        }
    
        const paymentData = {
            playerId, // Utiliser l'ID du joueur sélectionné
            PaymentDate,
            amount: amountPaid, // Montant payé
            invoiceNumber: data.invoiceNumber, // Numéro de la facture
            insurancePayment: data.insurancePaid, // Si l'assurance a été payée ou non
            newDurationInMonths: data.durationInMonths, // Nouvelle durée d'abonnement
            newSubscriptionType: data.subscriptionType
        };
    
        try {
            // Effectuer l'appel API pour créer le paiement
            const res = await dispatch(payTransactionThunk(paymentData));
    
            if (res.meta.requestStatus === "fulfilled") {
                setIsLoading(false);
                dispatch(getAllTransactionsThunk());
                
                // Réinitialiser les valeurs du formulaire après paiement
                reset({
                    playerId: "",
                    subscriptionType: "",
                    durationInMonths: 0,
                    amountPaid: 0,
                    invoiceNumber: "",
                    paymentStatus: "",
                    dueDate: null,
                    insurancePaid: false,
                    insuranceAmount: 0,
                    paymentHistory: [],
                });
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Erreur lors du paiement:", error);
            setIsLoading(false);
        }
    };
    
    

    const handleAddTransaction = async(data:AddTransactionFormData) => {
        setIsLoading(true);

// On utilise la méthode `getTimezoneOffset()` pour obtenir la différence entre l'heure locale et UTC
const offset = new Date().getTimezoneOffset() * 60000;  // Conversion en millisecondes
const localPaymentDate = PaymentDate ? new Date(PaymentDate).getTime() - offset : null; // Ajustement de la date locale
const localInsurancePaymentDate = insurancePaymentDate ? new Date(insurancePaymentDate).getTime() - offset : null;

const transactionData = {
    ...data,
    playerId,
    PaymentDate: localPaymentDate ? new Date(localPaymentDate).toISOString() : null,
    insurancePaymentDate: localInsurancePaymentDate ? new Date(localInsurancePaymentDate).toISOString() : null,
    durationInMonths: Number(data.durationInMonths),
};

      
    console.log("Données envoyées :", transactionData);
    

        dispatch(createTransactionThunk(transactionData)).then(async (res) => {
        if (res.meta.requestStatus === "fulfilled" ) {
                dispatch(getAllTransactionsThunk());
                setIsLoading(false);
                reset();
                setPaymentDate(null);
                setInsurancePaymentDate(null);
                //router.push(setting.routes.Transactions)
            } else {
                console.log('Erreur lors de la création du transaction :', res);

                setIsLoading(false);
            }
            
        });
    };
    
    const handlePlayerChange = (value:string) => {
        setPlayerId(value);
    }

    const players = playerDetails && playerDetails.map((player: {_id: any; firstName: any; lastName: any;}) => ({
        value: player._id,
        text: `${player.firstName} ${player.lastName}`,
        selected: false,
    }));
    
    const handleCancel = () => {
        reset();  
        router.back();
        setErrorShowAlert(false); 
      };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Paiement" />
           
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">

                <select value={actionType} onChange={(e) => setActionType(e.target.value)} className={`w-full rounded border border-stroke bg-transparent px-6 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input `}>
                    <option value="create" className="dark:bg-boxdark">Créer une transaction</option>
                    <option value="pay" className="dark:bg-boxdark">Effectuer un paiement</option>
                </select>
            </div>

        <br />
        {actionType === 'create' && (
            <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white"> Paiement d'abonnement </h3>
                        </div>
                        <div className="p-7">
                                <div className="flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="firstName"
                                        > Sélectionner un joueur </label>
                                        <div className="relative">
                                            <SelectGroupOne
                                                options={players || []}
                                                value={playerId}
                                                onChange={handlePlayerChange}
                                                label="Sélectionner un joueur"
                                            />
                                        </div> 
                                    </div>
                                </div>

                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="firstName"
                                        > Type d'abonnement </label>
                                            <div className="relative">
                                                <span className="absolute left-4.5 top-4">
                                                    <svg fill="#000001" height="20" width="20" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260.666 260.666">
                                                        <g>
	                                                        <path d="M236.666,40.882H24c-13.233,0-24,10.767-24,24v130.902c0,13.233,10.767,24,24,24h212.666c13.233,0,24-10.767,24-24V64.882
		                                                        C260.666,51.648,249.899,40.882,236.666,40.882z M245.666,195.784c0,4.962-4.037,9-9,9H24c-4.963,0-9-4.038-9-9V64.882
		                                                        c0-4.962,4.037-9,9-9h212.666c4.963,0,9,4.038,9,9V195.784z"/>
	                                                        <path d="M216.04,83.703h-68.933c-3.314,0-6,2.687-6,6s2.686,6,6,6h68.933c3.314,0,6-2.687,6-6S219.354,83.703,216.04,83.703z"/>
	                                                        <path d="M216.04,164.963h-68.933c-3.314,0-6,2.686-6,6c0,3.313,2.686,6,6,6h68.933c3.314,0,6-2.687,6-6
		                                                        C222.04,167.649,219.354,164.963,216.04,164.963z"/>
	                                                        <path d="M216.04,118.411h-41.718c-3.313,0-6,2.687-6,6s2.687,6,6,6h41.718c3.314,0,6-2.687,6-6S219.354,118.411,216.04,118.411z"/>
	                                                        <path d="M216.04,141.686h-41.718c-3.313,0-6,2.687-6,6c0,3.314,2.687,6,6,6h41.718c3.314,0,6-2.686,6-6
		                                                        C222.04,144.373,219.354,141.686,216.04,141.686z"/>
	                                                        <path d="M85.163,133.136c17.004,0,30.838-13.839,30.838-30.849c0-17.011-13.834-30.85-30.838-30.85
		                                                        c-17.009,0-30.847,13.839-30.847,30.85C54.316,119.297,68.154,133.136,85.163,133.136z M85.163,86.438
		                                                        c8.733,0,15.838,7.11,15.838,15.85c0,8.739-7.104,15.849-15.838,15.849c-8.738,0-15.847-7.11-15.847-15.849
		                                                        C69.316,93.548,76.425,86.438,85.163,86.438z"/>
	                                                        <path d="M97.097,138.68H73.415c-16.592,0-30.09,13.497-30.09,30.088v12.961c0,4.142,3.357,7.5,7.5,7.5s7.5-3.358,7.5-7.5v-12.961
		                                                        c0-8.319,6.77-15.088,15.09-15.088h23.682c8.32,0,15.09,6.768,15.09,15.088v12.961c0,4.142,3.357,7.5,7.5,7.5s7.5-3.358,7.5-7.5
		                                                        v-12.961C127.187,152.177,113.688,138.68,97.097,138.68z"/>
                                                        </g>
                                                    </svg>
                                                </span>
                                                <input
                                                    {...register('subscriptionType')}
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="text"
                                                    name="subscriptionType"
                                                    id="subscriptionType"
                                                    placeholder="Type d'abonnement ( ex: 'Mensuel', '6 mois', '10 mois' )"
                                                />
                                            </div>
                                            {errors.subscriptionType && (
                                                <p className="text-red-500 text-sm">{errors.subscriptionType.message}</p>
                                            )}
                                    </div>
                                </div>

                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="durationInMonths"
                                        > Durée de l'abonnement en mois </label>
                                        <div className="relative">
                                        <span className="absolute left-4.5 top-4">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 5.5L5 3.5M21 5.5L19 3.5M9 12.5L11 14.5L15 10.5M20 12.5C20 16.9183 16.4183 20.5 12 20.5C7.58172 20.5 4 16.9183 4 12.5C4 8.08172 7.58172 4.5 12 4.5C16.4183 4.5 20 8.08172 20 12.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            </span>
                                            <input
                                                    {...register('durationInMonths')}
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="text"
                                                    name="durationInMonths"
                                                    id="durationInMonths"
                                                    placeholder="Durée de l'abonnement en mois ( ex: 1, 6, 10)"
                                                />

                                        </div> 
                                    </div>
                                </div>

                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                        <div className="w-full">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="PaymentDate"
                            >
                            Date de paiement d'abonnement
                            </label>
                            
                            <DatePickerOne onDateChange={setPaymentDate} />
                        </div>
                        {errors.PaymentDate && (
                            <p className="text-red-500 text-sm">{errors.PaymentDate.message}</p>
                        )}
                
                    </div>

                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="firstName"
                                        > Montant payé </label>
                                            <div className="relative">
                                                <span className="absolute left-4.5 top-4">
                                                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.7255 17.1019C11.6265 16.8844 11.4215 16.7257 11.1734 16.6975C10.9633 16.6735 10.7576 16.6285 10.562 16.5636C10.4743 16.5341 10.392 16.5019 10.3158 16.4674L10.4424 16.1223C10.5318 16.1622 10.6239 16.1987 10.7182 16.2317L10.7221 16.2331L10.7261 16.2344C11.0287 16.3344 11.3265 16.3851 11.611 16.3851C11.8967 16.3851 12.1038 16.3468 12.2629 16.2647L12.2724 16.2598L12.2817 16.2544C12.5227 16.1161 12.661 15.8784 12.661 15.6021C12.661 15.2955 12.4956 15.041 12.2071 14.9035C12.062 14.8329 11.8559 14.7655 11.559 14.6917C11.2545 14.6147 10.9987 14.533 10.8003 14.4493C10.6553 14.3837 10.5295 14.279 10.4161 14.1293C10.3185 13.9957 10.2691 13.7948 10.2691 13.5319C10.2691 13.2147 10.3584 12.9529 10.5422 12.7315C10.7058 12.5375 10.9381 12.4057 11.2499 12.3318C11.4812 12.277 11.6616 12.1119 11.7427 11.8987C11.8344 12.1148 12.0295 12.2755 12.2723 12.3142C12.4751 12.3465 12.6613 12.398 12.8287 12.4677L12.7122 12.8059C12.3961 12.679 12.085 12.6149 11.7841 12.6149C10.7848 12.6149 10.7342 13.3043 10.7342 13.4425C10.7342 13.7421 10.896 13.9933 11.1781 14.1318L11.186 14.1357L11.194 14.1393C11.3365 14.2029 11.5387 14.2642 11.8305 14.3322C12.1322 14.4004 12.3838 14.4785 12.5815 14.5651L12.5856 14.5669L12.5897 14.5686C12.7365 14.6297 12.8624 14.7317 12.9746 14.8805L12.9764 14.8828L12.9782 14.8852C13.0763 15.012 13.1261 15.2081 13.1261 15.4681C13.1261 15.7682 13.0392 16.0222 12.8604 16.2447C12.7053 16.4377 12.4888 16.5713 12.1983 16.6531C11.974 16.7163 11.8 16.8878 11.7255 17.1019Z" fill="#000000"/>
                                                        <path d="M11.9785 18H11.497C11.3893 18 11.302 17.9105 11.302 17.8V17.3985C11.302 17.2929 11.2219 17.2061 11.1195 17.1944C10.8757 17.1667 10.6399 17.115 10.412 17.0394C10.1906 16.9648 9.99879 16.8764 9.83657 16.7739C9.76202 16.7268 9.7349 16.6312 9.76572 16.5472L10.096 15.6466C10.1405 15.5254 10.284 15.479 10.3945 15.5417C10.5437 15.6262 10.7041 15.6985 10.8755 15.7585C11.131 15.8429 11.3762 15.8851 11.611 15.8851C11.8129 15.8851 11.9572 15.8628 12.0437 15.8181C12.1302 15.7684 12.1735 15.6964 12.1735 15.6021C12.1735 15.4929 12.1158 15.411 12.0004 15.3564C11.8892 15.3018 11.7037 15.2422 11.4442 15.1777C11.1104 15.0933 10.8323 15.0039 10.6098 14.9096C10.3873 14.8103 10.1936 14.6514 10.0288 14.433C9.86396 14.2096 9.78156 13.9092 9.78156 13.5319C9.78156 13.095 9.91136 12.7202 10.1709 12.4074C10.4049 12.13 10.7279 11.9424 11.1401 11.8447C11.2329 11.8227 11.302 11.7401 11.302 11.6425V11.2C11.302 11.0895 11.3893 11 11.497 11H11.9785C12.0862 11 12.1735 11.0895 12.1735 11.2V11.6172C12.1735 11.7194 12.2487 11.8045 12.3471 11.8202C12.7082 11.8777 13.0255 11.9866 13.2989 12.1469C13.3765 12.1924 13.4073 12.2892 13.3775 12.3756L13.0684 13.2725C13.0275 13.3914 12.891 13.4417 12.7812 13.3849C12.433 13.2049 12.1007 13.1149 11.7841 13.1149C11.4091 13.1149 11.2216 13.2241 11.2216 13.4425C11.2216 13.5468 11.2773 13.6262 11.3885 13.6809C11.4998 13.7305 11.6831 13.7851 11.9386 13.8447C12.2682 13.9192 12.5464 14.006 12.773 14.1053C12.9996 14.1996 13.1953 14.356 13.3602 14.5745C13.5291 14.7929 13.6136 15.0908 13.6136 15.4681C13.6136 15.8851 13.4879 16.25 13.2365 16.5628C13.0176 16.8354 12.7145 17.0262 12.3274 17.1353C12.2384 17.1604 12.1735 17.2412 12.1735 17.3358V17.8C12.1735 17.9105 12.0862 18 11.9785 18Z" fill="#000000"/>
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.59235 5H13.8141C14.8954 5 14.3016 6.664 13.8638 7.679L13.3656 8.843L13.2983 9C13.7702 8.97651 14.2369 9.11054 14.6282 9.382C16.0921 10.7558 17.2802 12.4098 18.1256 14.251C18.455 14.9318 18.5857 15.6958 18.5019 16.451C18.4013 18.3759 16.8956 19.9098 15.0182 20H8.38823C6.51033 19.9125 5.0024 18.3802 4.89968 16.455C4.81587 15.6998 4.94656 14.9358 5.27603 14.255C6.12242 12.412 7.31216 10.7565 8.77823 9.382C9.1696 9.11054 9.63622 8.97651 10.1081 9L10.0301 8.819L9.54263 7.679C9.1068 6.664 8.5101 5 9.59235 5Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M13.2983 9.75C13.7125 9.75 14.0483 9.41421 14.0483 9C14.0483 8.58579 13.7125 8.25 13.2983 8.25V9.75ZM10.1081 8.25C9.69391 8.25 9.35812 8.58579 9.35812 9C9.35812 9.41421 9.69391 9.75 10.1081 9.75V8.25ZM15.9776 8.64988C16.3365 8.44312 16.4599 7.98455 16.2531 7.62563C16.0463 7.26671 15.5878 7.14336 15.2289 7.35012L15.9776 8.64988ZM13.3656 8.843L13.5103 9.57891L13.5125 9.57848L13.3656 8.843ZM10.0301 8.819L10.1854 8.08521L10.1786 8.08383L10.0301 8.819ZM8.166 7.34357C7.80346 7.14322 7.34715 7.27469 7.1468 7.63722C6.94644 7.99976 7.07791 8.45607 7.44045 8.65643L8.166 7.34357ZM13.2983 8.25H10.1081V9.75H13.2983V8.25ZM15.2289 7.35012C14.6019 7.71128 13.9233 7.96683 13.2187 8.10752L13.5125 9.57848C14.3778 9.40568 15.2101 9.09203 15.9776 8.64988L15.2289 7.35012ZM13.2209 8.10709C12.2175 8.30441 11.1861 8.29699 10.1854 8.08525L9.87486 9.55275C11.0732 9.80631 12.3086 9.81521 13.5103 9.57891L13.2209 8.10709ZM10.1786 8.08383C9.47587 7.94196 8.79745 7.69255 8.166 7.34357L7.44045 8.65643C8.20526 9.0791 9.02818 9.38184 9.88169 9.55417L10.1786 8.08383Z" fill="#000000"/>
                                                    </svg>
                                                </span>
                                                <input
                                                    {...register('amountPaid')}
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="text"
                                                    name="amountPaid"
                                                    id="amountPaid"
                                                    placeholder="Montant payé"
                                                />
                                            </div>
                                            {errors.subscriptionType && (
                                                <p className="text-red-500 text-sm">{errors.subscriptionType.message}</p>
                                            )}
                                    </div>
                                </div>
                                
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="invoiceNumber"
                                        > Numéro de facture </label>
                                        <div className="relative">
                                            <span className="absolute left-4.5 top-4">
                                                <svg fill="#000000" width="20" height="20" viewBox="0 0 32 32" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><rect height="1" width="12" x="10" y="2"/><rect height="1" width="12" x="10" y="2"/><rect height="1" transform="translate(-9.5 22.5) rotate(-90)" width="20" x="-3.5" y="15.5"/><rect height="1" transform="translate(11.5 39.5) rotate(-90)" width="16" x="17.5" y="13.5"/><rect height="1" width="6" x="17" y="6"/><rect height="1" width="14" x="9" y="9"/><rect height="1" width="14" x="9" y="12"/><rect height="1" width="14" x="9" y="15"/><rect height="1" width="14" x="9" y="18"/><rect height="1" width="10" x="9" y="21"/><rect height="1" width="7" x="9" y="24"/>
                                                    <path d="M22,2V3h2a1,1,0,0,1,1,1V6h1V4a2,2,0,0,0-2-2Z"/>
                                                    <path d="M10,2V3H8A1,1,0,0,0,7,4V6H6V4A2,2,0,0,1,8,2Z"/>
                                                    <path d="M8,30V29H8a1,1,0,0,1-1-1V26H6v2a2,2,0,0,0,2,2Z"/>
                                                    <path d="M21.91,21.15c-.57-.32-.91-.72-.91-1.15a6.09,6.09,0,0,1-.21,1.59c-1,4.07-6,7.18-12.12,7.4H8v1h.72c8.86-.15,16.07-3.15,17.14-7A3.77,3.77,0,0,0,26,22,8.72,8.72,0,0,1,21.91,21.15Zm-5.78,7a10.5,10.5,0,0,0,5.54-6,8.94,8.94,0,0,0,3.15.79C24.07,25,20.91,27,16.13,28.13Z"/>
                                                </svg>
                                            </span>
                                        
                                                <input
                                                    {...register('invoiceNumber')}
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="text"
                                                    name="invoiceNumber"
                                                    id="invoiceNumber"
                                                    placeholder="Numéro de facture"
                                                />
                                            </div>
                                            {errors.invoiceNumber && (
                                                <p className="text-red-500 text-sm">{errors.invoiceNumber.message}</p>
                                            )}
                                    </div>
                                </div>
                               

                
                </div>
                            

                            

                    </div>
                </div>


                <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white"> Paiement d'assurance </h3>
                        </div>

                        <div className="p-7">
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full">
                                        <label
                                            htmlFor="insurancePaid"
                                            className="flex cursor-pointer select-none items-center"
                                        >
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    id="insurancePaid"
                                                    className="sr-only"
                                                    {...register('insurancePaid')}
                                                    checked={isChecked}
                                                    onChange={() => {
                                                        setIsChecked(!isChecked); // Mise à jour de l'état local
                                                        setValue('insurancePaid', !isChecked);
                                                    }}
                                                /><div
                                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                                                  isChecked && "border-primary bg-gray dark:bg-transparent"
                                                }`}
                                              >
                                                <span
                                                  className={`h-2.5 w-2.5 rounded-sm ${isChecked && "bg-primary"}`}
                                                ></span>
                                              </div>
                                            </div>
                                            Assurance payée ?
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                        <div className="w-full">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="insurancePaymentDate"
                            >
                            Date de paiement d'assurance
                            </label>
                            
                            <DatePickerOne onDateChange={setInsurancePaymentDate} />
                        </div>
                        {errors.insurancePaymentDate && (
                            <p className="text-red-500 text-sm">{errors.insurancePaymentDate.message}</p>
                        )}
                
                    </div>

                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="firstName"
                                        > Montant assurance </label>
                                            <div className="relative">
                                                <span className="absolute left-4.5 top-4">
                                                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.7255 17.1019C11.6265 16.8844 11.4215 16.7257 11.1734 16.6975C10.9633 16.6735 10.7576 16.6285 10.562 16.5636C10.4743 16.5341 10.392 16.5019 10.3158 16.4674L10.4424 16.1223C10.5318 16.1622 10.6239 16.1987 10.7182 16.2317L10.7221 16.2331L10.7261 16.2344C11.0287 16.3344 11.3265 16.3851 11.611 16.3851C11.8967 16.3851 12.1038 16.3468 12.2629 16.2647L12.2724 16.2598L12.2817 16.2544C12.5227 16.1161 12.661 15.8784 12.661 15.6021C12.661 15.2955 12.4956 15.041 12.2071 14.9035C12.062 14.8329 11.8559 14.7655 11.559 14.6917C11.2545 14.6147 10.9987 14.533 10.8003 14.4493C10.6553 14.3837 10.5295 14.279 10.4161 14.1293C10.3185 13.9957 10.2691 13.7948 10.2691 13.5319C10.2691 13.2147 10.3584 12.9529 10.5422 12.7315C10.7058 12.5375 10.9381 12.4057 11.2499 12.3318C11.4812 12.277 11.6616 12.1119 11.7427 11.8987C11.8344 12.1148 12.0295 12.2755 12.2723 12.3142C12.4751 12.3465 12.6613 12.398 12.8287 12.4677L12.7122 12.8059C12.3961 12.679 12.085 12.6149 11.7841 12.6149C10.7848 12.6149 10.7342 13.3043 10.7342 13.4425C10.7342 13.7421 10.896 13.9933 11.1781 14.1318L11.186 14.1357L11.194 14.1393C11.3365 14.2029 11.5387 14.2642 11.8305 14.3322C12.1322 14.4004 12.3838 14.4785 12.5815 14.5651L12.5856 14.5669L12.5897 14.5686C12.7365 14.6297 12.8624 14.7317 12.9746 14.8805L12.9764 14.8828L12.9782 14.8852C13.0763 15.012 13.1261 15.2081 13.1261 15.4681C13.1261 15.7682 13.0392 16.0222 12.8604 16.2447C12.7053 16.4377 12.4888 16.5713 12.1983 16.6531C11.974 16.7163 11.8 16.8878 11.7255 17.1019Z" fill="#000000"/>
                                                        <path d="M11.9785 18H11.497C11.3893 18 11.302 17.9105 11.302 17.8V17.3985C11.302 17.2929 11.2219 17.2061 11.1195 17.1944C10.8757 17.1667 10.6399 17.115 10.412 17.0394C10.1906 16.9648 9.99879 16.8764 9.83657 16.7739C9.76202 16.7268 9.7349 16.6312 9.76572 16.5472L10.096 15.6466C10.1405 15.5254 10.284 15.479 10.3945 15.5417C10.5437 15.6262 10.7041 15.6985 10.8755 15.7585C11.131 15.8429 11.3762 15.8851 11.611 15.8851C11.8129 15.8851 11.9572 15.8628 12.0437 15.8181C12.1302 15.7684 12.1735 15.6964 12.1735 15.6021C12.1735 15.4929 12.1158 15.411 12.0004 15.3564C11.8892 15.3018 11.7037 15.2422 11.4442 15.1777C11.1104 15.0933 10.8323 15.0039 10.6098 14.9096C10.3873 14.8103 10.1936 14.6514 10.0288 14.433C9.86396 14.2096 9.78156 13.9092 9.78156 13.5319C9.78156 13.095 9.91136 12.7202 10.1709 12.4074C10.4049 12.13 10.7279 11.9424 11.1401 11.8447C11.2329 11.8227 11.302 11.7401 11.302 11.6425V11.2C11.302 11.0895 11.3893 11 11.497 11H11.9785C12.0862 11 12.1735 11.0895 12.1735 11.2V11.6172C12.1735 11.7194 12.2487 11.8045 12.3471 11.8202C12.7082 11.8777 13.0255 11.9866 13.2989 12.1469C13.3765 12.1924 13.4073 12.2892 13.3775 12.3756L13.0684 13.2725C13.0275 13.3914 12.891 13.4417 12.7812 13.3849C12.433 13.2049 12.1007 13.1149 11.7841 13.1149C11.4091 13.1149 11.2216 13.2241 11.2216 13.4425C11.2216 13.5468 11.2773 13.6262 11.3885 13.6809C11.4998 13.7305 11.6831 13.7851 11.9386 13.8447C12.2682 13.9192 12.5464 14.006 12.773 14.1053C12.9996 14.1996 13.1953 14.356 13.3602 14.5745C13.5291 14.7929 13.6136 15.0908 13.6136 15.4681C13.6136 15.8851 13.4879 16.25 13.2365 16.5628C13.0176 16.8354 12.7145 17.0262 12.3274 17.1353C12.2384 17.1604 12.1735 17.2412 12.1735 17.3358V17.8C12.1735 17.9105 12.0862 18 11.9785 18Z" fill="#000000"/>
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.59235 5H13.8141C14.8954 5 14.3016 6.664 13.8638 7.679L13.3656 8.843L13.2983 9C13.7702 8.97651 14.2369 9.11054 14.6282 9.382C16.0921 10.7558 17.2802 12.4098 18.1256 14.251C18.455 14.9318 18.5857 15.6958 18.5019 16.451C18.4013 18.3759 16.8956 19.9098 15.0182 20H8.38823C6.51033 19.9125 5.0024 18.3802 4.89968 16.455C4.81587 15.6998 4.94656 14.9358 5.27603 14.255C6.12242 12.412 7.31216 10.7565 8.77823 9.382C9.1696 9.11054 9.63622 8.97651 10.1081 9L10.0301 8.819L9.54263 7.679C9.1068 6.664 8.5101 5 9.59235 5Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M13.2983 9.75C13.7125 9.75 14.0483 9.41421 14.0483 9C14.0483 8.58579 13.7125 8.25 13.2983 8.25V9.75ZM10.1081 8.25C9.69391 8.25 9.35812 8.58579 9.35812 9C9.35812 9.41421 9.69391 9.75 10.1081 9.75V8.25ZM15.9776 8.64988C16.3365 8.44312 16.4599 7.98455 16.2531 7.62563C16.0463 7.26671 15.5878 7.14336 15.2289 7.35012L15.9776 8.64988ZM13.3656 8.843L13.5103 9.57891L13.5125 9.57848L13.3656 8.843ZM10.0301 8.819L10.1854 8.08521L10.1786 8.08383L10.0301 8.819ZM8.166 7.34357C7.80346 7.14322 7.34715 7.27469 7.1468 7.63722C6.94644 7.99976 7.07791 8.45607 7.44045 8.65643L8.166 7.34357ZM13.2983 8.25H10.1081V9.75H13.2983V8.25ZM15.2289 7.35012C14.6019 7.71128 13.9233 7.96683 13.2187 8.10752L13.5125 9.57848C14.3778 9.40568 15.2101 9.09203 15.9776 8.64988L15.2289 7.35012ZM13.2209 8.10709C12.2175 8.30441 11.1861 8.29699 10.1854 8.08525L9.87486 9.55275C11.0732 9.80631 12.3086 9.81521 13.5103 9.57891L13.2209 8.10709ZM10.1786 8.08383C9.47587 7.94196 8.79745 7.69255 8.166 7.34357L7.44045 8.65643C8.20526 9.0791 9.02818 9.38184 9.88169 9.55417L10.1786 8.08383Z" fill="#000000"/>
                                                    </svg>
                                                </span>
                                                <input
                                                    {...register('insuranceAmount')}
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="text"
                                                    name="insuranceAmount"
                                                    id="insuranceAmount"
                                                    placeholder="Montant assurance"
                                                />
                                            </div>
                                            {errors.insuranceAmount && (
                                                <p className="text-red-500 text-sm">{errors.insuranceAmount.message}</p>
                                            )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4.5 mt-5">

                    <button
                    type="submit"
                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    disabled={isLoading}
                    >
                    {isLoading ? "Chargement..." : "Créer une transaction"}
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
                    </div>
                    
                    </div>
                </div>
                </form>
            
                                </> )}

                                {actionType === 'pay' && (
                                <>
                                
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white"> Paiement d'abonnement </h3>
                        </div>
                        <div className="p-7">
                                <div className="flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="firstName"
                                        > Sélectionner un joueur </label>
                                        <div className="relative">
                                            <SelectGroupOne
                                                options={players || []}
                                                value={playerId}
                                                onChange={handlePlayerChange}
                                                label="Sélectionner un joueur"
                                            />
                                        </div> 
                                    </div>
                                </div>

                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="firstName"
                                        > Type d'abonnement </label>
                                            <div className="relative">
                                                <span className="absolute left-4.5 top-4">
                                                    <svg fill="#000001" height="20" width="20" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260.666 260.666">
                                                        <g>
	                                                        <path d="M236.666,40.882H24c-13.233,0-24,10.767-24,24v130.902c0,13.233,10.767,24,24,24h212.666c13.233,0,24-10.767,24-24V64.882
		                                                        C260.666,51.648,249.899,40.882,236.666,40.882z M245.666,195.784c0,4.962-4.037,9-9,9H24c-4.963,0-9-4.038-9-9V64.882
		                                                        c0-4.962,4.037-9,9-9h212.666c4.963,0,9,4.038,9,9V195.784z"/>
	                                                        <path d="M216.04,83.703h-68.933c-3.314,0-6,2.687-6,6s2.686,6,6,6h68.933c3.314,0,6-2.687,6-6S219.354,83.703,216.04,83.703z"/>
	                                                        <path d="M216.04,164.963h-68.933c-3.314,0-6,2.686-6,6c0,3.313,2.686,6,6,6h68.933c3.314,0,6-2.687,6-6
		                                                        C222.04,167.649,219.354,164.963,216.04,164.963z"/>
	                                                        <path d="M216.04,118.411h-41.718c-3.313,0-6,2.687-6,6s2.687,6,6,6h41.718c3.314,0,6-2.687,6-6S219.354,118.411,216.04,118.411z"/>
	                                                        <path d="M216.04,141.686h-41.718c-3.313,0-6,2.687-6,6c0,3.314,2.687,6,6,6h41.718c3.314,0,6-2.686,6-6
		                                                        C222.04,144.373,219.354,141.686,216.04,141.686z"/>
	                                                        <path d="M85.163,133.136c17.004,0,30.838-13.839,30.838-30.849c0-17.011-13.834-30.85-30.838-30.85
		                                                        c-17.009,0-30.847,13.839-30.847,30.85C54.316,119.297,68.154,133.136,85.163,133.136z M85.163,86.438
		                                                        c8.733,0,15.838,7.11,15.838,15.85c0,8.739-7.104,15.849-15.838,15.849c-8.738,0-15.847-7.11-15.847-15.849
		                                                        C69.316,93.548,76.425,86.438,85.163,86.438z"/>
	                                                        <path d="M97.097,138.68H73.415c-16.592,0-30.09,13.497-30.09,30.088v12.961c0,4.142,3.357,7.5,7.5,7.5s7.5-3.358,7.5-7.5v-12.961
		                                                        c0-8.319,6.77-15.088,15.09-15.088h23.682c8.32,0,15.09,6.768,15.09,15.088v12.961c0,4.142,3.357,7.5,7.5,7.5s7.5-3.358,7.5-7.5
		                                                        v-12.961C127.187,152.177,113.688,138.68,97.097,138.68z"/>
                                                        </g>
                                                    </svg>
                                                </span>
                                                <input
                                                    {...register('subscriptionType')}
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="text"
                                                    name="subscriptionType"
                                                    id="subscriptionType"
                                                    placeholder="Type d'abonnement ( ex: 'Mensuel', '6 mois', '10 mois' )"
                                                />
                                            </div>
                                            {errors.subscriptionType && (
                                                <p className="text-red-500 text-sm">{errors.subscriptionType.message}</p>
                                            )}
                                    </div>
                                </div>

                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="durationInMonths"
                                        > Durée de l'abonnement en mois </label>
                                        <div className="relative">
                                        <span className="absolute left-4.5 top-4">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 5.5L5 3.5M21 5.5L19 3.5M9 12.5L11 14.5L15 10.5M20 12.5C20 16.9183 16.4183 20.5 12 20.5C7.58172 20.5 4 16.9183 4 12.5C4 8.08172 7.58172 4.5 12 4.5C16.4183 4.5 20 8.08172 20 12.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            </span>
                                            <input
                                                    {...register('durationInMonths')}
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="text"
                                                    name="durationInMonths"
                                                    id="durationInMonths"
                                                    placeholder="Durée de l'abonnement en mois ( ex: 1, 6, 10)"
                                                />

                                        </div> 
                                    </div>
                                </div>


                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="firstName"
                                        > Montant payé </label>
                                            <div className="relative">
                                                <span className="absolute left-4.5 top-4">
                                                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.7255 17.1019C11.6265 16.8844 11.4215 16.7257 11.1734 16.6975C10.9633 16.6735 10.7576 16.6285 10.562 16.5636C10.4743 16.5341 10.392 16.5019 10.3158 16.4674L10.4424 16.1223C10.5318 16.1622 10.6239 16.1987 10.7182 16.2317L10.7221 16.2331L10.7261 16.2344C11.0287 16.3344 11.3265 16.3851 11.611 16.3851C11.8967 16.3851 12.1038 16.3468 12.2629 16.2647L12.2724 16.2598L12.2817 16.2544C12.5227 16.1161 12.661 15.8784 12.661 15.6021C12.661 15.2955 12.4956 15.041 12.2071 14.9035C12.062 14.8329 11.8559 14.7655 11.559 14.6917C11.2545 14.6147 10.9987 14.533 10.8003 14.4493C10.6553 14.3837 10.5295 14.279 10.4161 14.1293C10.3185 13.9957 10.2691 13.7948 10.2691 13.5319C10.2691 13.2147 10.3584 12.9529 10.5422 12.7315C10.7058 12.5375 10.9381 12.4057 11.2499 12.3318C11.4812 12.277 11.6616 12.1119 11.7427 11.8987C11.8344 12.1148 12.0295 12.2755 12.2723 12.3142C12.4751 12.3465 12.6613 12.398 12.8287 12.4677L12.7122 12.8059C12.3961 12.679 12.085 12.6149 11.7841 12.6149C10.7848 12.6149 10.7342 13.3043 10.7342 13.4425C10.7342 13.7421 10.896 13.9933 11.1781 14.1318L11.186 14.1357L11.194 14.1393C11.3365 14.2029 11.5387 14.2642 11.8305 14.3322C12.1322 14.4004 12.3838 14.4785 12.5815 14.5651L12.5856 14.5669L12.5897 14.5686C12.7365 14.6297 12.8624 14.7317 12.9746 14.8805L12.9764 14.8828L12.9782 14.8852C13.0763 15.012 13.1261 15.2081 13.1261 15.4681C13.1261 15.7682 13.0392 16.0222 12.8604 16.2447C12.7053 16.4377 12.4888 16.5713 12.1983 16.6531C11.974 16.7163 11.8 16.8878 11.7255 17.1019Z" fill="#000000"/>
                                                        <path d="M11.9785 18H11.497C11.3893 18 11.302 17.9105 11.302 17.8V17.3985C11.302 17.2929 11.2219 17.2061 11.1195 17.1944C10.8757 17.1667 10.6399 17.115 10.412 17.0394C10.1906 16.9648 9.99879 16.8764 9.83657 16.7739C9.76202 16.7268 9.7349 16.6312 9.76572 16.5472L10.096 15.6466C10.1405 15.5254 10.284 15.479 10.3945 15.5417C10.5437 15.6262 10.7041 15.6985 10.8755 15.7585C11.131 15.8429 11.3762 15.8851 11.611 15.8851C11.8129 15.8851 11.9572 15.8628 12.0437 15.8181C12.1302 15.7684 12.1735 15.6964 12.1735 15.6021C12.1735 15.4929 12.1158 15.411 12.0004 15.3564C11.8892 15.3018 11.7037 15.2422 11.4442 15.1777C11.1104 15.0933 10.8323 15.0039 10.6098 14.9096C10.3873 14.8103 10.1936 14.6514 10.0288 14.433C9.86396 14.2096 9.78156 13.9092 9.78156 13.5319C9.78156 13.095 9.91136 12.7202 10.1709 12.4074C10.4049 12.13 10.7279 11.9424 11.1401 11.8447C11.2329 11.8227 11.302 11.7401 11.302 11.6425V11.2C11.302 11.0895 11.3893 11 11.497 11H11.9785C12.0862 11 12.1735 11.0895 12.1735 11.2V11.6172C12.1735 11.7194 12.2487 11.8045 12.3471 11.8202C12.7082 11.8777 13.0255 11.9866 13.2989 12.1469C13.3765 12.1924 13.4073 12.2892 13.3775 12.3756L13.0684 13.2725C13.0275 13.3914 12.891 13.4417 12.7812 13.3849C12.433 13.2049 12.1007 13.1149 11.7841 13.1149C11.4091 13.1149 11.2216 13.2241 11.2216 13.4425C11.2216 13.5468 11.2773 13.6262 11.3885 13.6809C11.4998 13.7305 11.6831 13.7851 11.9386 13.8447C12.2682 13.9192 12.5464 14.006 12.773 14.1053C12.9996 14.1996 13.1953 14.356 13.3602 14.5745C13.5291 14.7929 13.6136 15.0908 13.6136 15.4681C13.6136 15.8851 13.4879 16.25 13.2365 16.5628C13.0176 16.8354 12.7145 17.0262 12.3274 17.1353C12.2384 17.1604 12.1735 17.2412 12.1735 17.3358V17.8C12.1735 17.9105 12.0862 18 11.9785 18Z" fill="#000000"/>
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.59235 5H13.8141C14.8954 5 14.3016 6.664 13.8638 7.679L13.3656 8.843L13.2983 9C13.7702 8.97651 14.2369 9.11054 14.6282 9.382C16.0921 10.7558 17.2802 12.4098 18.1256 14.251C18.455 14.9318 18.5857 15.6958 18.5019 16.451C18.4013 18.3759 16.8956 19.9098 15.0182 20H8.38823C6.51033 19.9125 5.0024 18.3802 4.89968 16.455C4.81587 15.6998 4.94656 14.9358 5.27603 14.255C6.12242 12.412 7.31216 10.7565 8.77823 9.382C9.1696 9.11054 9.63622 8.97651 10.1081 9L10.0301 8.819L9.54263 7.679C9.1068 6.664 8.5101 5 9.59235 5Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M13.2983 9.75C13.7125 9.75 14.0483 9.41421 14.0483 9C14.0483 8.58579 13.7125 8.25 13.2983 8.25V9.75ZM10.1081 8.25C9.69391 8.25 9.35812 8.58579 9.35812 9C9.35812 9.41421 9.69391 9.75 10.1081 9.75V8.25ZM15.9776 8.64988C16.3365 8.44312 16.4599 7.98455 16.2531 7.62563C16.0463 7.26671 15.5878 7.14336 15.2289 7.35012L15.9776 8.64988ZM13.3656 8.843L13.5103 9.57891L13.5125 9.57848L13.3656 8.843ZM10.0301 8.819L10.1854 8.08521L10.1786 8.08383L10.0301 8.819ZM8.166 7.34357C7.80346 7.14322 7.34715 7.27469 7.1468 7.63722C6.94644 7.99976 7.07791 8.45607 7.44045 8.65643L8.166 7.34357ZM13.2983 8.25H10.1081V9.75H13.2983V8.25ZM15.2289 7.35012C14.6019 7.71128 13.9233 7.96683 13.2187 8.10752L13.5125 9.57848C14.3778 9.40568 15.2101 9.09203 15.9776 8.64988L15.2289 7.35012ZM13.2209 8.10709C12.2175 8.30441 11.1861 8.29699 10.1854 8.08525L9.87486 9.55275C11.0732 9.80631 12.3086 9.81521 13.5103 9.57891L13.2209 8.10709ZM10.1786 8.08383C9.47587 7.94196 8.79745 7.69255 8.166 7.34357L7.44045 8.65643C8.20526 9.0791 9.02818 9.38184 9.88169 9.55417L10.1786 8.08383Z" fill="#000000"/>
                                                    </svg>
                                                </span>
                                                <input
                                                    {...register('amountPaid')}
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="text"
                                                    name="amountPaid"
                                                    id="amountPaid"
                                                    placeholder="Montant payé"
                                                />
                                            </div>
                                            {errors.subscriptionType && (
                                                <p className="text-red-500 text-sm">{errors.subscriptionType.message}</p>
                                            )}
                                    </div>
                                </div>
                                
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="invoiceNumber"
                                        > Numéro de facture </label>
                                        <div className="relative">
                                            <span className="absolute left-4.5 top-4">
                                                <svg fill="#000000" width="20" height="20" viewBox="0 0 32 32" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><rect height="1" width="12" x="10" y="2"/><rect height="1" width="12" x="10" y="2"/><rect height="1" transform="translate(-9.5 22.5) rotate(-90)" width="20" x="-3.5" y="15.5"/><rect height="1" transform="translate(11.5 39.5) rotate(-90)" width="16" x="17.5" y="13.5"/><rect height="1" width="6" x="17" y="6"/><rect height="1" width="14" x="9" y="9"/><rect height="1" width="14" x="9" y="12"/><rect height="1" width="14" x="9" y="15"/><rect height="1" width="14" x="9" y="18"/><rect height="1" width="10" x="9" y="21"/><rect height="1" width="7" x="9" y="24"/>
                                                    <path d="M22,2V3h2a1,1,0,0,1,1,1V6h1V4a2,2,0,0,0-2-2Z"/>
                                                    <path d="M10,2V3H8A1,1,0,0,0,7,4V6H6V4A2,2,0,0,1,8,2Z"/>
                                                    <path d="M8,30V29H8a1,1,0,0,1-1-1V26H6v2a2,2,0,0,0,2,2Z"/>
                                                    <path d="M21.91,21.15c-.57-.32-.91-.72-.91-1.15a6.09,6.09,0,0,1-.21,1.59c-1,4.07-6,7.18-12.12,7.4H8v1h.72c8.86-.15,16.07-3.15,17.14-7A3.77,3.77,0,0,0,26,22,8.72,8.72,0,0,1,21.91,21.15Zm-5.78,7a10.5,10.5,0,0,0,5.54-6,8.94,8.94,0,0,0,3.15.79C24.07,25,20.91,27,16.13,28.13Z"/>
                                                </svg>
                                            </span>
                                        
                                                <input
                                                    {...register('invoiceNumber')}
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="text"
                                                    name="invoiceNumber"
                                                    id="invoiceNumber"
                                                    placeholder="Numéro de facture"
                                                />
                                            </div>
                                            {errors.invoiceNumber && (
                                                <p className="text-red-500 text-sm">{errors.invoiceNumber.message}</p>
                                            )}
                                    </div>
                                </div>
                               
                                <div className="flex justify-end gap-4.5 mt-5">

<button
type="submit"
className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
disabled={isLoading}
>
{isLoading ? "Chargement..." : "Créer une transaction"}
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
                            

                

                    </div>
                </div>

                </div>
                
                </form>
                                </>
                                )}
            
        </DefaultLayout>
    )
  };
  
  export default AddTransaction;
