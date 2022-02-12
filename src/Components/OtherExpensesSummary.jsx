import React, { useContext } from 'react'
import useFetch from '../customHooks/useFetch'
import Loader from './Loader'
import {UserContext} from '../customHooks/userContext'

function OtherExpensesSummary() {

    const {user} = useContext(UserContext)

    const {data: expenses, loader} = useFetch('expenses', [])

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className='Invoices SingleReport'>
            <div className="reportOptions">
                <i className="fas fa-print fa-2x" onClick={handlePrint}></i>
            </div>
            <div className="reportInfos reportHeader">
                <div className="companyLogo" style={{
                    backgroundImage : `url(${user?.logoURL})`
                }}></div>
                <div>
                    <h1>{user?.companyName}</h1>
                    <p>Summary of Other Expenses for the year {new Date().getFullYear()}</p>
                </div>
            </div>

            <div className="allDebtorsContainer">
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Exp. Category</th>
                            <th>Detail</th>
                            <th>Exp Paid To</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            expenses?.filter(exp => new Date(exp?.date).getFullYear() === new Date().getFullYear()).map(exp => (
                                <tr>
                                    <td>{new Date(exp?.date).toLocaleDateString()}</td>
                                    <td>{exp?.expCategory}</td>
                                    <td>{exp?.expName}</td>
                                    <td>{exp?.supName}</td>
                                    <td>{(Number(exp?.amount.cash || 0) + Number(exp?.amount.bank || 0) + Number(exp?.amount.mobileMoney || 0))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    expenses?.length === 0 && <div className="noData" style={{padding : '1rem'}}>No data to display</div>
                }
            </div>
            {
                loader && <Loader />
            }
        </div>
    )
}

export default OtherExpensesSummary
