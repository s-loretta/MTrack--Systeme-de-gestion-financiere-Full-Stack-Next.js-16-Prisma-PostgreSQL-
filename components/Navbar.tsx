"use client"
import React, { useEffect } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { checkAndAddUser } from '@/app/actions'


const Navbar = () => {
    const { isLoaded, isSignedIn, user } = useUser()
        
    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            checkAndAddUser(user?.primaryEmailAddress?.emailAddress)
        }
    }, [user])

    return (
        <div className='bg-base-200/30 px-5 md:px-[10%] py-4'>
            {isLoaded && ( 
                (isSignedIn ? (
                    <> {/* Added React Fragment to contain the sibling elements */}
                        <div className='flex justify-between items-center'>
                           <Link href={"/"}> <div className='flex text-2xl items-center font-bold'>
                               m <span className='text-accent'>.Track</span>
                            </div></Link> 
                            <div className='md:flex hidden'> 
                                {/* This is the intended desktop navigation block */}
                                <Link href={"/budgets"} className='btn btn-secondary btn-ghost '> Mes budgets</Link>
                                <Link href={"/dashboard"} className='btn btn-secondary btn-ghost'> Tableau de bord </Link>
                                <Link href={"/transactions"} className='btn btn-secondary btn-ghost' > Mes Transactions</Link>
                            </div>
                            <UserButton/>
                        </div>
                        
                           <div className='md:hidden flex mt-2 justify-center'> 
                               <Link href={"/budgets"} className='btn btn-secondary btn-ghost btn-sm'> Mes budgets</Link>
                               <Link href={"/dashboard"} className='btn btn-secondary btn-ghost btn-sm'> Tableau de bord </Link>
                               <Link href={"/transactions"} className='btn btn-secondary btn-ghost btn-sm' > Mes Transactions</Link>
                           </div> 
                        
                    </> 
                ) : (
                    <div>
                            <div className='flex justify-between items-center'>
                            <div className='flex text-2xl items-center font-bold'>
                                m <span className='text-accent'>.Track</span>
                            </div>
                            <div className='flex mt-2 justify-center'> 
                                <Link href={"/sign-up"} className='btn btn-secondary btn-ghost mx-4 '> S'inscrire</Link>
                                <Link href={"/sign-in"} className='btn btn-accent btn-ghost'> Se connecter  </Link>
                           </div>
                            
                        </div> 

                    </div> 
                ))
            )} 
        </div>
    )
}

export default Navbar



