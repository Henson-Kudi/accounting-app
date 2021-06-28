import React, {useRef, useEffect} from 'react'
import './SalesOptions.css'
import SalesAndPurchaseOptions from './SalesAndPurchaseOptionItem'

function SalesOptions({ newQuotation, newInvoice, newCreditNote, newReceipt, newReceivePayment, newPurchaseInvoice, newMakePayment, newDebitNote, newPurchaseReturns, newPurchaseOrder, newExpense, newCashPurchase, onClick }) {
    const wrapperRef = useRef()

    const handleClickOutSide = (e)=>{
        const {current: wrap} = wrapperRef
        if (wrap && !wrap.contains(e.target)) {
            onClick()
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutSide)
        return () => {
            document.removeEventListener('mousedown', handleClickOutSide)
        }
    }, [])

    return (
        <div className="salesAndPurchases" ref={wrapperRef}>
            <div className='salesAndPurchases'>
                <h3>Sales:</h3>
                <div className="SalesOptions">
                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-alt fa-3x"></i>}
                        title='New Quotation'
                        onClick={newQuotation}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-3x"></i>}
                        title='New Invoice'
                        onClick={newInvoice}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-receipt fa-3x"></i>}
                        title='Sales Receipt'
                        onClick={newReceipt}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-money-check-alt fa-3x"></i>}
                        title='Receive Payment'
                        onClick={newReceivePayment}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-3x"></i>}
                        title='Sales Returns'
                        onClick={newCreditNote}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-3x"></i>}
                        title='Debit Note'
                        onClick={newDebitNote}
                    />
                </div>
            </div>

            <div>
                <h3>Purchases and Expenses:</h3>
                <div className="PurchaseOptions">
                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-alt fa-3x"></i>}
                        title='Letter of Enquiry'
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-3x"></i>}
                        title='Purchase Order'
                        onClick={newPurchaseOrder}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-3x"></i>}
                        title='New Purchase Invoice'
                        onClick={newPurchaseInvoice}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-receipt fa-3x"></i>}
                        title='Cash Purchase'
                        onClick={newCashPurchase}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-money-check-alt fa-3x"></i>}
                        title='Make Payment'
                        onClick={newMakePayment}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-alt fa-3x"></i>}
                        title='New Expense'
                        onClick={newExpense}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-3x"></i>}
                        title='Purchase Returns'
                        onClick={newPurchaseReturns}
                    />

                </div>
            </div>

            <div>
                <h3>Others</h3>
                <div className="PurchaseOptions">
                    <button className="btn">Customer</button>
                    <button className="btn">Supplier</button>
                    <button className="btn">Inventory Item</button>
                    <button className="btn">Fixed Asset</button>
                    <button className="btn">Longterm Liability</button>
                    <button className="btn">Shareholder</button>
                    <button className="btn">Employee</button>

                </div>
            </div>
        </div>
    )
}

export default SalesOptions
