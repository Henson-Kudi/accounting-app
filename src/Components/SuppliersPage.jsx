import React from 'react'
import { useHistory } from 'react-router-dom'
import Loader from './Loader'
import useFetch from '../customHooks/useFetch'

function SuppliersPage() {

    const history = useHistory()
    const {data : suppliers, loader} = useFetch('suppliers',[])

    return (
        <div className="Invoices">
            <div className="invoicesHeading invoicesHeadingCont">
                <h1>Suppliers</h1>
                <button className="invoiceButton" onClick={()=>{history.push('supplier/new-supplier')}}>New Supplier</button>
            </div>
            <div className="allDebtorsContainer">
                
                <table className='allDebtorsTable'>
                    <thead>
                        <tr className='customersHeading'>
                            <th>Number</th>
                            <th>Name</th>
                            <th>Company Name</th>
                            <th>Address</th>
                            <th>Email Address</th>
                            <th>Telephone</th>
                            <th>Opening Balance</th>
                            <th>Total Debt</th>
                        </tr>
                    </thead>

                    <tbody className='tableBody'>
                        {
                            suppliers?.map(supplier => (
                                <tr className='invoiceListbody invoiceDetail customerDetailRow' onClick={() =>{history.push(`/suppliers/${supplier._id}`)}}>
                                    <td>{supplier?.number}</td>
                                    <td>{supplier?.displayName}</td>
                                    <td>{supplier?.companyName}</td>
                                    <td>{supplier?.billingAddress?.address}</td>
                                    <td onClick={(e)=>{
                                    window.open(`mailto:${supplier?.email}`)
                                        e.stopPropagation()
                                    }} className='clientEmail'>{supplier?.email}</td>
                                    <td>{supplier?.billingAddress?.tel}</td>
                                    <td>{Number(supplier?.openingBalance)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td>{Number(supplier?.totalDebt)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    
                                </tr>
                            ))
                        }
                    </tbody>

                </table>
            </div>
            {
                loader && <Loader />
            }
        </div>
    )
}

export default SuppliersPage
