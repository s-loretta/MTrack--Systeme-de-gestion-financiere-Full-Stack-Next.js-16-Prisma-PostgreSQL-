"use client"
import BudgetItem from "@/components/BudgetItem";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import budgets from "./data";
import { useEffect } from "react";
import { checkAndAddUser } from "./actions";
import { useUser } from "@clerk/nextjs";

export default function Home() {

const { isLoaded, isSignedIn, user } = useUser()
        
    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            checkAndAddUser(user?.primaryEmailAddress?.emailAddress)
        }
    }, [user])


  return (
    <div> 
      <Navbar/>
      <div className="flex items-center justify-center flex-col py-10 w-full">
        <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-bold text-center gradient-text ">Prenez le contrôle <br /> de vos finances
            </h1>
            <p className="py-6 text-center">Suivez vos budgets et depenses <br /> en tout simplicité avec notre application de gestion !</p>
            <div className="flex items-center justify-center" >{isSignedIn ? (
                <Link href={"/dashboard"} className="btn btn-sm md:btn-md btn-accent">Accéder au tableau de bord</Link>
            ) : (
                 <div>
              <Link href={"/sign-in"} className="btn btn-sm md:btn-md btn-outline btn-accent">Se connecter </Link>
             <Link href={"/sign-up"} className="btn btn-sm md:btn-md ml-3  btn-accent">S'inscrire </Link>

            </div>)}</div>

            <ul className="grid md:grid-cols-3 gap-3 mt-6 md:min-w-[1200px]">
{budgets.map((budget) => (
  <Link href={`/manage/${budget.id}`} key={budget.id}>
  <BudgetItem budget={budget} enableHover={1}></BudgetItem>
  </Link>
))}
    
</ul>

        </div>
      </div>
    </div>
  );
}
