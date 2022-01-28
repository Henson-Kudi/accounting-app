import React, {useContext} from 'react'
import useFetch from '../customHooks/useFetch'
import {UserContext} from './userContext'
import Loader from './Loader'

function SalesByCustomer() {

    const {user} = useContext(UserContext)
    const today = new Date()

    const {data : {customers}, loader} = useFetch('customers', {})
    const {data : {invoices}} = useFetch('invoices', {})
    const {data : receipts} = useFetch('receipts', [])

    const salesData = invoices?.filter(inv => new Date(inv?.input?.date)?.getFullYear() === today.getFullYear())?.concat(receipts?.filter(rcp => new Date(rcp.input?.date)?.getFullYear() === today.getFullYear()))

    const custs = customers?.map(cust => {
        const filteredCustInvoices = salesData?.filter(item => item.customer._id === cust._id && item.customer.id === cust.id && item.customer?.number === cust.number)

        const totalQty = filteredCustInvoices?.map(inv => inv?.products?.map(product => product?.qty)?.reduce((acc, product) => Number(acc) + Number(product), 0)).reduce((acc, product) => Number(acc) + Number(product), 0)

        const totalAmount = filteredCustInvoices?.map(inv => inv?.products?.map(product => (Number(product?.qty) * Number(product?.up)))?.reduce((acc, product) => Number(acc) + Number(product), 0)).reduce((acc, product) => Number(acc) + Number(product), 0)

        const invCount = filteredCustInvoices?.length

        return {
            ...cust,
            totalQty,
            totalAmount,
            invCount
        }
    })


    return (
        <div className='Invoices SingleReport'>
            <div className="reportOptions">
                <i className="fas fa-print fa-2x" onClick={()=>{
                    window.print()
                }}></i>
            </div>
            <div className="reportInfos reportHeader">
                <h1>{user?.companyName}</h1>
                <p>Sales By Customer Report For The Year {new Date().getFullYear()}</p>
            </div>
            <div className="allDebtorsContainer">
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th>Customer #</th>
                            <th>Customer Name</th>
                            <th>Invoice Count</th>
                            <th>Qty Sold</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            custs?.map(cust =>(
                                <tr key={cust.id} className={cust?.invCount === 0 ? "noDisplay" : 'display'}>
                                    <td>{cust?.number}</td>
                                    <td>{cust?.displayName}</td>
                                    <td>{cust?.invCount}</td>
                                    <td>{Number(cust?.totalQty)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td>{Number(cust?.totalAmount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    customers?.length === 0 && <div className="noData" style={{padding : '1rem'}}>No data to display</div>
                }
            </div>
            {
                loader && <Loader />
            }
        </div>
    )
}

export default SalesByCustomer
