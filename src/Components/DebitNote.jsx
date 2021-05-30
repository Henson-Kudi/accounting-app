import React, {useEffect, useState, useRef} from 'react'
import './Quotation.css';
import {data1} from './data'
// import {saveAs} from 'file-saver'
import axios from 'axios'
import {baseURL} from './axios'
import Loader from './Loader'
import NewCustomerForm from './NewCustomerForm'


function DebitNote({onClick}) {
    const [active, setActive] = useState(false);
    const [collapseAdditions, setCollapseAdditions] = useState(false)
    const [collapseDeductions, setCollapseDeductions] = useState(false)
    const [newCustomer, setNewCustomer] = useState(false)
    const [fetching, setfetching] = useState(true)
    const [products, setProducts] = useState([])
    const [customers, setCustomers] = useState([])
    const [debitNotes, setDebitNotes] = useState([])

    const [additionsAndSubtractions, setAdditionsAndSubtractions] = useState({
        rebate: '',
        tradeDiscount: '',
        cashDiscount: '',
        valueAddedTax: ''
    })

    const [data, setData] = useState(data1)

    const [value, setValue] = useState('')

    const date = new Date();
    const today = date.getDate();
    const month = date.getMonth()
    const year = date.getFullYear();
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

    const [noteInput, setNoteInput] = useState({
        date: `${today}/${month + 1}/${year}`,
        noteNumber: `00${debitNotes.length + 1}`,
        customerName: ''
    })

    const sumTotal = data.map(data => {return(data.amount((data.qty), (data.up)))}).reduce((a, b)=>{return Number(a) + Number(b)}, 0)
    const rebateValue = (sumTotal * (Number(additionsAndSubtractions.rebate)/100)).toFixed(2)
    const commercialNet1 = sumTotal - rebateValue;
    const tradeDiscountValue = (commercialNet1 * (Number(additionsAndSubtractions.tradeDiscount)/100)).toFixed(2)
    const commercialNet2 = commercialNet1 - tradeDiscountValue
    const cashDiscountValue = (commercialNet2 * (Number(additionsAndSubtractions.cashDiscount)/100)).toFixed(2)
    const financialNet = commercialNet2 - cashDiscountValue
    const valueAddedTax = (financialNet * (Number(additionsAndSubtractions.valueAddedTax)/100)).toFixed(2)
    const totalOtherAdditions = otherAdditions.map(item => item.amount).reduce((a,b)=> (Number(a) + Number(b)))

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

        setNoteInput(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        })
    }

    const elements = data.filter(ele => ele.productName !== '' && ele.qty !== '' && ele.up !== '').map(all => (
        {
            productName: all.productName,
            qty: all.qty,
            up: all.up,
            amount: all.qty * all.up
        }
    ))

    const additions = otherAdditions.filter(ele => ele.name !== '' && ele.amount !== '')


    const noteData = {
        noteInput,
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
        netPayable: ((financialNet + Number(valueAddedTax) + totalOtherAdditions)).toFixed(2),
    }

    const handleSubmit = async ()=>{
        setTimeout(()=>{
            setfetching(true)
        }, 500)
        
        baseURL.post('/debitNote', noteData)
        // .then(() => axios.get(`/invoices/${noteInput.noteNumber}`, {responseType: 'blob'}))
        // .then(res => {
            
        //     const pdfBlob = new Blob([res.data], {type:'application/pdf'})
        //     saveAs(pdfBlob, `creditNoteNumber${noteInput.noteNumber}`)
        //     axios.post(`/sendCreditNote/${noteInput.noteNumber}`, {customerDetails})
            
            .then((res)=>{
                console.log(res.data);
                onClick();
                setfetching(false)
            })
        // })
        
    }




    return (
        <div className="Quotation">
        <div className="close" onClick={onClick}>
            <i className="fas fa-times fa-lg"></i>
        </div>
            <h3>New Debit Note</h3>
            <div className="formContainer">
                <form action="" method="post">
                    <div className="quotationTop">
                        <div className="date">
                            <label htmlFor="date">Date:</label>
                            <input type="text" name='date' value={noteInput.date} id='date' contentEditable={false} readOnly={true}/>
                        </div>
                        <div className="noteNumber">
                            <label htmlFor='quoteNumber'>
                                Note Number:
                            </label>
                            <input type="text" name="quoteNumber" id="quoteNumber" value={noteInput.quoteNumber} readOnly={true}/>
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
                                            if (item.name.toLowerCase().includes(value.toLowerCase())) {
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
                            <textarea name="additionalInfo" id="additionalInfo" cols="60" rows="6" value={noteInput.additonalInfo} onChange={handleChange} placeholder='Add additional information to receiver' className='textArea'></textarea>
                        </div>
                        <div className="amount">
                            <h3>Net to your debit: {(financialNet + Number(valueAddedTax) + totalOtherAdditions).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
                        </div>
                    </div>

                    <div className="itemsContainer">
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
                                    <select name="productName" id="productName" value={data.productName} onChange={updateFieldChanged("productName")} onChange={updateFieldChanged("productName", index)}>
                                    <option> </option>
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
                                        type="text"
                                        name="qty"
                                        value={data.qty}
                                        onChange={updateFieldChanged("qty", index)}
                                    />

                                    <input
                                        type="text"
                                        name="up"
                                        value={data.up}
                                        onChange={updateFieldChanged("up", index)}
                                    />

                                    <input
                                        type="text"
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
                            <h5>Deductions</h5>
                            <div className="deductions">
                                <button onClick={()=>{setCollapseDeductions(!collapseDeductions)}} type='button'>{collapseDeductions ? 'Shrink Deductions' : 'Collapse Deductions'}</button>
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
                            </div>
                            
                            <div className="additions">
                                <h5>Additions</h5>
                                <button onClick={()=>{setCollapseAdditions(!collapseAdditions)}} type='button'>{collapseAdditions ? 'Shrink Additions' : 'Collapse All'}</button>
                                <ul className='otherAdditions'>
                                        <div className="otherAdditions">
                                            <li className='additionItem'>
                                            <b><span>Element</span></b>
                                            <b><span>Amount</span></b>
                                        </li>
                                        </div>
                                        <div className="otherAdditions">
                                            <li className='deductItem additionItem'>
                                            <span>
                                                Tax (VAT) Rate
                                            </span>
                                            
                                            <input type="text" name="valueAddedTax" id="valueAddedTax" onChange={(e)=>{handleAdditionsAndSubtractions(e)}} value={additionsAndSubtractions.valueAddedTax}/>

                                            <span>
                                                {
                                                    valueAddedTax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                }
                                            </span>
                                        </li>
                                        </div>
                                            
                                    
                                    {
                                        collapseAdditions && <div className="otherAdditions"
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
                                        }
                                        <div className="otherAdditions">
                                            <div className="additionItem">
                                            <h5>Total Additions</h5>
                                        <h5>{(Number(valueAddedTax) + totalOtherAdditions).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h5>
                                        </div>
                                        </div>
                                </ul>
                            </div>
                            <div className="netPay">
                                <h3>Net To Your Debit</h3>
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
                                onClick={() => {
                                    handleSubmit()
                                console.log('Save Button Clicked')
                                }}
                                type="button" className='addRows btn'>
                                Save
                            </button>

                            <button
                                onClick={() => {
                                    handleSubmit()
                                console.log('Save and send Button Clicked')
                                }}
                                type="button" className='addRows btn'>
                                Save and Send
                            </button>
                        </div>

                </form>

            </div>
            {
                newCustomer && <NewCustomerForm onClick={()=>{setNewCustomer(false)}}
                />
            }

            {
                fetching && <Loader />
            }
        </div>
    )
}

export default DebitNote

