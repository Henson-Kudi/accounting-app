import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import './Quotation.css';
import {data1} from './data'
import {baseURL} from './axios'
// import {saveAs} from 'file-saver'
import NewCustomerForm from './NewCustomerForm'
import Loader from './Loader'


function Quotation({onClick}) {
    const [active, setActive] = useState(false);
    const [fetching, setfetching] = useState(true)
    const [newCustomer, setNewCustomer] = useState(false)

    const [data, setData] = useState(data1)
    const [customers, setCustomers] = useState([])
    const [products, setProducts] = useState([])
    const [quotes, setQuotes] = useState([])

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
        const request3 = baseURL.get('/quotations')
        await axios.all([request1, request2, request3], {
            cancelToken: source.token
        })
        .then(res => {
            const [result1, result2, result3] = res
            setProducts(result1.data)
            setCustomers(result2.data.customers)
            setQuotes(result3.data)
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
    const wrapperRef = useRef(null)

    const [quoteInput, setQuoteInput] = useState({
        date: `${today}/${month + 1}/${year}`,
        quoteNumber: `00${quotes.length + 1}`,
        customerName: ''
    })

    const sumTotal = data.map(data => {return(data.amount((data.qty), (data.up)))}).reduce((a, b)=>{return Number(a) + Number(b)}, 0)

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
            qty: all.qty,
            up: all.up,
            amount: all.qty * all.up
        }
    ))


    const quoteData = {
        quoteInput,
        customerDetails,
        data: elements,
        grossAmount: sumTotal
    }

    const handleSubmit = async ()=>{
        setTimeout(()=>{
            setfetching(true)
        }, 500)
        
        baseURL.post('/quotation', quoteData)
        // .then(() => axios.get(`/quotations/${quoteInput.quoteNumber}`, {responseType: 'blob'}))
        // .then(res => {
            
        //     const pdfBlob = new Blob([res.data], {type:'application/pdf'})
        //     saveAs(pdfBlob, `qoutationNumber${quoteInput.quoteNumber}`)
        //     axios.post(`/sendQuote/${quoteInput.quoteNumber}`, {customerDetails})
            
            .then(()=>{
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
            <h3>New Quotation</h3>
            <div className="formContainer">
                <form action="" method="post">
                    <div className="quotationTop">
                        <label htmlFor="date">Date:</label>
                        <input type="text" name='date' value={quoteInput.date} id='date' contentEditable={false} readOnly={true}/>
                        <label htmlFor="expDate">
                            Expiration Date:
                        </label>
                        <input type="date" id="expDate" name="expDate" value={quoteInput.expDate} onChange={handleChange}/>
                        <label htmlFor='quoteNumber'>
                            Quote Number:
                        </label>
                        <input type="text" name="quoteNumber" id="quoteNumber" value={quoteInput.quoteNumber} readOnly={true}/>
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
                            <textarea name="additionalInfo" id="additionalInfo" cols="60" rows="6" value={quoteInput.additonalInfo} onChange={handleChange} placeholder='Add additional information to receiver' className='textArea'></textarea>
                        </div>
                        <div className="amount">
                            <h3>Total: {sumTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
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

                        <h3 className='amount'>Grand Total: {sumTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
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

export default Quotation

