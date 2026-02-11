"use server"
import prisma from "@/lib/prisma" 
import budgets from "./data"
import { Budget,Transaction } from "@/types";

export async function checkAndAddUser(email :string | undefined) {
    if (!email) return
    try {
        const existingUser = await prisma.user.findUnique({
            where : {
                email
            }
    
        })
    if (!existingUser){
        await prisma.user.create({
            data:{email}
        })
        console.log("Nouvel utilisateur créé dans la base de données")
    }else{
        console.log ("Utilisateur déjà dans la base de données")
    }
    } catch (error) {
        console.error("Erreur lors de la vérifiaction de l'utilisateur:",error)
    }
    }

export async function addBudget(email :string, name: string , amount : number, selectedEmojie : string) {
    try {
        const user = await prisma.user.findUnique({
            where : {email}
        })

        if (!user) {
            throw new Error ('Utilisateur non trouvé')
        }

        await prisma.budget.create({
            data : {
                name , 
                amount,
                emoji : selectedEmojie,
                userId : user.id
            }
        })
        
    } catch (error) { 
        console.error("Erreur lors de l'ajout du budget", error)
        throw error
    }
}

export async function getBudgetByUser(email :string) {
    try {
        const user = await prisma.user.findUnique({
            where : {
                email
            },
            include : {
                budgets: {
                    include : {
                        transactions : true
                    }
                }
            }
        })
        if (!user){
            throw new Error("Utilisateur non trouvé") 
        }

        return user.budgets

    } catch (error) {
        console.error(`Erreur lors de la recupération des budgets:`,error);
        throw error
    }
}

export async function getTransactionByBudgetId(budgetId: string) {
    try {
        const budget = await prisma.budget.findUnique({
            where: {
                id: budgetId
            },
            include :{
                transactions : true
            }
        })
        if (!budget){
            throw new Error('Budget non trouvé');
        }
        return budget;

    } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        throw error;
    }
}

export async function addTranscationToBudget(
    budgetId: string,
    amount: number,
    description: string,
    emoji : string
) {
    try {
        const budget = await prisma.budget.findUnique({
            where : {
                id: budgetId
            },
            include : {
                transactions: true
            }
        })

        if (!budget){
            throw new Error ('Budget non trouvé.');
        }

           const totalTransactions = budget.transactions.reduce( (sum , transaction) =>{ return sum + transaction.amount} ,0)

           const totalWithNewtransac = totalTransactions + amount

           if( totalWithNewtransac > budget.amount) {
            throw new Error("Le  montant total des transactions depasse le budget") 
           }

           const newTransaction = await prisma.transaction.create({
            data: {
                amount , 
                description,
                emoji : emoji,
                budget : {
                    connect : {
                        id : budget.id
                    }
                }
            }
           })

    } catch (error) {
        console.error("Erreur lors de l'ajout de la transaction:", error);
        throw error
        
    }
}

export const deleteBudget = async (budgetId: string) => {
    try {
        await prisma.transaction.deleteMany({
            where: { budgetId }
        })

        await prisma.budget.delete({
            where: {
                id: budgetId
            }
        })
    } catch (error) {
        console.error('Erreur lors de la suppression du budget et de ses transactions associées: ', error);
        throw error;
    }
}

export async function deleteTransaction(transactionId: string) {
    try {
        console.log(" id de la transact", transactionId)
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: transactionId
            }
        })

        if (!transaction) {
            throw new Error('Transaction non trouvée.');
        }

        await prisma.transaction.delete({
            where: {
                id: transactionId,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la transaction:', error);
        throw error;
    }
}

export async function getTransactionsByEmailAndPeriod(email: string, period: string) {
    try {
        const now = new Date();
        let dateLimit

        switch (period) {
            case 'last30':
                dateLimit = new Date(now)
                dateLimit.setDate(now.getDate() - 30);
                break
            case 'last90':
                dateLimit = new Date(now)
                dateLimit.setDate(now.getDate() - 90);
                break
            case 'last7':
                dateLimit = new Date(now)
                dateLimit.setDate(now.getDate() - 7);
                break
            case 'last365':
                dateLimit = new Date(now)
                dateLimit.setFullYear(now.getFullYear() - 1);
                break
            default:
                throw new Error('Période invalide.');
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                budgets: {
                    include: {
                        transactions: {
                            where: {
                                createdAt: {
                                    gte: dateLimit
                                }
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        }
                    }

                }
            }
        })


        if (!user) {
            throw new Error('Utilisateur non trouvé.');
        }

        const transactions = user.budgets.flatMap(budget =>
            budget.transactions.map(transaction => ({
                ...transaction,
                budgetName: budget.name,
                budgetId: budget.id
            }))
        )

        return transactions

    } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        throw error;
    }
}

export async function getTotalTransactionAmount(email:string){
    try {
        const user = await prisma.user.findUnique({
            where : {email},
            include : {
                budgets : {
                    include : {
                        transactions : true
                    }
                }
            }
        })
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        let totalAmount = 0;
        user.budgets.forEach(budget => {
            budget.transactions.forEach(transaction => {
                totalAmount += transaction.amount;
            });
        });
        return totalAmount;
    } catch (error) {
        console.error("Erreur lors du calcul du montant total des transactions:", error);
        throw error;
    }
}

export async function getTotalTransactionCount(email:string){
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                budgets: {
                    include: {
                        transactions: true
                    }
                }
            }
        })
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        let totalCount = 0;
        user.budgets.forEach(budget => {
            totalCount += budget.transactions.length;
        });
        return totalCount;
    } catch (error) {
        console.error("Erreur lors du calcul du nombre total des transactions:", error);
        throw error;
    }
}

export async function getReachedBudget(email:string){
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                budgets: {
                    include: {
                        transactions: true
                    }
                }
            }
        })
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        const totalBudgets = user.budgets.length
        const reachedBudgets = user.budgets.filter(budget => {
            const totalAmount = budget.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
            return totalAmount >= budget.amount;
        }).length

        return `${reachedBudgets} / ${totalBudgets}`
        
    } catch (error) {
        console.error("Erreur lors du calcul du nombre de budgets atteints:", error);
        throw error;
    }
}

export async function getUserBudgetsData(email:string){
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                budgets: {
                    include: { transactions: true }
                }
            }
        })
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        const budgetsData = user.budgets.map(budget => {
            const totalAmount = budget.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
            return {
                budgetName: budget.name,
                totalBudgetAmount: budget.amount,
                totalTransactionAmount: totalAmount,
            }
        })
        return budgetsData
    } catch (error) {
        console.error("Erreur lors de la récupération des données des budgets de l'utilisateur:", error);
        throw error;
    }}

export async function getLastTransaction(email:string) {
   try {
    const transactions = await prisma.transaction.findMany({
        where: {
            budget: {
                user: {
                    email : email
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10,
        include: {
            budget: {
                select: {
                    name: true,
                }
            }
            }
    })
    const transactionsWithBudgetName = transactions.map(transaction => ({
        ...transaction,
        budgetName: transaction.budget?.name || 'N/A'
    }))
    return transactionsWithBudgetName
}
    catch (error) {
        console.error("Erreur lors de la récupération de la dernière transaction:", error);
        throw error;
    }
}

export async function getLastBudget(email:string) {
    try {
        const budgets = await prisma.budget.findMany({
            where: {
                user: {
                    email : email
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 3,
            include: {
                transactions: true
            }
        })
        return budgets
    } catch (error) {
        console.error("Erreur lors de la récupération du dernier budget:", error);
        throw error;
    }
}
