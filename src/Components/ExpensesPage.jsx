import React, {useState, useEffect, useRef, useContext} from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { parse } from 'query-string'
import { Bar } from 'react-chartjs-2'
import {baseURL} from './axios'
import Loader from './Loader'
import './Expenses.css'
import UpdateExpense from './UpdateExpense'
import DeleteBox from './DeleteBox'
import Alert from './Alert'
import {UserContext} from './userContext'
import useFetch from '../customHooks/useFetch'


function ExpensesPage() {
    const history = useHistory()
    const {pathname, search} = useLocation()
    const query = parse(search)

    const [updateExpense, setUpdateExpense] = useState(false)
    const [deleteBox, setDeleteBox] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const {user} = useContext(UserContext)
    const today = new Date()

    const {data:expenses, refetchData, loader, setLoader} = useFetch('expenses', [])
    
    const [updateData, setUpdateData] = useState({})
    
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const graphData = labels.map((label, labIndex) => {
        const filtered = expenses?.filter(expense => (new Date(expense.date).getFullYear() === today.getFullYear() && new Date(expense.date).getMonth() === labIndex))
        return filtered?.map(item => (Number(item?.amount?.cash) + Number(item?.amount?.bank) + Number(item?.amount?.mobileMoney)))?.reduce((acc, item) => Number(acc) + Number(item), 0)
    })

    const updateExpenseData = (data)=>{
        setUpdateData({
            ...data,
            cashPayment : data?.amount?.cash,
            bankPayment : data?.amount?.bank,
            mobileMoneyPayment : data?.amount?.mobileMoney,
        })
    }

    const handleDelete = async()=>{
        try {
            setDeleteBox(false);
            setLoader(true);
            const {data} = await baseURL.delete(`/expenses/${updateData._id}`, {
                headers : {
                    'auth-token' : user.token,
                }
            })
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 3000);
        } catch (error) {
            console.log(error);
        }finally{
            await refetchData()
        }
    }

    return (
        <div className="Expense Invoices">
            <div className="invoicesHeading invoicesHeadingCont">
                <div style={{textAlign: 'left'}}>
                    <h1>Expenses</h1>
                    <h3>Total Spent On Expenses this month: <span style={{color: 'red'}}>{
                    expenses?.filter(exp => (new Date(exp.date).getFullYear() === today.getFullYear() && new Date(exp.date).getMonth() === today.getMonth()))?.map(exp => (Number(exp?.amount?.cash) + Number(exp?.amount?.bank) + Number(exp?.amount?.mobileMoney)))?.reduce((a, b) => a + b, 0)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }</span></h3>
                </div>
                <button className="invoiceButton" onClick={()=>{history.push('/expenses/new-expense')}}>New Expense</button>
            </div>

            

            <div className="recentDetails">
                
                <div className="mostRecentTransactions allDebtorsContainer">
                    <h3>Recent Transactions</h3>
                    <table className='allDebtorsTable'>
                        <thead>
                            <tr>
                                <th>Detail</th>
                                <th>Paid To</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                expenses?.sort((a, b) => new Date(b.date) - new Date(a.date))
                                .slice(0,3)
                                .map((exp, i) => (
                                    <tr key={i}>
                                        <td className='detail'>{exp?.expName}</td>
                                        <td>{exp?.supName}</td>
                                        <td>{(Number(exp?.amount?.cash) + Number(exp?.amount?.bank) + Number(exp?.amount?.mobileMoney))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                )) 
                            }
                        </tbody>
                    </table>
                </div>

                <div className="mosstPaidExpenses allDebtorsContainer">
                    <h3>Expenses Most Paid For this year</h3>
                    <table className='allDebtorsTable'>
                        <thead>
                            <tr>
                                <th> Detail </th>
                                <th> Paid To </th>
                                <th> Amount </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                expenses?.filter(exp => new Date(exp.date).getFullYear() === today.getFullYear())?.sort((a, b) => (Number(b?.amount?.cash) + Number(b?.amount?.bank) + Number(b?.amount?.mobileMoney)) - (Number(a?.amount?.cash) + Number(a?.amount?.bank) + Number(a?.amount?.mobileMoney)))?.slice(0, 3)?.map((exp, i) => (
                                <tr key={i}>
                                    <td className='detail'>{exp?.expName}</td>
                                    <td>{exp?.supName}</td>
                                    <td>{(Number(exp?.amount?.cash) + Number(exp?.amount?.bank) + Number(exp?.amount?.mobileMoney))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="expenseQueryViews">
                <span className={ !query.transactions ? 'button' : 'btn'} onClick={() =>{
                    query.transactions && history.push(pathname)
                }}>
                    Overview
                </span>
                <span className={ query.transactions ? 'button' : 'btn'} onClick={() =>{
                    !query.transactions && history.push(`${pathname}?transactions=true`)
                }}>
                    All Transactions
                </span>
            </div>

            <div className="barChartAndExpenses">
                {query.transactions ? (
                    <div className="allTransactions allDebtorsContainer">
                    <h3>All Expenses For This Year</h3>
                        <table className='allDebtorsTable'>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Detail</th>
                                    <th>Category</th>
                                    <th>Receiver</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody className='invoicesBody'>
                                {
                                    expenses?.filter(exp => new Date(exp.date).getFullYear() === today.getFullYear())?.sort((a, b)=> new Date(b?.date) - new Date(a?.date)).map((exp, i) => (
                                        <tr key={exp.id} className='invoiceDetail expensesDataRow'>
                                            <td>{new Date(exp?.date)?.toLocaleDateString()}</td>
                                            <td>{exp?.expName}</td>
                                            <td>{exp?.expCategory}</td>
                                            <td>{exp?.supName}</td>
                                            <td>{(Number(exp?.amount?.cash) + Number(exp?.amount?.bank) + Number(exp?.amount?.mobileMoney))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            
                                            <td className='updateExpense'>
                                                <i class="fas fa-pen" dataset='update' onClick={()=>{
                                                    updateExpenseData(exp)
                                                    setUpdateExpense(true)
                                                }}
                                                dataset='update'
                                                ></i>
                                                <i class="fas fa-trash" dataset='delete' onClick={()=>{
                                                    setUpdateData(exp)
                                                    setDeleteBox(true)
                                                }}
                                                dataset='delete'
                                                ></i>
                                            </td>
                                        </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>) : 
                    <div className="Barchart">
                        <Bar
                            width= {200}
                            height= '70%'
                            data={{
                                labels : labels,
                                datasets:[
                                    {
                                        label: 'Monthly Expenditure on Expenses This Year',
                                        data: graphData,
                                        backgroundColor: [
                                            '#B336D6',
                                            '#DB59FF',
                                            '#598A07',
                                            '#9AD636',
                                            '#D63689',
                                            '#088A07',
                                            '#37D636',
                                            '#FF57AE',
                                            '#36D6A3',
                                            '#8A2207',
                                            '#30FFBC',
                                            '#D65736'
                                        ]
                                    }
                                ]
                            }}
                            options={
                            {
                                scales: {
                                    xAxes: [
                                        {
                                            grideLines: {
                                                display: false
                                            }
                                        }
                                    ],
                                    yAxes: [
                                        {
                                            grideLines: {
                                                display: false
                                            },
                                            ticks: {
                                            beginAtZero: true
                                        }
                                        }
                                    ]
                                }
                            },
                            {
                                maintainAspectRatio: true
                            }
                        }
                        />
                    </div>
                }
            </div>

            {
                loader && <Loader />
            }

            <Alert
                alert={alert}
                cancelAlert={()=>{setAlert(false)}}
                message={alertMessage}
            />

            {
                deleteBox &&
                <DeleteBox
                    onClick={()=>{
                        setDeleteBox(false)
                    }}
                    handleDelete={handleDelete}
                />
            }

            {
                updateExpense &&
                <UpdateExpense
                    expenseInput={updateData}
                    setExpenseInput={setUpdateData}
                    cancel={()=>{
                        setUpdateExpense(false)
                    }}
                    refetch={refetchData}
                />
            }
        </div>
    )
}

export default ExpensesPage
