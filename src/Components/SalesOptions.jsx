import React from 'react'
import './SalesOptions.css'
import SalesAndPurchaseOptions from './SalesAndPurchaseOptionItem'

function SalesOptions({ newQuotation, newInvoice, newCreditNote, newReceipt, newReceivePayment, newPurchaseInvoice, newMakePayment, newDebitNote, newPurchaseReturns, newPurchaseOrder, newExpense, newCashPurchase }) {
    return (
        <div className="salesAndPurchases">
            <div className='salesAndPurchases'>
                <h3>Sales:</h3>
                <div className="SalesOptions">
                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-alt fa-5x"></i>}
                        title='New Quotation'
                        onClick={newQuotation}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-5x"></i>}
                        title='New Invoice'
                        onClick={newInvoice}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-receipt fa-5x"></i>}
                        title='Sales Receipt'
                        onClick={newReceipt}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-money-check-alt fa-5x"></i>}
                        title='Receive Payment'
                        onClick={newReceivePayment}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-5x"></i>}
                        title='Credit Note'
                        onClick={newCreditNote}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-5x"></i>}
                        title='Debit Note'
                        onClick={newDebitNote}
                    />
                </div>
            </div>

            <div>
                <h3>Purchases and Expenses:</h3>
                <div className="PurchaseOptions">
                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-alt fa-5x"></i>}
                        title='Letter of Enquiry'
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-5x"></i>}
                        title='Purchase Order'
                        onClick={newPurchaseOrder}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-5x"></i>}
                        title='New Purchase Invoice'
                        onClick={newPurchaseInvoice}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-receipt fa-5x"></i>}
                        title='Cash Purchase'
                        onClick={newCashPurchase}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-money-check-alt fa-5x"></i>}
                        title='Make Payment'
                        onClick={newMakePayment}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-alt fa-5x"></i>}
                        title='New Expense'
                        onClick={newExpense}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-5x"></i>}
                        title='Purchase Returns'
                        onClick={newPurchaseReturns}
                    />

                </div>
            </div>
            <div className="goto">
                <h3>Go To:</h3>

                <ul>
                    <li>
                        Suppliers
                </li>
                    <li>
                        Customers
                </li>

                    <li>
                        Inventory List
                </li>

                    <li>
                        Fixed Assets Register
                </li>

                    <li>
                        Reports Dashboard
                </li>
                </ul>
            </div>
        </div>
    )
}

export default SalesOptions
