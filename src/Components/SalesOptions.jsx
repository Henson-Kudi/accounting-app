import React, {useRef, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
import './SalesOptions.css'
import SalesAndPurchaseOptions from './SalesAndPurchaseOptionItem'

function SalesOptions({ onClick, newLiability, newShareholder, newAsset }) {
    const history = useHistory()
    const wrapperRef = useRef()

    const handleClickOutSide = (e)=>{
        const {current: wrap} = wrapperRef
        if (wrap && !wrap.contains(e.target)) {
            onClick()
        }
    }

    const pushRoute = (route) => {
        history.push(route)
        onClick()
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
                        onClick={()=>{
                            pushRoute('/quotation/new-quotation')
                        }}
                    />

                    
                    
                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-3x"></i>}
                        title='New Invoice'
                        onClick={()=>{
                            pushRoute('/invoice/new-invoice')
                        }}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-receipt fa-3x"></i>}
                        title='Sales Receipt'
                        onClick={()=>{
                            pushRoute('/receipt/new-receipt')
                        }}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-money-check-alt fa-3x"></i>}
                        title='Receive Payment'
                        onClick={()=>{
                            pushRoute('/payments/customer-payment')
                        }}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-3x"></i>}
                        title='Sales Returns'
                        onClick={()=>{
                            pushRoute('/credit-note/new-credit-note')
                        }}
                    />

                    {/* <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-3x"></i>}
                        title='Debit Note'
                        onClick={newDebitNote}
                    /> */}
                </div>
            </div>

            <div>
                <h3>Purchases and Expenses:</h3>
                <div className="PurchaseOptions">
                    {/* <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-alt fa-3x"></i>}
                        title='Letter of Enquiry'
                    /> */}

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-3x"></i>}
                        title='Purchase Order'
                        onClick={()=>{
                            pushRoute('/purchase-order/new-purchase-order')
                        }}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-3x"></i>}
                        title='New Purchase Invoice'
                        onClick={()=>{
                            pushRoute('/purchase-invoice/new-purchase-invoice')
                        }}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-receipt fa-3x"></i>}
                        title='Cash Purchase'
                        onClick={()=>{
                            pushRoute('/purchase-receipt/new-purchase-receipt')
                        }}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-money-check-alt fa-3x"></i>}
                        title='Make Payment'
                        onClick={()=>{
                            pushRoute('/payments/supplier-payment')
                        }}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-alt fa-3x"></i>}
                        title='New Expense'
                        onClick={()=>{
                            pushRoute('/expenses/new-expense')
                        }}
                    />

                    <SalesAndPurchaseOptions
                        fontawesome={<i className="fas fa-file-invoice fa-3x"></i>}
                        title='Purchase Returns'
                        onClick={()=>{
                            pushRoute('/purchase-return/new-purchase-return')
                        }}
                    />

                </div>
            </div>

            <div>
                <h3>Others</h3>
                <div className="PurchaseOptions">
                    <button className="btn" onClick={()=>{
                        pushRoute('/customer/new-customer')
                    }}>Customer</button>
                    <button className="btn" onClick={()=>{
                        pushRoute('/supplier/new-supplier')
                    }}>Supplier</button>
                    <button className="btn" onClick={()=>{
                        pushRoute('/products/new-product')
                    }}>Product</button>
                    {/* <button className="btn" onClick={newAsset}>Fixed Asset</button>
                    <button className="btn" onClick={newLiability}>Liability</button>
                    <button className="btn" onClick={newShareholder}>Shareholder</button> */}
                    {/* <button className="btn" onClick={newEmployee}>Employee</button> */}

                </div>
            </div>
        </div>
    )
}
export default SalesOptions
