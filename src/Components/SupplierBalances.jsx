import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import useFetch from '../customHooks/useFetch'
import {UserContext} from './userContext'
import Loader from './Loader'

function SupplierBalances() {
    const history = useHistory()
    const {user} = useContext(UserContext)

    const {data : suppliers, loader} = useFetch('suppliers', [])


    return (
        <div className='Invoices SingleReport'>
            <div className="reportOptions">
                <i className="fas fa-print fa-2x" onClick={()=>{
                    window.print()
                }}></i>
            </div>
            <div className="reportInfos reportHeader">
                <h1>{user?.companyName}</h1>
                <p>Supplier Balances For The Year {new Date().getFullYear()}</p>
            </div>
            
            <div className="allDebtorsContainer">
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th>Supplier #</th>
                            <th>Supplier Name</th>
                            <th>Company Name</th>
                            <th>Address</th>
                            <th>Opening Balance</th>
                            <th>Closing Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            suppliers?.map(sup => (
                                <tr key={sup.id} onClick={()=>{
                                    history.push(`/suppliers/${sup?._id}`)
                                }}>
                                    <td>{sup?.number}</td>
                                    <td>{sup?.displayName}</td>
                                    <td>{sup?.companyName}</td>
                                    <td>{sup?.billingAddress?.address}</td>
                                    <td>{Number(sup?.openingBalance)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td>{Number(sup?.totalDebt)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    suppliers?.length === 0 && <div className="noData" style={{padding : '1rem'}}>No data to display</div>
                }
            </div>
            {
                loader && <Loader/>
            }
        </div>
    )
}

export default SupplierBalances
