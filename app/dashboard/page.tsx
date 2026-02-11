"use client"
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import { getTotalTransactionAmount, getTotalTransactionCount, getReachedBudget, getUserBudgetsData, getLastTransaction, getLastBudget } from '../actions';
import Wrapper from '@/components/Wrapper';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Budget, Transaction } from '@/types';
import BudgetItem from '@/components/BudgetItem';
import Link from 'next/link';


const page = () => {
    const { user } = useUser();
    const [totalAmount, setTotalAmount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [reachedBudget, setReachedBudget] = useState<string | null>(null);
    const [budgetData, setBudgetData] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const email = user?.primaryEmailAddress?.emailAddress as string
            if (email) {
                const amount = await getTotalTransactionAmount(email)
                const count = await getTotalTransactionCount(email)
                const reached = await getReachedBudget(email)
                const budgetsData = await getUserBudgetsData(email) 
                const lastTransactions = await getLastTransaction(email)
                const lastBudgets = await getLastBudget(email)
                setReachedBudget(reached)
                setTotalAmount(amount);
                setTotalCount(count)
                setBudgetData(budgetsData)
                setTransactions(lastTransactions)
                setBudgets(lastBudgets)
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    return (
        <Wrapper>
            {isLoading ? (
                <div className='flex justify-center items-center h-40'>
                    <span className='loading loading-spinner loading-lg'></span>
                </div>
            ) : (
                <div>
                    <div className='grid md:grid-cols-3 gap-4'>
                        <div className='border-2 border-base-300 p-5 flex justify-between items-center rounded-xl'>
                            <div className='flex flex-col'>
                                <span className='text-gray-400 text-sm'>Total des transactions : </span>
                                <span className='text-2xl font-bold text-accent'>{totalAmount !== null ? totalAmount : "0"}€</span>
                            </div>
                        </div>
                        <div className='border-2 border-base-300 p-5 flex justify-between items-center rounded-xl'>
                            <div className='flex flex-col'>
                                <span className='text-gray-400 text-sm'>Nombre de transactions : </span>
                                <span className='text-2xl font-bold text-accent'>{totalCount !== null ? totalCount : "0"}</span>
                            </div>
                        </div>
                        <div className='border-2 border-base-300 p-5 flex justify-between items-center rounded-xl'>
                            <div className='flex flex-col'>
                                <span className='text-gray-400 text-sm'>Budgets atteints : </span>
                                <span className='text-2xl font-bold text-accent'>{reachedBudget !== null ? reachedBudget : "0"}</span>
                            </div>
                        </div>
                    </div>

                    <div className='w-full md:flex mt-4'>
                        <div className='rounded-xl md:w-2/3 border-2 border-base-300 p-4'>
                            <ResponsiveContainer height={250} width="100%">
                                <BarChart data={budgetData}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <XAxis dataKey="budgetName" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        name="Budget"
                                        dataKey="totalBudgetAmount"
                                        fill="#EF9FBC" 
                                        radius={[10, 10, 0, 0]}
                                    />
                                    <Bar
                                        name="Dépensé"
                                        dataKey="totalTransactionAmount" 
                                        fill="#641ae6" 
                                        radius={[10, 10, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className='md:w-1/3 ml-4'>
                            <h3 className='text-lg font-semibold my-4 md:mb-4 md:mt-0'>
                                Derniers Budgets
                            </h3>
                            <ul className="grid grid-cols-1 gap-3">
                                {budgets.map((budget) => (
                                    <Link href={`/manage/${budget.id}`} key={budget.id}>
                                        <BudgetItem budget={budget} enableHover={1}></BudgetItem>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </Wrapper>
    )
}

export default page

