import React, { useState } from 'react';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import SalesAndPurchaseOptions from './SalesOptions'
import './Home.css'
import Quotation from './Quotation'
import Invoice from './Invoice'
import CreditNote from './CreditNote';
import Receipt from './Receipt'
import ReceivePayment from './ReceivePayment'
import PurchaseInvoice from './PurchaseInvoice'
import MakePayment from './MakePayment'
import DebitNote from './DebitNote'
import PurchaseReturns from './PurchaseReturns'
import PurchaseOrder from './PurchaseOrder'
import NewExpense from './NewExpense'
import CashPurchase from './CashPurchase'

function Home() {
    const [newQuotation, setNewQuotation] = useState(false)
    const [newInvoice, setNewInvoice] = useState(false)
    const [newCreditNote, setNewCreditNote] = useState(false)
    const [newReceipt, setNewReceipt] = useState(false)
    const [newReceivePayment, setNewReceivePayment] = useState(false)
    const [newPurchaseInvoice, setNewPurchaseInvoice] = useState(false)
    const [newMakePayment, setNewMakePayment] = useState(false)
    const [newDebitNote, setNewDebitNote] = useState(false)
    const [newPurchaseReturns, setNewPurchaseReturns] = useState(false)
    const [newPurchaseOrder, setNewPurchaseOrder] = useState(false)
    const [newExpense, setNewExpense] = useState(false)
    const [newCashPurchase, setNewCashPurchase] = useState(false)


    // testing for FIFO make sure to delete

    // const sales = [200, 300, 500, 700, 900]
    // const purchases = [500, 200, 50, 800, 300, 700, 300]

    // let totalSales  = sales.reduce((a, b) => a + b, 0)
    // let prevPurchases = 0
    // let salesLeft = 0
    
    // for (let i = 0; i <= purchases.length; i++) {
        
    //     const index = 0
    //     const element = purchases[index];

    //     if (totalSales >=  prevPurchases) {
    //         prevPurchases += element
    //         purchases.shift()
            
    //         totalSales -= element
    //         salesLeft += sales[i]

    //         if(prevPurchases >= totalSales) {
    //             const exitItem = sales[i + 1]
    //             if (exitItem > element) {
    //                 const newElement = salesLeft - prevPurchases
    //                 const nextDeduct = exitItem - newElement
    //                 console.log(element, totalSales, prevPurchases, salesLeft, newElement, nextDeduct);
    //             }
                
    //         }
    //     }
        
        
    // }

    // console.log(purchases);








    return (
        <div className="Home">
            <div className="home-content">
                <SalesAndPurchaseOptions
                    newQuotation={() => {
                        setTimeout(() => {
                            setNewQuotation(true)
                        }, 500)
                    }}

                    newInvoice={() => {
                        setTimeout(() => {
                            setNewInvoice(true)
                        }, 500)
                    }}

                    newCreditNote={() => {
                        setTimeout(() => {
                            setNewCreditNote(true)
                        }, 500)
                    }}

                    newReceipt={() => {
                        setTimeout(() => {
                            setNewReceipt(true)
                        }, 500)
                    }}

                    newReceivePayment={() => {
                        setTimeout(() => {
                            setNewReceivePayment(true)
                        }, 500)
                    }}

                    newPurchaseInvoice={() => {
                        setTimeout(() => {
                            setNewPurchaseInvoice(true)
                        }, 500)
                    }}

                    newMakePayment={() => {
                        setTimeout(() => {
                            setNewMakePayment(true)
                        }, 500)
                    }}

                    newDebitNote={() => {
                        setTimeout(() => {
                            setNewDebitNote(true)
                        })
                    }}

                    newPurchaseReturns={() => {
                        setTimeout(() => {
                            setNewPurchaseReturns(true)
                        }, 500)
                    }}

                    newPurchaseOrder={() => {
                        setTimeout(() => {
                            setNewPurchaseOrder(true)
                        })
                    }}

                    newExpense={() => {
                        setTimeout(() => {
                            setNewExpense(true)
                        }, 500)
                    }}

                    newCashPurchase={() => {
                        setTimeout(() => {
                            setNewCashPurchase(true)
                        }, 500)
                    }}

                />


            </div>
            {
                newQuotation && <Quotation onClick={() => { setNewQuotation(false) }} />
            }

            {
                newInvoice && <Invoice
                    onClick={() => {
                        setNewInvoice(false)
                    }}
                />
            }

            {
                newCreditNote && <CreditNote
                    onClick={() => {
                        setNewCreditNote(false)
                    }}
                />
            }

            {
                newReceipt && <Receipt
                    onClick={() => {
                        setNewReceipt(false)
                    }}
                />
            }

            {
                newReceivePayment && <ReceivePayment
                    onClick={() => {
                        setNewReceivePayment(false)
                    }}
                />
            }

            {
                newPurchaseInvoice && <PurchaseInvoice
                    onClick={() => {
                        setNewPurchaseInvoice(false)
                    }}
                />
            }

            {
                newMakePayment && <MakePayment
                    onClick={() => {
                        setNewMakePayment(false)
                    }}
                />
            }

            {
                newDebitNote && <DebitNote
                    onClick={() => {
                        setNewDebitNote(false)
                    }}
                />
            }

            {
                newPurchaseReturns && <PurchaseReturns
                    onClick={() => {
                        setTimeout(() => {
                            setNewPurchaseReturns(false)
                        })
                    }}
                />
            }

            {
                newPurchaseOrder && <PurchaseOrder
                    onClick={() => {
                        setTimeout(() => {
                            setNewPurchaseOrder(false)
                        })
                    }}
                />
            }

            {
                newExpense && <NewExpense
                    onClick={() => {
                        setTimeout(() => {
                            setNewExpense(false)
                        })
                    }}
                />
            }

            {
                newCashPurchase && <CashPurchase
                    onClick={() => {
                        setTimeout(() => {
                            setNewCashPurchase(false)
                        })
                    }}
                />
            }
        </div>
    )
}

export default Home
