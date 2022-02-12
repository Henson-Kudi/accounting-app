import React, { useContext } from 'react'
import useFetch from '../customHooks/useFetch'
import Loader from './Loader'
import {UserContext} from '../customHooks/userContext'

function CustomerPayments() {

    const {user} = useContext(UserContext)

    const {data : {cash, bank, momo}, loader} = useFetch('meansOfPayment', {})

    const data = cash?.filter(item => item.inOrOut === 'in' && new Date(item.date).getFullYear() === new Date().getFullYear())?.concat(bank?.filter(item => item.inOrOut === 'in' && new Date(item.date).getFullYear() === new Date().getFullYear()))?.concat(momo?.filter(item => item.inOrOut === 'in' && new Date(item.date).getFullYear() === new Date().getFullYear()))


    const styles = {
        padding : '5rem',
        display : 'grid',
        justifyContent : 'center',
        alignItems : 'center',
    }


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
                    <p>Customer Payments For The Year {new Date().getFullYear()}</p>
                </div>
            </div>
            
            <div className="allDebtorsContainer">
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Source</th>
                            <th>Source Number</th>
                            <th>Detail</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.map(item => (
                                <tr>
                                    <td>{new Date(item?.date).toLocaleDateString()}</td>
                                    <td>{item?.source}</td>
                                    <td>{item?.sourceNumber}</td>
                                    <td>{item?.name}</td>
                                    <td>{item?.amount}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    data?.length === 0 && <div className="noData" style={{padding : '1rem'}}>No data to display</div>
                }
            </div>
            {
                loader && <Loader />
            }
        </div>
    )
}

export default CustomerPayments
