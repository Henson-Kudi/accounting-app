import React, { useState, useRef, useEffect, useContext } from 'react'
import {useHistory} from 'react-router-dom'
import './Sales.css'
import Barchart from './Barchart'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from './userContext'
import useFetch from '../customHooks/useFetch'

function Purchases() {
    const history = useHistory()

    const {user} = useContext(UserContext)

    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    

    const {data:returns, loader, setLoader} = useFetch('purchaseReturns', [])
    const {data:invoices} = useFetch('purchaseInvoices', [])
    const {data: receipts} = useFetch('purchaseReceipts', [])
    const {data:suppliers} = useFetch('suppliers', [])
    

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

        const purchaseReturns = returns?.map(a => a.netPayable).reduce((a,b) => a + b, 0) || 0

        const creditPurchases = invoices?.map(inv => inv.netPayable).reduce((a, b) => Number(a) + Number(b), 0) || 0

        const cashPurchases = receipts?.map(a => a.netPayable).reduce((a, b) => Number(a) + Number(b), 0) || 0

        const getMonthlyElements = (data) =>{
            const today = new Date()

            return months.map((month, monthIndex) => {

                const filtered = data?.filter(item => (new Date(item?.input?.date).getFullYear() === today.getFullYear() && new Date(item?.input?.date).getMonth() === monthIndex))

                return filtered?.map(item => Number(item?.netPayable))?.reduce((acc, item) => Number(acc) + Number(item), 0)
            })
            
        }

        const allPurchasesData = invoices?.concat(receipts)

        const monthlyTotalPurchases = getMonthlyElements(allPurchasesData)
        
        const monthlyCreditPurchases = getMonthlyElements(invoices)

        const monthlyCashPurchases = getMonthlyElements(receipts)

    const wrapper_Ref = useRef(null)

    const [styler, setStyler] = useState({
        transform: 'translateY(-5rem)',
        visibility: 'hidden'
    })
    const styles = {
        width: '100%',
        position: 'absolute',
        color: 'gray',
        fontWeight: '550',
        padding: '1rem',
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        transform : styler.transform,
        visibility : styler.visibility,
        transition: 'transform 0.5s ease',
    }

    const handleStyling = ()=>{
        styler.visibility === 'hidden' ? setStyler({transform: 'translateY(0)', visibility: 'visible'}) : setStyler({transform: 'translateY(-5rem)', visibility: 'hidden'})
    }

    useEffect(() => {
            document.addEventListener('mousedown', handle_Click_Outside);

            return ()=>{
                document.removeEventListener('mousedown', handle_Click_Outside);
            }
        }, [])

        function handle_Click_Outside(e){
                const {current : wrap} = wrapper_Ref;
                if(wrap && !wrap.contains(e.target)){
                    setStyler({transform: 'translateY(-5rem)', visibility: 'hidden'})
                }
        }



    return (
        <div className='Sales Invoices'>
            <div className="invoicesHeading invoicesHeadingCont">
                <h1>Purchases Dashboard</h1>
                <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                    <button className="invoiceButton" onClick={handleStyling}>New Transaction<i className="fas fa-sort-down"></i></button>
                    <div className="moreOptionsCont" style={{...styles}}>
                    <p className="option" onClick={()=>{
                        history.push('/purchase-invoice/new-purchase-invoice')
                    }}>New Purchase Invoice</p>
                        <p className="option" onClick={()=>{
                            history.push('/purchase-receipt/new-purchase-receipt')
                        }}>New Purchase Receipt</p>
                        <p className="option" onClick={()=>{
                            history.push('/purchase-return/new-purchase-return')
                        }}>Purchase Returns</p>
                        <p className="option" onClick={()=>{
                            history.push('/payments/supplier-payment')
                        }}>Make Payment</p>
                        <p className="option" onClick={()=>{
                            history.push('/purchase-order/new-purchase-order')
                        }}>Purchase Order</p>
                    </div>
                </div>
            </div>

            <div className="salesMiddle">
                <div className="salesTotals">
                    <div className="cashSales" data-text='cash purchases' onClick={()=>{history.push('/purchase-receipts')}}>
                        <h5>Total Cash Purchases</h5>
                        <p><b>{(Number(cashPurchases)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                    </div>

                    <div className="creditSales" data-text='purchase invoices' onClick={()=>{history.push('/purchase-invoices')}}>
                        <h5>Total Credit Purchases</h5>
                        <p><b>{(Number(creditPurchases)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                    </div>

                        <div className="salesReturns" data-text='purchase returns' onClick={()=>{history.push('/purchase-returns')}}>
                            <h5>Total Purchase Returns</h5>
                            <p style={{color: 'red'}}><b>{(Number(purchaseReturns)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                        </div>
                </div>

                <Barchart
                    labels={months}
                    data3={monthlyTotalPurchases}
                    tooltip3='Total Monthly purchases for this year'
                    data1={monthlyCreditPurchases}
                    tooltip1='Credit purchases for this year'
                    data2={monthlyCashPurchases}
                    tooltip2='Cash purchases for this year'
                />
            </div>
            <div className="allDebtorsContainer">
                <h3 style={{
                    fontWeight : '500',
                    paddingTop : '1rem',
                    textAlign : 'left'
                }}>Unpaid Invoices</h3>
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Invoice Number</th>
                            <th>Supplier Name</th>
                            <th>Net Amount</th>
                            <th>Total Paid</th>
                            <th>Balance Due</th>
                        </tr>
                    </thead>
                    <tbody className='invoicesBody'>
                        {
                            invoices?.filter(item => Number(item?.balanceDue) > 0).map(invoice => (
                                <tr key={invoice?.input?.id} className="invoiceDetail" onClick={()=>{
                                    history.push(`/purchase-invoices/${invoice?._id}`)
                                }}>
                                    <td>{new Date(invoice?.input?.date).toLocaleDateString()}</td>
                                    <td>{invoice?.input?.number}</td>
                                    <td onClick={(e)=>{
                                        e.stopPropagation();
                                        history.push(`/suppliers/${invoice?.supplier?._id}`)
                                    }} style={{
                                        textDecoration: 'underline',
                                        color : 'blue'
                                    }}>{
                                        suppliers?.filter(sup => sup._id === invoice?.supplier?._id && sup.id === invoice?.supplier?.id && sup.number === invoice?.supplier?.number).map(sup => sup.displayName)
                                    }</td>
                                    <td>{Number(invoice?.netPayable)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td>{Number(invoice?.totalPaid)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td>{Number(invoice?.balanceDue)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {
                loader && <Loader />
            }
            
            <Alert
                alert={alert}
                cancelAlert={()=>{setAlert(false)}}
                message={alertMessage}
            />
        </div>
    )
}

export default Purchases
