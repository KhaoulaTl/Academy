"use client";
import { useState } from 'react';
import axios from 'axios';

function TransactionForm() {
  const [actionType, setActionType] = useState('create'); // 'create' or 'pay'
  const [playerId, setPlayerId] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('');
  const [durationInMonths, setDurationInMonths] = useState(1);
  const [amount, setAmount] = useState(0);
  const [insurancePayment, setInsurancePayment] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      if (actionType === 'create') {
        // Création de la transaction
        await axios.post('/api/transaction/create', { 
          playerId, 
          subscriptionType, 
          durationInMonths, 
          amountPaid: amount 
        });
        alert('Transaction créée avec succès !');
      } else {
        // Paiement pour une transaction existante
        await axios.post('/api/transaction/pay', { 
          playerId, 
          amount, 
          insurancePayment 
        });
        alert('Paiement effectué avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la transaction', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
        <option value="create">Créer une transaction</option>
        <option value="pay">Effectuer un paiement</option>
      </select>


      {actionType === 'create' && (
        <>
          <input 
            value={subscriptionType} 
            onChange={(e) => setSubscriptionType(e.target.value)} 
            placeholder="Type d'abonnement" 
            required 
          />
          <input 
            type="number" 
            value={durationInMonths} 
            //onChange={(e) => setDurationInMonths(e.target.value)} 
            placeholder="Durée (mois)" 
            required 
          />
        </>
      )}

      <input 
        type="number" 
        value={amount} 
        //onChange={(e) => setAmount(e.target.value)} 
        placeholder="Montant" 
        required 
      />

      {actionType === 'pay' && (
        <label>
          <input 
            type="checkbox" 
            checked={insurancePayment} 
            onChange={(e) => setInsurancePayment(e.target.checked)} 
          />
          Paiement d'assurance
        </label>
      )}

      <button type="submit">
        {actionType === 'create' ? 'Créer la transaction' : 'Payer'}
      </button>
    </form>
  );
}

export default TransactionForm;
