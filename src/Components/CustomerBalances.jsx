import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import useFetch from '../customHooks/useFetch'
import {UserContext} from '../customHooks/userContext'
import Loader from './Loader'

function CustomerBalances() {
    const history = useHistory()
    const {user} = useContext(UserContext)

    const {data : {customers}, loader} = useFetch('customers', {})


    return (
        <div className='Invoices SingleReport'>
            <div className="reportOptions">
                <i className="fas fa-print fa-2x" onClick={()=>{
                    window.print()
                }}></i>
            </div>
            <div className="reportInfos reportHeader">
                <div className="companyLogo" style={{
                    backgroundImage : `url(${user?.logoURL})`
                }}></div>
                <div>
                    <h1>{user?.companyName}</h1>
                    <p>Customer Balances For The Year {new Date().getFullYear()}</p>
                </div>
            </div>
            
            <div className="allDebtorsContainer">
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th>Customer #</th>
                            <th>Customer Name</th>
                            <th>Company Name</th>
                            <th>Address</th>
                            <th>Opening Balance</th>
                            <th>Closing Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            customers?.map(cust => (
                                <tr key={cust.id} onClick={()=>{
                                    history.push(`/customers/${cust?._id}`)
                                }}>
                                    <td>{cust?.number}</td>
                                    <td>{cust?.displayName}</td>
                                    <td>{cust?.companyName}</td>
                                    <td>{cust?.billingAddress?.address}</td>
                                    <td>{Number(cust?.openingBalance)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td>{Number(cust?.totalDebt)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
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
                loader && <Loader/>
            }
        </div>
    )
}

export default CustomerBalances
