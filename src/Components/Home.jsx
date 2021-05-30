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
