"use client"
import React, {useEffect, useState} from "react"
import Wrapper from "@/components/Wrapper"
import { useUser } from "@clerk/nextjs"
import EmojiPicker from "emoji-picker-react"
import { addBudget, getBudgetByUser } from "../actions"
import Notification from "@/components/Notification"
import { Budget } from "@/types"
import BudgetItem from "@/components/BudgetItem"
import Link from 'next/link'
import { Coins } from "lucide-react"

const page = () => {
const { user }  = useUser()
const [budgetName, setBudgetName] = useState <string> ("");
const [ budgetAmount,  setBudgetAmount]  = useState <string> ("") 
const [showEmojiePicker, setShowEmojiePicker] = useState <boolean> (false)
const [emojieSelected, setEmojieSelected] = useState <string> ("") 
const [budgets, setBudgets] = useState <Budget[]>([])

const [notification,setNotification] = useState<string>("")
 const closeNotification = () => {
  setNotification("")
 } 

const handleEmojiSelect = (emojiObject : {emoji : string}) => {
  setEmojieSelected (emojiObject.emoji)
  setShowEmojiePicker(false)
}

const handleAddBudget = async () => {
  try{
  const amount = parseFloat(budgetAmount);
  if (isNaN(amount) || amount <= 0) {
    throw ("Le montant doit etre positif.")
  }
  await addBudget(
    user?.primaryEmailAddress?.emailAddress as string,
    budgetName,
    amount,
    emojieSelected
    
  )
    fetchBudgets()
  const modal = document.getElementById("my_modal_3") as HTMLDialogElement

  if (modal) {
    modal.close()
  }
    
    setNotification("Nouveau budget créé avec succès.")
    setBudgetName("")
    setBudgetAmount("")
    setEmojieSelected("")
    setShowEmojiePicker(false)

  } catch (error) {
    setNotification(`Erreur lors de la création du budget : ${error}`)
  }
} 



const fetchBudgets = async () => {
  if(user?.primaryEmailAddress?.emailAddress){
    try{
      const userBudgets = await getBudgetByUser (user?.primaryEmailAddress?.emailAddress)
   
      setBudgets(userBudgets)
    } catch (error) {
      setNotification(`Erreur lors de la récupération des budgets: ${error}`)
    }
  }
}
useEffect(()=> {
  fetchBudgets()
}, [user?.primaryEmailAddress?.emailAddress])




  return (<Wrapper> 

     <h2 className='font-bold text-4xl text-center mb-10'>Mes Budgets</h2>

    {notification && (
                <Notification message={notification} onclose={closeNotification} />
            )}
    
        <button className="btn mb-4" onClick={()=> (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>Nouveau budget <Coins /> </button>
<dialog id="my_modal_3" className="modal ">
  <div className="modal-box">
    <form method="dialog">
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Création d'un nouveau budget</h3>
    <p className="py-4">Contrôler vos dépense facilement </p>
    <div className="w-full flex flex-col">
        <input type="text" className="input input-accent input-bordered mb-3" 
        value={budgetName}
        placeholder="Nom du budget"
        onChange={(e) => setBudgetName(e.target.value)}
        required/>

         <input type="number" className="input input-accent input-bordered mb-3" 
        value={budgetAmount}
        placeholder="Montant du budget"
        onChange={(e) => setBudgetAmount(e.target.value)}
        required />
        <button className="btn btn-secondary mb-3" onClick={()=> setShowEmojiePicker(!showEmojiePicker)}>{emojieSelected || "Selectionnez l'icône du budget😁​ "}</button>
        {showEmojiePicker &&
        <div className="flex justify-center items-center"> <EmojiPicker onEmojiClick={handleEmojiSelect}/> </div>
        }

        <button onClick={handleAddBudget} className="btn btn-accent">
            Valider
        </button>
    </div>
  </div>
</dialog>

<ul className="grid md:grid-cols-3 gap-3">
{budgets.map((budget) => (
  <Link href={`/manage/${budget.id}`} key={budget.id}>
  <BudgetItem budget={budget} enableHover={1}></BudgetItem>
  </Link>
))}
    
</ul>

    </Wrapper>)
    
  
}

export default page