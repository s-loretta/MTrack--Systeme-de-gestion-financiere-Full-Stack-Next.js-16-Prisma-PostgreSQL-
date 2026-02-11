import { Transaction } from '@/types';
import Link from 'next/link';
import React from 'react'

interface TransactionItemProps {
    transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {

    return (
        <li key={transaction.id} className='flex justify-between items-center  rounded-xl border-base-300 list-none border-2 my-2 px-3'>
            <div className='flex my-4'>
                <div className='bg-accent/20 text-xl h-10 w-10 rounded-full flex justify-center items-center '>
                    {transaction.emoji} </div>
                <button className='btn'>
                    <div className="badge badge-accent ">- {transaction.amount} €</div>
                    {transaction.description}
                </button>
            </div>
            <div className='md:hidden flex flex-col items-end'>
                <span className='font-bold text-sm'>{transaction.budgetName}</span>
                <span className='text-sm'>
                    {transaction.createdAt.toLocaleDateString("fr-FR")} à {" "}
                    {transaction.createdAt.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>


            <div className='hidden md:flex'>
                <span className='font-bold text-sm'>
                    {transaction.budgetName}
                </span>
            </div>

            <div className='hidden md:flex'>
                {transaction.createdAt.toLocaleDateString("fr-FR")} à {" "}
                {transaction.createdAt.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </div>

            <div className='hidden md:flex'>
                <Link href={`/manage/${transaction.budgetId}`}  className='btn'>
                Voir plus
                </Link>
            </div>



        </li>
    )
}

export default TransactionItem