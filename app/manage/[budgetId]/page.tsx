"use client"
import { addTranscationToBudget, deleteBudget, deleteTransaction, getTransactionByBudgetId } from '@/app/actions'
import BudgetItem from '@/components/BudgetItem'
import Wrapper from '@/components/Wrapper'
import { Budget,Transaction } from '@/types'
import React, { useEffect, useState } from 'react'
import Notification from '@/components/Notification'
import { Send, Trash } from 'lucide-react'
import { redirect } from 'next/navigation'
import EmojiPicker from "emoji-picker-react"

const page = ({ params }: { params: Promise<{ budgetId: string }> }) => {
  const [budgetId, setBudgetId] = useState<string>('')
  const [budget, setBudget] = useState<Budget>()
  const [description, setDescription] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [showEmojiePicker, setShowEmojiePicker] = useState <boolean> (false)
  const [emojieSelected, setEmojieSelected] = useState <string> ("") 

  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("")
  }

  const handleEmojiSelect = (emojiObject : {emoji : string}) => {
  setEmojieSelected (emojiObject.emoji)
  setShowEmojiePicker(false)}

  async function fetchBudgetData(budgetId: string) {
    try {
      if (budgetId) {
        const budgetData = await getTransactionByBudgetId(budgetId)
        setBudget(budgetData)
      }

    } catch (error) {
      console.error(
        "Erreur lors de la récupération du budget et des transactions:",
        error)
    }
  }

  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params;
      setBudgetId(resolvedParams.budgetId)
      fetchBudgetData(resolvedParams.budgetId)
    }
    getId()
  }, [params])

  const handleAddTransaction = async () => {
    if (!amount || !description || !emojieSelected) {
      setNotification("Veuillez remplir tous les champs.")
      return;
    }

    try {
      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        throw new Error("Le montant doit être un nombre positif.");
      }
      const newTransaction = await addTranscationToBudget(budgetId, amountNumber, description, emojieSelected)

      setNotification(`Transaction ajoutée avec succès`)
      fetchBudgetData(budgetId)
      setAmount('')
      setDescription('')
      setEmojieSelected("")
    setShowEmojiePicker(false)
    } catch (error) {
      setNotification(`Vous avez dépassé votre budget`)
    }
  }

  const handleDeleteBudget = async () => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce budget et toutes ses transactions associées ?"
    )
    if (confirmed) {
      try {
        await deleteBudget(budgetId)
      } catch (error) {
        console.error("Erreur lors de la suppression du budget:", error);
      }
      redirect("/budgets")
    }
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette transaction ?"
    )
    if (confirmed) {
      try {
        await deleteTransaction(transactionId)
        fetchBudgetData(budgetId)
        setNotification("Dépense supprimée")
      } catch (error) {
        console.error("Erreur lors de la suppression du budget:", error);
      }
    }
  }

  return (
    <Wrapper>

      {notification && (
        < Notification message={notification} onclose={closeNotification}></Notification>
      )}
      {budget && (
        <div className='flex md:flex-row flex-col'>
          <div className='md:w-1/3'>
            <BudgetItem budget={budget} enableHover={0} />
            <button
              onClick={() => handleDeleteBudget()}
              className='btn btn-accent mt-4'
            >
              supprimer le budget
            </button>
            <div className='space-y-4 flex flex-col mt-4'>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
                className="input input-bordered"
              />

              <input
                type="number"
                id="amount"
                placeholder="Montant"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className=" input input-bordered"
              />
              <button className="btn btn-secondary mb-3" onClick={()=> setShowEmojiePicker(!showEmojiePicker)}>{emojieSelected || "Selectionnez l'icône du budget😁​ "}</button>
                      {showEmojiePicker &&
                      <div className="flex justify-center items-center"> <EmojiPicker onEmojiClick={handleEmojiSelect}/> </div>
                      }
              <button
                onClick={handleAddTransaction}
                className="btn"
              >
                Ajouter votre dépense
              </button>

            </div>
          </div>


          {budget?.transactions && budget.transactions.length > 0 ? (
            <div className="overflow-x-auto md:mt-0 mt-4 md:w-2/3 ml-4">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th ></th>
                    <th >Montant</th>
                    <th >Description</th>
                    <th >Date</th>
                    <th >Heure</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {budget?.transactions?.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className='text-lg md:text-3xl'>{transaction.emoji}</td>
                      <td>
                        <div className="badge badge-accent badge-xs md:badge-sm">
                          - {transaction.amount} €</div>
                      </td>
                      <td>{transaction.description}</td>
                      <td>
                        {transaction.createdAt.toLocaleDateString("fr-FR")}
                      </td>
                      <td>
                        {transaction.createdAt.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        })}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className='btn btn-sm btn-ghost btn-accent '
                        >
                          <Trash className='w-4' />
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          ) : (
            <div className='md:w-2/3 mt-10 md:ml-4 flex items-center justify-center'>
              <Send strokeWidth={1.5} className='w-8 h-8 text-accent' />
              <span className='text-gray-500 ml-2'>aucune transaction.</span>
            </div>
          )}
        </div>
      )}
    </Wrapper>
  )
}

export default page