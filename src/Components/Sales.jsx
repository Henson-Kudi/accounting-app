import React, { useState, useRef, useEffect, useContext } from 'react'
import {useHistory} from 'react-router-dom'
import './Sales.css'
import Barchart from './Barchart'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'

function Sales() {
    const history = useHistory()

    const {user} = useContext(UserContext)

    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    

    const {data:returns, loader, setLoader} = useFetch('creditNotes', [])
    const {data:{invoices}} = useFetch('invoices', {})
    const {data: receipts} = useFetch('receipts', [])
    const {data:{customers}} = useFetch('customers', [])
    

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

        const salesReturns = returns?.map(a => a.netPayable).reduce((a,b) => a + b, 0) || 0

        const creditSales = invoices?.map(inv => inv.netPayable).reduce((a, b) => Number(a) + Number(b), 0) || 0

        const cashSales = receipts?.map(a => a.netPayable).reduce((a, b) => Number(a) + Number(b), 0) || 0

        const getMonthlyElements = (data) =>{
            const today = new Date()

            return months.map((month, monthIndex) => {

                const filtered = data?.filter(item => (new Date(item?.input?.date).getFullYear() === today.getFullYear() && new Date(item?.input?.date).getMonth() === monthIndex))

                return filtered?.map(item => Number(item?.netPayable))?.reduce((acc, item) => Number(acc) + Number(item), 0)
            })
            
        }

        const allSalesData = invoices?.concat(receipts)

        const monthlyTotalSales = getMonthlyElements(allSalesData)
        
        const monthLyCreditSales = getMonthlyElements(invoices)

        const monthlyCashSales = getMonthlyElements(receipts)

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
                <h1>Sales Dashboard</h1>
                <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                    <button className="invoiceButton" onClick={handleStyling}>New Transaction<i className="fas fa-sort-down"></i></button>
                    <div className="moreOptionsCont" style={{...styles}}>
                    <p className="option" onClick={()=>{
                        history.push('/invoice/new-invoice')
                    }}>New Invoice</p>
                        <p className="option" onClick={()=>{
                            history.push('/receipt/new-receipt')
                        }}>New Receipt</p>
                        <p className="option" onClick={()=>{
                            history.push('/credit-note/new-credit-note')
                        }}>Sales Returns</p>
                        <p className="option" onClick={()=>{
                            history.push('/payments/customer-payment')
                        }}>Receive Payment</p>
                        <p className="option" onClick={()=>{
                            history.push('/quotation/new-quotation')
                        }}>Quotation</p>
                    </div>
                </div>
            </div>

            <div className="salesMiddle">
                <div className="salesTotals">
                    <div className="cashSales" data-text='cash sales' onClick={()=>{history.push('/receipts')}}>
                        <h5>Total Sales Receipts</h5>
                        <p><b>{(Number(cashSales)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                    </div>

                    <div className="creditSales" data-text='credit sales' onClick={()=>{history.push('/invoices')}}>
                        <h5>Total Credit Sales</h5>
                        <p><b>{(Number(creditSales)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                    </div>

                        <div className="salesReturns" data-text='sales returns' onClick={()=>{history.push('/credit-notes')}}>
                            <h5>Total Sales Returns</h5>
                            <p style={{color: 'red'}}><b>{(Number(salesReturns)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                        </div>
                </div>

                <Barchart
                    labels={months}
                    data3={monthlyTotalSales}
                    tooltip3='Total Monthly Sales for this year'
                    data1={monthLyCreditSales}
                    tooltip1='Credit Sales for this year'
                    data2={monthlyCashSales}
                    tooltip2='Cash Sales for this year'
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
                            <th>Customer Name</th>
                            <th>Net Amount</th>
                            <th>Total Paid</th>
                            <th>Balance Due</th>
                        </tr>
                    </thead>
                    <tbody className='invoicesBody'>
                        {
                            invoices?.filter(item => Number(item?.balanceDue) > 0).map(invoice => (
                                <tr key={invoice?.input?.id} className="invoiceDetail" onClick={()=>{
                                    history.push(`/invoices/${invoice?._id}`)
                                }}>
                                    <td>{new Date(invoice?.input?.date).toLocaleDateString()}</td>
                                    <td>{invoice?.input?.number}</td>
                                    <td onClick={(e)=>{
                                        e.stopPropagation();
                                        history.push(`/customers/${invoice?.customer?._id}`)
                                    }} style={{
                                        textDecoration: 'underline',
                                        color : 'blue'
                                    }}>{
                                        customers?.filter(cust => cust._id === invoice?.customer?._id && cust.id === invoice?.customer?.id && cust.number === invoice?.customer?.number).map(cust => cust.displayName)
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

export default Sales
