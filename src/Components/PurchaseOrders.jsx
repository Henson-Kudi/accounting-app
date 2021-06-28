import React, { useState, useEffect, useRef } from 'react'
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router'
import './Invoices.css'
import PurchaseOrder from './PurchaseOrder'
import axios from 'axios'
import { baseURL } from './axios'
import Loader from './Loader'
import ConfirmMessageBox from './ConfirmMessageBox'
import Alert from './Alert'

function PurchaseOrders() {
    const history = useHistory()
    const [newOrder, setNewOrder] = useState(false)
    const [loader, setLoader] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const [data, setData] = useState([])
    const [filter, setFilter] = useState({})

    const [orderData, setOrderData] = useState({})
    const [upDateToInvoice, setUpdateToInvoice] = useState(false)
    const [discountsAndVat, setDiscountsAndVat] = useState({
        valueAddedTax: '',
        cashDiscount: '',
        tradeDiscount: '',
        rebate: '',
        selectInvoiceTerm: 15
    })

    const [otherAdditions, setOtherAdditions] = useState([
        {
            name: '',
            amount: ''
        },
        {
            name: '',
            amount: ''
        },
        {
            name: '',
            amount: ''
        },
        {
            name: '',
            amount: ''
        },
    ])
    const ref = useRef(null)

    const handleChange = (e)=>{
        const {name, value} = e.target

        setFilter(prev =>(
            {
                ...prev,
                [name]: value
            }
        ))
    }

    const fetchOrder = async(source, unMounted)=>{
        try {
            setLoader(true)
            const res = await baseURL.get('/purchaseOrders', {
                cancelToken: source.token
            })
            setData(res.data)
            setLoader(false)
        } catch (error) {
            if (!unMounted) {
                if (axios.isCancel(error)) {
                console.log('Request Cancelled');
            }else{
                console.log('Something went wrong');
            }
            }
        }
    }

    useEffect(()=>{
        let source = axios.CancelToken.source();
        let unMounted = false;
        fetchOrder(source, unMounted)

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    // data.forEach(item => {
    //     const element = item.data
    //     element.forEach(order => {
    //         orders.push({
    //             ...order,
    //             name: item.supplierDetails.name,
    //             number: item.orderInput.orderNumber,
    //             date: item.orderInput.date,
    //             id: item._id
    //         })
    //     })
    // })

    const handlePush = (route)=>{
        history.push(route)
    }

    // const handle_Change = (e) => {
    //     const {name, value} = e.target
    //     setDiscountsAndVat(prev => (
    //         {
    //             ...prev,
    //             [name] : value
    //         }
    //     ))
    // }
    // const otherAdditionsChange = (name, index) => (event) => {
    //     let newArr = otherAdditions.map((item, i) => {
    //     if (index === i) {
    //         return { ...item, [name]: event.target.value };
    //     } else {
    //         return item;
    //     }
    //     });
    //     setOtherAdditions(newArr);
    // }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e){
        const {current : wrap} = ref;
        if(wrap && !wrap.contains(e.target)){
            setUpdateToInvoice(false);
        }
    }

    const today = new Date().toDateString()
    const dueDate = (value)=>{
        const today = new Date()
        const futureDate = new Date(today.setDate(today.getDate()+ Number(value)))
        return futureDate.toDateString();
    }

    const sumTotal = orderData?.amount;
    const rebateValue = (sumTotal * (Number(discountsAndVat?.rebate)/100)).toFixed(2) || 0
    const commercialNet1 = sumTotal - rebateValue;
    const tradeDiscountValue = (commercialNet1 * (Number(discountsAndVat?.tradeDiscount)/100)).toFixed(2) || 0
    const commercialNet2 = commercialNet1 - tradeDiscountValue
    const cashDiscountValue = (commercialNet2 * (Number(discountsAndVat?.cashDiscount)/100)).toFixed(2) || 0
    const financialNet = commercialNet2 - cashDiscountValue
    const valueAddedTax = (financialNet * (Number(discountsAndVat?.valueAddedTax)/100)).toFixed(2) || 0
    const totalOtherAdditions = (otherAdditions.map(item => item.amount).reduce((a,b)=> (Number(a) + Number(b))))
    const additions = otherAdditions.filter(ele => ele.name !== '' && ele.amount !== '')

    const invoiceData = {
        invoiceInput: {
            date : orderData.orderInput?.date,
            invoiceNumber : orderData.orderInput?.orderNumber,
            supplierName : orderData.orderInput?.supplierName,
            dueDate : orderData?.dueDate
        },
        selectInvoiceTerm : orderData.selectInvoiceTerm,
        supplierDetails : orderData?.supplierDetails,
        data : orderData.data,
        additionsAndSubtractions : orderData.additionsAndSubtractions,
        discountsAndVat: orderData.discountsAndVat,
        otherAdditions: orderData.otherAdditions,
        grossAmount: orderData.grossAmount,
        netPayable: orderData.netPayable,
        totalPaid: 0,
        balanceDue: orderData.netPayable,
        dueDate: orderData.dueDate
    }

    // const invoiceData = {
    //     invoiceInput: orderData?.orderInput,
    //     selectInvoiceTerm: orderData?.selectInvoiceTerm,
    //     supplierDetails: orderData?.supplierDetails,
    //     data: orderData?.data,
    //     additionsAndSubtractions: orderData?.additionsAndSubtractions,
    //     discountsAndVat: orderData?.discountsAndVat,
    //     otherAdditions: orderData?.otherAdditions,
    //     grossAmount: orderData?.grossAmount,
    //     netPayable: orderData?.netPayable
    // }


    const handleInvoiceSubmit = ()=>{

        baseURL.post('/purchaseInvoice', invoiceData)
        // .then(() => axios.get(`/invoices/${quoteInput.invoiceNumber}`, {responseType: 'blob'}))
        // .then(res => {
            
        //     const pdfBlob = new Blob([res.data], {type:'application/pdf'})
        //     saveAs(pdfBlob, `invoiceNumber${quoteInput.invoiceNumber}`)
        //     axios.post(`/sendInvoice/${quoteInput.invoiceNumber}`, {customerDetails})
            
            .then(()=>{
                setUpdateToInvoice(false);
                setLoader(false)
                setAlert(true);
                setAlertMessage('Updated To Invoice Successfully');
                    setTimeout(() => {
                    setAlert(false);
                    setAlertMessage('');
                }, 2000)
            })
        // })
    }

    const handleSendInvoice = ()=>{
        setAlert(true);
        setAlertMessage('function coming soon!!!');
        setTimeout(() => {
            setAlert(false);
            setAlertMessage('');
        }, 2000)
    }



    return (
        <div className='Invoices'>
            {
            !loader && 
            <div className='Invoices'>
                <div className="invoicesHeading">
                    <h1>Purchase Orders</h1>
                    <button className="invoiceButton" onClick={()=>{setNewOrder(true)}}>New Order</button>
                </div>

                <div className="invoiceFilters">
                    <div className="nameFilter">
                        <input type="text" name='nameFilter' value={filter.nameFilter} onChange={handleChange} className='filterInput' placeholder='Filter by customer name' />
                    </div>

                    <div className="amountFilter">
                        <input type="text" name='amountFilter' value={filter.amountFilter} onChange={handleChange} className='filterInput' placeholder='Filter by amount' />
                    </div>
                </div>

                <div className="allDebtorsContainer">
                    <table className="allDebtorsTable">
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Order Number</th>
                                <th>Date</th>
                                <th>Due Date</th>
                                <th>Gross Amoount</th>
                                <th>Net Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.sort((a, b)=> new Date(b.orderInput.date) - new Date(a.orderInput.date)).filter(item => {
                                    if(!filter.nameFilter){
                                        if(!filter.amountFilter){
                                            return true
                                        }
                                    }
                                    if(!filter.amountFilter){
                                        if(!filter.nameFilter){
                                            return true
                                        }
                                    }
                                    
                                    if(item.name?.toLowerCase().includes(filter.nameFilter?.toLowerCase())){return true}
                                    if(item.amount?.toString().includes(filter.amountFilter)){return true}
                                }).map((order, i) => (
                                    <tr key={order.__id} className='invoiceDetail'>
                                        <td onClick={()=>{handlePush(`/purchase-orders/${order._id}`)}}>{order.supplierDetails.name}</td>
                                        <td onClick={()=>{handlePush(`/purchase-orders/${order._id}`)}}>{order.orderInput.orderNumber}</td>
                                        <td onClick={()=>{handlePush(`/purchase-orders/${order._id}`)}}>{new Date(order.orderInput.date).toLocaleDateString()}</td>
                                        <td onClick={()=>{handlePush(`/purchase-orders/${order._id}`)}}>{order.dueDate}</td>
                                        <td onClick={()=>{handlePush(`/purchase-orders/${order._id}`)}}>{(Number(order.grossAmount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td onClick={()=>{handlePush(`/purchase-orders/${order._id}`)}}>{(Number(order.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='sendInvoice'>
                                            <span onClick={handleSendInvoice}>
                                                <i className="fas fa-share fa-sm"></i>
                                                <small style={{display: 'block'}}>Send</small>
                                            </span>
                                            <span onClick={() =>{
                                                setOrderData({
                                                    ...order,
                                                    totalPaid: 0,
                                                    balanceDue: order.netPayable
                                                })
                                                setUpdateToInvoice(true)
                                            }}>
                                                <i className="fas fa-file-alt fa-sm"></i>
                                                <small style={{display: 'block'}}>New</small>
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {
                    newOrder && <PurchaseOrder
                    onClick={()=>{setNewOrder(false)}}
                    fetching={()=>{
                        setAlert(true);
                        setAlertMessage('Purchase Order Added Successfully');
                            setTimeout(() => {
                            setAlert(false);
                            setAlertMessage('');
                        }, 2000)
                    }}
                    />
                }
            </div>
            }
            {
                upDateToInvoice &&
            <div ref={ref}>
                <ConfirmMessageBox
                    message="Confirm Update Order to Invoice??"
                    submit={handleInvoiceSubmit}
                />
            </div>
            }
            {
                loader && <Loader/>
            }
            <Alert
                alert={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default PurchaseOrders
