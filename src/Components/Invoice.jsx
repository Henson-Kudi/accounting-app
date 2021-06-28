import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import './Quotation.css';
import {data1} from './data'
import {baseURL} from './axios'
import NewCustomerForm from './NewCustomerForm'
// import {saveAs} from 'file-saver'
import Loader from './Loader'
import Alert from './Alert';


function Invoice({onClick, refetch}) {
    const [active, setActive] = useState(false);
    const [collapseAdditions, setCollapseAdditions] = useState(false)
    const [collapseDeductions, setCollapseDeductions] = useState(false)
    const [newCustomer, setNewCustomer] = useState(false)
    const [fetching, setfetching] = useState(true)
    const [customers, setCustomers] = useState([])
    const [products, setProducts] = useState([])
    const [invoices, setInvoices] = useState([])
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const [additionsAndSubtractions, setAdditionsAndSubtractions] = useState({
        rebate: '',
        tradeDiscount: '',
        cashDiscount: '',
        valueAddedTax: ''
    })

    const [data, setData] = useState(data1)

    const [value, setValue] = useState('')

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth()
    const year = date.getFullYear();
    const invoiceDate = new Date(`${month +1}/${day}/${year}`).toDateString();
    const [selectInvoiceTerm, setSelectInvoiceTerm] = useState('15')

    const handleSelectInvoiceTerm = (e) => {
        setSelectInvoiceTerm(Number(e.target.value));
    };

    useEffect(async() => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        const request1 = baseURL.get('/products')
        const request2 = baseURL.get('/customers')
        await axios.all([request1, request2], {
            cancelToken: source.token
        })
        .then(res => {
            const [result1, result2] = res
            setProducts(result1.data)
            setCustomers(result2.data.customers)
            setInvoices(result2.data.invoices)
            setfetching(false)
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

    

    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        email: '',
        billingAddress: {
            country: '',
            city: '',
            street: ''
        },
        contact: {
            telephone: '',
            mobile: '',
            fax: ''
        }
    });
    const [height, setHeight] = useState(7.5);
    const realVal = height > 36 ? "100%" : `${height}rem`;

    const updateFieldChanged = (name, index) => (event) => {
        let newArr = data.map((item, i) => {
        if (index === i) {
            return { ...item, [name]: event.target.value };
        } else {
            return item;
        }
        });
        setData(newArr);
    };

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
    const otherAdditionsChange = (name, index) => (event) => {
        let newArr = otherAdditions.map((item, i) => {
        if (index === i) {
            return { ...item, [name]: event.target.value };
        } else {
            return item;
        }
        });
        setOtherAdditions(newArr);
    };

    const wrapperRef = useRef(null)


    const handleAdditionsAndSubtractions = (e)=>{
        const {name, value} = e.target

        setAdditionsAndSubtractions(prevValue =>{
            return {
                ...prevValue,
                [name] : value
            }
        })
    }

    const [quoteInput, setQuoteInput] = useState({
        date: invoiceDate,
        invoiceNumber: `00${(invoices?.length) + 1}`,
        customerName: '',
        dueDate: (value)=>{
            
            const today = new Date(`${month + 1}/${day}/${year}`);
            const futureDate = new Date(today.setDate(today.getDate()+ Number(value)))
            return futureDate.toDateString();
            }
        });

    const sumTotal = data.map(data => {return(data.amount((data.qty), (data.up)))}).reduce((a, b)=>{return Number(a) + Number(b)}, 0);
    const rebateValue = (sumTotal * (Number(additionsAndSubtractions.rebate)/100)).toFixed(2)
    const commercialNet1 = sumTotal - rebateValue;
    const tradeDiscountValue = (commercialNet1 * (Number(additionsAndSubtractions.tradeDiscount)/100)).toFixed(2)
    const commercialNet2 = commercialNet1 - tradeDiscountValue
    const cashDiscountValue = (commercialNet2 * (Number(additionsAndSubtractions.cashDiscount)/100)).toFixed(2)
    const financialNet = commercialNet2 - cashDiscountValue
    const valueAddedTax = (financialNet * (Number(additionsAndSubtractions.valueAddedTax)/100)).toFixed(2)
    const totalOtherAdditions = (otherAdditions.map(item => item.amount).reduce((a,b)=> (Number(a) + Number(b))))

    useEffect(() => {
        customers.filter(cust => (
            cust.name === value
        )).map(value => (
            setCustomerDetails({...value})
        ))
        
    }, [value])

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e){
        const {current : wrap} = wrapperRef;
        if(wrap && !wrap.contains(e.target)){
            setActive(false);
        }
    }


    const handleChange = (e) => {
        const {name, value} = e.target

        setQuoteInput(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        })
    }

    const elements = data.filter(ele => ele.productName !== '' && ele.qty !== '' && ele.up !== '').map(all => (
        {
            productName: all.productName,
            description: all.description,
            qty: all.qty,
            up: all.up,
            amount: all.qty * all.up
        }
    ))

    const additions = otherAdditions.filter(ele => ele.name !== '' && ele.amount !== '')

    const invoiceData = {
        invoiceInput: {
            date : quoteInput.date,
            invoiceNumber : quoteInput.invoiceNumber,
            customerName : quoteInput.customerName,
            dueDate : quoteInput.dueDate(selectInvoiceTerm)
        },
        selectInvoiceTerm,
        customerDetails,
        data : elements,
        additionsAndSubtractions,
        discountsAndVat: {
            rebateValue,
            tradeDiscountValue,
            cashDiscountValue,
            valueAddedTax
        },
        otherAdditions: additions,
        grossAmount: sumTotal,
        netPayable: (financialNet + Number(valueAddedTax) + totalOtherAdditions),
        totalPaid: 0,
        balanceDue: (financialNet + Number(valueAddedTax) + totalOtherAdditions),
        dueDate: quoteInput.dueDate(selectInvoiceTerm)
    }

    const handleSubmit = async ()=>{
        if (customerDetails.name !== '') {
            if (elements.length > 0) {
                setTimeout(()=>{
                    setfetching(true)
                }, 500)
                
                baseURL.post('/invoices', invoiceData)
                // .then(() => axios.get(`/invoices/${quoteInput.invoiceNumber}`, {responseType: 'blob'}))
                // .then(res => {
                    
                //     const pdfBlob = new Blob([res.data], {type:'application/pdf'})
                //     saveAs(pdfBlob, `invoiceNumber${quoteInput.invoiceNumber}`)
                //     axios.post(`/sendInvoice/${quoteInput.invoiceNumber}`, {customerDetails})
                    
                    .then(()=>{
                        onClick();
                        refetch()
                        setfetching(false)
                    })
                // })
            } else {
                setAlertMessage('Please select a customer and add at least one product')
                setAlert(true)
                setTimeout(()=>{
                    setAlert(false)
                }, 3000)
            }
        } else {
            setAlertMessage('Please select a customer and add at least one product')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
        }
        
    }


    return (
        <div className="Quotation">
        <div className="close">
            <i className="fas fa-times fa-lg" onClick={onClick}></i>
        </div>
            <h3>New Invoice</h3>
            <div className="formContainer">
                <form action="" method="post">
                    <div className="quotationTop">
                        <div className="date">
                            <label htmlFor="date">Date:</label>
                        <input type="text" name='date' value={quoteInput.date} id='date' contentEditable={false} readOnly={true}/>
                        </div>

                        <div className="select">
                                <label htmlFor="invoiceDuration">Terms</label>
                            <select
                                name="invoiceDuration"
                                id="invoiceDuration"
                                onChange={handleSelectInvoiceTerm}
                                value={selectInvoiceTerm}
                            >
                                <option value="" hidden={true}>Select(default: 15)</option>
                                <option value={15}>15 days</option>
                                <option value={30}>30 days</option>
                                <option value={45}>45 days</option>
                                <option value={60}>60 days</option>
                                <option value={75}>75 days</option>
                                <option value={90}>90 days</option>
                            </select>
                        </div>
                        <div className="dueDate">
                            <label htmlFor="dueDate">
                                Due Date:
                            </label>
                            <input type="text" id="dueDate" name="dueDate" value={quoteInput.dueDate(selectInvoiceTerm)} readOnly={true}/>
                        </div>
                        
                        <div className="invoiceNumber">
                            <label htmlFor='InvoiceNumber'>
                                Invoice Number:
                            </label>
                            <input type="text" name="invoiceNumber" id="invoiceNumber" value={quoteInput.invoiceNumber} readOnly={true}/>
                        </div>
                    </div>

                    <div className="customerDetails">
                        <div ref={wrapperRef} className='customerName'>
                            <label htmlFor="customerName">Receiver: </label>
                            <input 
                                type="text"
                                value={value} 
                                onChange={(e)=>{setValue(e.target.value)}}
                                onClick={()=>{setActive(!active)}}
                                name='customerName'
                                className='autoListItemInput'
                                id='customerName'
                                placeholder='Select Customer'
                            />

                            {
                                active && <div className="autoCompleteContainer">
                                <button
                                    type="button"
                                    onClick={()=>{setNewCustomer(true)}}
                                >Add New Customer</button>
                                    {
                                        customers
                                        .filter(item => {
                                            if (!value) return true
                                            if (item.name?.toLowerCase().includes(value?.toLowerCase())) {
                                            return true
                                            }
                                        })
                                        .map((item, i) => (
                                            <div
                                                className='autoListItem'
                                                onClick={()=>{setValue(item.name); setActive(false);}}
                                                key={i}
                                                tabIndex='0'
                                            >
                                                <p>{item.name}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                        <div className="customerEmail">
                            <p><b>Email: </b>{customerDetails?.email}</p>
                        </div>
                        <div className="deliveryAdress">
                            <h4>Delivery Address & Contact</h4>
                            <div className="addressInfo">
                                <p><b>Country: </b>{customerDetails?.country}</p>
                                <p><b>City: </b>{customerDetails?.city}</p>
                                <p><b>Street: </b>{customerDetails?.street}</p>

                                <p><b>Tel: </b>{customerDetails?.telephone}</p>
                                <p><b>Mobile: </b>{customerDetails?.mobile}</p>
                                <p><b>Fax: </b>{customerDetails?.fax}</p>
                            </div>
                        </div>
                    </div>
                    <div className="additionalInfo">
                        <div className="textArea">
                            <textarea name="additionalInfo" id="additionalInfo" cols="60" rows="6" value={quoteInput.additonalInfo} onChange={handleChange} placeholder='Add additional information to receiver' className='textArea'></textarea>
                        </div>
                        <div className="amount">
                            <h3>Net Payable: {(financialNet + Number(valueAddedTax) + totalOtherAdditions).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
                        </div>
                    </div>

                    <div className="itemsContaainer">
                        <ul>
                            <li className='listItem'>
                                <span className='listTitle'>Product Name</span>
                                    <span className='listTitle'>Description</span>
                                <span className='listTitle'>Quantity</span>
                                <span className='listTitle'>Unit Price</span>
                                <span className='listTitle'>Amount</span>
                            </li>
                        </ul>

                        <ul
                            style={{
                            height: `${realVal}`,
                            overflow: "hidden"
                            }}
                            className='items'
                        >
                            
                            {data.map((data, index) => (
                                <li className='listItem' key={index}>
                                    <select name="productName" value={data.productName} onChange={updateFieldChanged("productName", index)}
                                    >
                                    <option value=""></option>
                                    
                                        {products.map(product => (
                                            <option value={product.productName}>{product.productName}</option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        name="description"
                                        value={data.description}
                                        onChange={updateFieldChanged("description", index)}
                                    />

                                    <input
                                        type="number"
                                        name="qty"
                                        value={data.qty}
                                        onChange={updateFieldChanged("qty", index)}
                                    />

                                    <input
                                        type="number"
                                        name="up"
                                        value={data.up}
                                        onChange={updateFieldChanged("up", index)}
                                    />

                                    <input
                                        type="number"
                                        name="amount"
                                        value={data.amount(data.qty, data.up)}
                                        readOnly={true}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="summation">
                            <button
                            onClick={() => {
                            setHeight((prev) => {
                                return prev + 7.3;
                            });
                            if(realVal ==='100%'){
                                alert('Cannot add more rows.')
                            }
                            }}
                            type="button" className='addRows btn'>
                            Add Rows
                        </button>

                        
                        <h3 className='amount'>Gross Amount: {sumTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
                        </div>

                        <div className="deductionsAndAdditions">
                            <div className="hideAndShow">
                                <h5>Deductions</h5>
                            <button onClick={()=>{setCollapseDeductions(!collapseDeductions)}} type='button'>{collapseDeductions ? 'Hide' : 'Show'}</button>
                            </div>
                            <div className="deductions">
                                
                                {
                                    collapseDeductions && <ul className='deductions'>
                                    <li className='deductItem'>
                                        <b><span className='elements'>Elements</span></b>
                                        <b><span>Rate</span></b>
                                        <b><span>Amount</span></b>
                                    </li>

                                    <li className='deductItem'>
                                        <span className='elements'>
                                            Rebate   
                                        </span>
                                        <input type="number" name="rebate" id="rebate" onChange={(e)=>{handleAdditionsAndSubtractions(e)}} value={additionsAndSubtractions.rebate}/>

                                        <u>(<span>
                                            {
                                                rebateValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            }
                                        </span>)</u>
                                    </li>
                                    <li className='deductItem'>
                                        <span className='elements'>
                                            <b>Commercial Net</b>
                                        </span>
                                        <b><span>
                                            {commercialNet1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </span></b>
                                    </li>

                                    <li className='deductItem'>
                                        <span className='elements'>
                                            Trade Discount
                                        </span>
                                        <input type="number" name="tradeDiscount" id="tradeDiscount" onChange={(e)=>{handleAdditionsAndSubtractions(e)}} value={additionsAndSubtractions.tradeDiscount}/>

                                        <u>
                                            (
                                                <span>
                                            {
                                                tradeDiscountValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            }
                                        </span>
                                            )
                                        </u>
                                    </li>

                                    <li className='deductItem'>
                                        <span className='elements'>
                                            <b>Commercial Net</b>
                                        </span>
                                        <b><span>
                                            {commercialNet2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </span></b>
                                    </li>

                                    <li className='deductItem'>
                                        <span className='elements'>
                                            Cash Discount
                                        </span>
                                        <input type="number" name="cashDiscount" id="cashDiscount" onChange={(e)=>{handleAdditionsAndSubtractions(e)}} value={additionsAndSubtractions.cashDiscount}/>

                                        <u>
                                            (
                                                <span>
                                            {
                                                cashDiscountValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            }
                                        </span>
                                            )
                                        </u>
                                    </li>

                                    <li className='deductItem'>
                                        <span className='elements'>
                                            <b>Financial Net</b>
                                        </span>
                                        <b><span>
                                            {financialNet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </span></b>
                                    </li>
                                </ul>
                                }
                                <ul className="deductions">
                                    <li className='deductItem additionItem'>
                                        <span>
                                            Tax (VAT) Rate
                                        </span>
                                            
                                        <input type="number" name="valueAddedTax" id="valueAddedTax" onChange={(e)=>{handleAdditionsAndSubtractions(e)}} value={additionsAndSubtractions.valueAddedTax}/>

                                        <span>
                                                {
                                                    valueAddedTax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            }
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="additions">
                                <div className="hideAndShow">
                                    <h5>Additions</h5>
                                    <button onClick={()=>{setCollapseAdditions(!collapseAdditions)}} type='button'>{collapseAdditions ? 'Hide' : 'Show'}</button>
                                </div>
                                {
                                        collapseAdditions && <ul className='otherAdditions'>
                                        <div className="otherAdditions">
                                            <li className='additionItem'>
                                            <b><span>Element</span></b>
                                            <b><span>Amount</span></b>
                                        </li>
                                        </div>
                                        <div className="otherAdditions">
                                            
                                        </div>
                                            
                                    
                                    <div className="otherAdditions"
                                        >
                                        {
                                            otherAdditions.map((data, index)=>(
                                                <li key={index} className='additionItem'>
                                                    <input type="text" value={data.name} onChange={otherAdditionsChange('name', index)} name='name'/>

                                                    <input type="number" value={data.amount} onChange={otherAdditionsChange('amount', index)} name='amount'/>
                                                </li>
                                            ))
                                        }
                                        </div>
                                        
                                        <div className="otherAdditions">
                                            <div className="additionItem">
                                            <h5>Total Additions</h5>
                                        <h5>{(totalOtherAdditions).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h5>
                                        </div>
                                        </div>
                                    
                                </ul>}
                            </div>
                            <div className="netPay">
                                <h3>Net Payable</h3>
                            <h3>
                                {(financialNet + Number(valueAddedTax) + totalOtherAdditions).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </h3>
                            </div>
                        </div>
                        
                        <div className="saveOptions">
                            <button
                                onClick={onClick}
                                type="button" className='addRows btn'>
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                type="button" className='addRows btn'>
                                Save
                            </button>

                            <button
                                onClick={handleSubmit}
                                type="button" className='addRows btn'>
                                Save and Send
                            </button>
                        </div>

                </form>

                

                {
                    newCustomer && <NewCustomerForm onClick={()=>{setNewCustomer(false)}}
                    />
                }

            </div>
            {
                    fetching &&

                        <Loader />
                }
                <Alert
                    alert={alert}
                    message={alertMessage}
                />
        </div>
    )
}

export default Invoice

