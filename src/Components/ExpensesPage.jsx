import React, {useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {baseURL} from './axios'
import Loader from './Loader'
import Barchart from './Barchart'
import './Expenses.css'
import NewExpense from './NewExpense'
import UpdateExpense from './UpdateExpense'
import DeleteBox from './DeleteBox'

function ExpensesPage() {

    const [overview, setOverview] = useState(true)
    const [fetching, setfetching] = useState(true)
    const [newExpense, setNewExpense] = useState(false)
    const [updateExpense, setUpdateExpense] = useState(false)
    const [deleteBox, setDeleteBox] = useState(false)


    const [expenses, setExpenses] = useState([])
    const [updateData, setUpdateData] = useState({})
    const [value, setValue] = useState('')
    const [filterOption, setFilterOption] = useState('detail')

    useEffect(async() => {
        let source = axios.CancelToken.source();
        let unMounted = false;
        await baseURL.get('/expenses', {
            cancelToken: source.token
        })
        .then(res =>{
            setfetching(false)
            setExpenses(res.data)
        })
        .catch(err =>{
            if (!unMounted) {
                if (axios.isCancel(err)) {
                console.log('Request Cancelled');
            }else{
                console.log('Something went wrong');
            }
            }
        })
        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    let jan = []
    let feb = []
    let mar = []
    let apr = []
    let may = []
    let jun = []
    let jul = []
    let aug = []
    let sept = []
    let oct = []
    let nov = []
    let dec = []

    expenses.filter( exp => {
        const month = new Date(exp.date).getMonth()
        switch (month) {
            case 0:
                jan.push(exp.amount)
                break;
            
            case 1:
                feb.push(exp.amount)
                break;

            case 2:
                mar.push(exp.amount)
                break;

            case 3:
                apr.push(exp.amount)
                break;

            case 4:
                may.push(exp.amount)
                break;

            case 5:
                jun.push(exp.amount)
                break;

            case 6:
                jul.push(exp.amount)
                break;

            case 7:
                aug.push(exp.amount)
                break;

            case 8:
                sept.push(exp.amount)
                break;

            case 9:
                oct.push(exp.amount)
                break;

            case 10:
                nov.push(exp.amount)
                break;
        
            case 11:
                dec.push(exp.amount)
                break;

            
            default: return null
                break;
        }
    })

    jan = jan.reduce((a, b) => a + b, 0)
    feb = feb.reduce((a, b) => a + b, 0)
    mar = mar.reduce((a, b) => a + b, 0)
    apr = apr.reduce((a, b) => a + b, 0)
    may = may.reduce((a, b) => a + b, 0)
    jun = jun.reduce((a, b) => a + b, 0)
    jul = jul.reduce((a, b) => a + b, 0)
    aug = aug.reduce((a, b) => a + b, 0)
    sept = sept.reduce((a, b) => a + b, 0)
    oct = oct.reduce((a, b) => a + b, 0)
    nov = nov.reduce((a, b) => a + b, 0)
    dec = dec.reduce((a, b) => a + b, 0)
    
    const handleChange = (e)=>{
        const {value} = e.target
        setValue(value)
    }

     const handleFilterOption = (e)=>{
        const {value} = e.target
        setFilterOption(value)
    }

    return (
        <div className="Expense">
            <div className="expenseTop salesTop homeAndPrint">
                <div className='salesOptionsLeft'>
                    <Link to='/' className='button'>Home</Link>
                </div>

                <div className="salesOptionsMiddle">
                    <h1>Expenses Dashboard</h1>
                    <h3>Total Spent On Expenses: <span style={{color: 'red'}}>{
                expenses.map(exp => exp.amount).reduce((a, b) => a + b, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }</span></h3>
                </div>

                <div className="salesOptionsRight">
                    <button className="button" onClick={()=>{setNewExpense(true)}}>
                        New Expense
                    </button>
                    <button className="button" onClick={()=>{window.print()}}>
                        Print Page
                    </button>
                </div>
            </div>

            

            <div className="recentDetails">
                
            <div className="mostRecentTransactions">
            <h3>Recent Transactions</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Detail</th>
                            <th>Category</th>
                            <th>Receiver</th>
                            <th>Paid By:</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            expenses
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .slice(0,5)
                            .map((exp, i) => (
                                <tr key={i}>
                                    <td>{exp.date}</td>
                                    <td className='detail'>{exp.expName}</td>
                                    <td className='category'>{exp.category}</td>
                                    <td>{exp.receiver}</td>
                                    <td className='means'>{exp.meansOfPayment}</td>
                                    <td>{exp.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>
                            )) 
                        }
                    </tbody>
                </table>
            </div>

            <div className="mosstPaidExpenses">
                <h3>Expenses Most Paid For</h3>
                <table>
                    <thead>
                        <tr>
                            <th> Date </th>
                            <th> Detail </th>
                            <th> Category </th>
                            <th> Receiver </th>
                            <th> Paid By: </th>
                            <th> Amount </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            expenses
                            .sort((a, b) => b.amount - a.amount)
                            .slice(0, 5)
                            .map((exp, i) => (
                                <tr key={i}>
                                    <td>{exp.date}</td>
                                    <td className='detail'>{exp.expName}</td>
                                    <td className='category'>{exp.category}</td>
                                    <td>{exp.receiver}</td>
                                    <td className='means'>{exp.meansOfPayment}</td>
                                    <td>{exp.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            </div>

            <div className="buttons">
                <button className={ overview ? 'button' : 'btn' } onClick={() =>{setOverview(true)}}>
                    Overview
                </button>
                <button className={ !overview ? 'button' : 'btn' } onClick={() =>{setOverview(false)}}>
                    All Transactions
                </button>
            </div>

            <div className="barChartAndExpenses">
                {
                    overview &&
                    <Barchart
                        labels = {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']}
                        data={
                            [jan, feb,mar, apr, may, jun, jul, aug, sept, oct, nov, dec]
                        }
                        tooltip='Expense Overview'
                    />
                }

                

                {
                    !overview &&
                    <div className="allTransactions">
                        <div className="expTranTop">
                            <h3>All Expense Transactions</h3>

                            <div className="filterOptions"> 
                                <div>
                                    <label htmlFor="filterBy">Filter By:</label>
                                    <select name="filterBy" id="filterBy" value={filterOption} onChange={handleFilterOption} className='btn'>
                                        <option value="detail">Detail</option>
                                        <option value="category">Category</option>
                                        <option value="receiver">Receiver</option>
                                        <option value="means">Paid By</option>
                                    </select>
                                </div>
                                <input type="text" name="filterExp" value={value} onChange={handleChange} placeholder={filterOption === 'detail' ? 'Enter Exp Name' : filterOption === 'receiver' ? 'Enter Receiver' : filterOption === 'means' ? 'Enter Means Of Payment' : filterOption === 'category' ? 'Enter Category' : null} className='btn'/>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Detail</th>
                                    <th>Category</th>
                                    <th>Receiver</th>
                                    <th>Paid By:</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    expenses
                                    .filter(exp => {
                                            if (!value) return true
                                            switch(filterOption){
                                                case 'detail': 
                                                    if (exp.expName.toLowerCase().includes(value.toLowerCase())) {
                                                    return true
                                                    }

                                                case 'category':
                                                    if (exp.category.toLowerCase().includes(value.toLowerCase())) {
                                                    return true
                                                    }

                                                case 'means' :
                                                    if (exp.meansOfPayment.toLowerCase().includes(value.toLowerCase())) {
                                                    return true
                                                    }

                                                case 'receiver':
                                                    if (exp.receiver.toLowerCase().includes(value.toLowerCase())) {
                                                    return true
                                                    }

                                                default : return false
                                            }
                                        })
                                        .sort((a, b)=> new Date(b.date) - new Date(a.date))
                                        .map((exp, i) => (
                                            <tr key={i} className='allExpenses'>
                                                <td>{exp.date}</td>
                                                <td className='detail'>{exp.expName}</td>
                                                <td className='category'>{exp.category}</td>
                                                <td>{exp.receiver}</td>
                                                <td className='means'>{exp.meansOfPayment}</td>
                                                <td>{exp.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                
                                                <td className='updateExpense'>
                                                    <i class="fas fa-pen" dataset='update' onClick={()=>{
                                                        setUpdateData(exp);
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
                                                    ))
                                }
                            </tbody>
                        </table>

                        {}
                    </div>
                }

            </div>

            {
                fetching && <Loader />
            }

            {
                newExpense && <NewExpense onClick={()=>{setNewExpense(false) }} />
            }
            {
                updateExpense &&
                <UpdateExpense
                    date={updateData.date}
                    expName={updateData.expName}
                    receiver={updateData.receiver}
                    category={updateData.category}
                    meansOfPayment={updateData.meansOfPayment}
                    amount={updateData.amount}
                    handleChange={(e)=>{
                        const {name, value} = e.target
                        setUpdateData(prev =>{
                            return {
                                ...prev,
                                [name] : value
                            }
                        })
                    }}
                    onClick={()=>{
                        setUpdateExpense(false)
                    }}
                    handleUpdate={async ()=>{
                        setUpdateExpense(false)
                        setfetching(true)
                        await baseURL.put('/expenses/update', updateData)
                        .then(res =>{
                            if(res.status === 200){
                                let source = axios.CancelToken.source();
                                let unMounted = false;
                                baseURL.get('/expenses', {
                                    cancelToken: source.token
                                })
                                .then(res =>{
                                    setfetching(false)
                                    setExpenses(res.data)
                                })
                                .catch(err =>{
                                    if (!unMounted) {
                                        if (axios.isCancel(err)) {
                                        console.log('Request Cancelled');
                                    }else{
                                        console.log('Something went wrong');
                                    }
                                    }
                                })
                                }else{
                                    console.log('could not delete')
                                }
                        })
                            
                    }}
                />
            }

            {
                deleteBox &&
                <DeleteBox
                    onClick={()=>{
                        setDeleteBox(false)
                    }}
                    handleDelete={
                        async ()=>{
                            setDeleteBox(false)
                            setfetching(true)
                            await baseURL.patch('/expenses/delete', updateData)
                            .then((res) => {
                                if(res.status === 200){
                                    let source = axios.CancelToken.source();
                                    let unMounted = false;
                                    baseURL.get('/expenses', {
                                    cancelToken: source.token
                                })
                                .then(res =>{
                                    setfetching(false)
                                    setExpenses(res.data)
                                })
                                .catch(err =>{
                                    if (!unMounted) {
                                        if (axios.isCancel(err)) {
                                        console.log('Request Cancelled');
                                    }else{
                                        console.log('Something went wrong');
                                    }
                                    }
                                })
                                }else{
                                    console.log('could not delete')
                                }
                                
                            })
                        }
                    }
                />
            }
        </div>
    )
}

export default ExpensesPage
