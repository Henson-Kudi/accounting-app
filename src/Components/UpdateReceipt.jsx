import React, {useEffect, useState, useRef, useContext} from 'react'
import { useHistory, Link, useParams } from 'react-router-dom';
import './Quotation.css';
import './Invoice.css';
import {baseURL} from './axios'
import axios from 'axios'
import Loader from './Loader'
import Alert from './Alert';
import {UserContext} from './userContext'


function UpdateReceipt() {
    const {receiptNumber: receipt_id} = useParams()
    const history = useHistory()
    const {user} = useContext(UserContext)
    const [customers, setCustomers] = useState([])
    const [receipt, setReceipt] = useState({})
    const [products, setProducts] = useState([])
    const [loader, setLoader] = useState(false)

    const [active, setActive] = useState(false);
    const wrapperRef = useRef(null)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const [quoteInput, setQuoteInput] = useState({
        date : new Date(),
        dueDate: function(){
            const today = new Date(this.date);
            const futureDate = new Date(today.setDate(today.getDate()+ Number(this.terms)))
            return futureDate.toLocaleDateString();
        },
        
    });

    const [custName, setCustName] = useState('')

    const [productName, setProductName] = useState('')

    const changeProductName = (e)=>{
        setProductName(e.target.value)
    }

    const [addedProducts, setAddedProducts] = useState([{}])
    const [visibleAutoComplete, setVisibleAutoComplete] = useState(null)
    const [addProduct, setAddproduct] = useState(false)
    const autoRef = useRef()
    const [addedCharges, setAddedCharges] = useState(receipt?.otherCharges)

    useEffect(()=>{
        let source = axios.CancelToken.source();
        let unMounted = false;
        fetchReceipt(source, unMounted)

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const fetchReceipt = async(source, unMounted)=>{
        const custReq = baseURL.get('customers', {
            cancelToken: source.token,
            headers:{
                'auth-token': user?.token
            }
        })

        const prodReq = baseURL.get('products', {
            cancelToken: source.token,
            headers:{
                'auth-token': user?.token
            }
        })

        const receiptReq = baseURL.get(`receipts/${receipt_id}`, {
            cancelToken: source.token,
            headers:{
                'auth-token': user?.token
            }
        })

        try {
            setLoader(true)
            const res = await axios.all([custReq, prodReq, receiptReq])
            const [custRes, prodRes, receiptRes] = await res
            const receipt = await receiptRes.data
            const customers = await custRes.data.customers

            const addedProds = await receiptRes.data?.products

            const prods = await prodRes.data

            const identifiedCust = customers?.filter(cust => cust._id === receipt?.customer?._id && cust.id === receipt?.customer?.id && cust.number === receipt?.customer?.number)

            const addedProducts = addedProds?.map((product, index) => {
                const identical = prods.filter(item => item?._id === product._id && item.id === product.id && item?.number === product?.number)
                return {
                    ...identical[0],
                    qty : product.qty,
                    sellingPrice : product.up,
                    discountType : 'value',
                    discount : product?.discount?.amount,
                    vatRate : product?.vat?.rate,
                }
            })

            const custName = customers?.filter(cust => cust._id === receipt?.customer?._id && cust.id === receipt?.customer?.id && cust.number === receipt?.customer?.number).map(cust => cust?.displayName)

            setQuoteInput(prev => ({
                ...prev,
                date : receipt.input.date,
                invoiceHeading : receipt?.input?.heading,
                number : receipt?.input?.number,
                customer: identifiedCust[0],
                cashPayment : receipt?.input?.payments?.cash,
                bankPayment : receipt?.input?.payments?.bank,
                mobileMoneyPayment : receipt?.input?.payments?.mobileMoney
            }))

            setCustName(custName[0]);

            setAddedProducts(addedProducts)
            setAddedCharges(await receiptRes.data.otherCharges)

            setCustomers(await customers)
            setProducts(await prodRes.data)
            setReceipt(await receipt)
            
        } catch (error) {
            if (!unMounted) {
                if (axios.isCancel(error)) {
                console.log('Request Cancelled');
            }else{
                console.log('Something went wrong');
            }}
        }finally{
            setLoader(false)
        }
    }

    useEffect(() => {
        customers?.filter(cust => (
            cust.displayName === custName
        )).map(cust => (
            setQuoteInput(prev => ({
                ...prev,
                customer : cust
            }))
        ))
        
    }, [custName])

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
    
    const updateProducts = (item, index)=>{
        const oldProducts = [...addedProducts]

        if(oldProducts[index]){
            const newProducts = oldProducts.splice(index, 1, {
                ...item,
                qty : oldProducts[index].qty,
                discountType : oldProducts[index].discountType,
                discount : oldProducts[index].discount,
            })
            setAddedProducts(oldProducts)
            if(addedProducts.length === 10){
                return setAddproduct(addProduct)
            }
            setAddproduct(false)
        }else{
            setAddedProducts(prev => ([...prev, {
                ...item,
                qty : oldProducts[index].qty,
                discountType : oldProducts[index].discountType
            }]))
            if(addedProducts.length === 10){
                return setAddproduct(addProduct)
            }
            setAddproduct(false)
        }
    }

    const updateFieldChanged = (name, index) => (e) => {
        let newArr = addedProducts.map((item, i) => {
        if (index === i) {
            return { ...item, [name]: e.target.value };
        } else {
            return item;
        }
        });
        setAddedProducts(newArr);
    };

    const otherAdditionsChange = (name, index) => (event) => {
        let newArr = addedCharges.map((item, i) => {
        if (index === i) {
            return { ...item, [name]: event.target.value };
        } else {
            return item;
        }
        });
        setAddedCharges(newArr);
    };

    const showAddProductsList = (e, index)=>{
        e.target.parentElement.parentElement.parentElement.classList.add('activeToAddPro')
        setVisibleAutoComplete(index)
    }

    const removeAddProductClass = (e)=>{
        
        e.target.parentElement.parentElement.parentElement.parentElement.classList.remove('activeToAddPro')
        setVisibleAutoComplete(null)
    }

    const addNewProduct = ()=>{
        setAddedProducts(prev => ([...prev, {
            qty : '',
            discountType : '%'
        }]));
        setAddproduct(true)
    }

    const addNewCharge = ()=>{
        setAddedCharges(prev => ([...prev, {}]));
    }

    useEffect(() => {
        document.addEventListener('mousedown', handle_Click_Outside);

        return ()=>{
            document.removeEventListener('mousedown', handle_Click_Outside);
        }
    }, [])

    function handle_Click_Outside(e){
            const {current : wrap} = autoRef;
            if(wrap && !wrap.contains(e.target)){
                setVisibleAutoComplete(null)
            }
    }

    const grossAmount = addedProducts?.map(item => (
        item?.discountType === '%' ? Math.round(((Number(item?.qty) * Number(item?.sellingPrice)) - ((Number(item?.qty) * Number(item?.sellingPrice)) * (Number(item?.discount || 0)/100))) * (1 + (Number(item?.vatRate || 0)/100))) || 0 : Math.round(((Number(item?.qty) * Number(item?.sellingPrice)) - (Number(item?.discount || 0))) * (1 + (Number(item?.vatRate || 0)/100))) || 0)).reduce((acc, item) => (Number(acc) + Number(item)))

    const totalOtherCharges = addedCharges?.map(item => (Number(item.amount) || 0)).reduce((acc, item) => (Number(acc) + Number(item)), 0)

    const productsToSubmit = addedProducts?.filter(item => item.qty !== '' && item.name !== '' && item.name !== undefined && item.name !== null)

    const totalPayments = Number(quoteInput?.cashPayment) + Number(quoteInput?.bankPayment) + Number(quoteInput?.mobileMoneyPayment)

    
    const receiptData = {
        userID : user.userID,
        input : {
            ...quoteInput,
            receiptNumber : receipt?.input?.number,
            receiptId : receipt?.input?.id,
            dueDate : quoteInput?.dueDate()
        },
        products : productsToSubmit,
        charges : addedCharges?.filter(item => item.amount !== '0' && item.amount !== undefined && item.amount !== null && Number(item.amount) !== 0),
        grossAmount,
        netAmount : grossAmount + totalOtherCharges
    }

    const sendInvoice = async()=>{
        await baseURL.post(`/receipts/sendRecept/${receipt?.input?.number}`, {cutomerDetails : quoteInput.customer}, {
            headers : {
                'auth-token' : user?.token
            }
        }).then(res => {
            setAlertMessage(res.data.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 3000)
        });
    }

    const print = async()=>{
        window.alert('Saved Item and printed')
        // await baseURL.get(`/invoices/invoiceTemplates/${invoiceNumber}-${user.userID}`, {
        //     responseType: 'blob',
        //     headers : {
        //         'auth-token' : user?.token
        //     }
        // })
    }

    const submit = async()=>{
        if (!quoteInput?.customer?._id) {
            setAlertMessage('Please add a customer')
            setAlert(true)
            setTimeout(() => {
                setAlertMessage('')
                setAlert(false)
            }, 3000);
            return
        }

        if (productsToSubmit.length <= 0) {
            setAlertMessage('Please add at least one product')
            setAlert(true)
            setTimeout(() => {
                setAlertMessage('')
                setAlert(false)
            }, 3000);
            return
        }

        if (totalPayments !== (grossAmount + totalOtherCharges)) {
            setAlertMessage('Please total payments mustbe equal to net payable.')
            setAlert(true)
            setTimeout(() => {
                setAlertMessage('')
                setAlert(false)
            }, 3000);
            return
        }

        try {
            setLoader(true)
            await baseURL.put(`/receipts/${receipt_id}`, receiptData, {
                headers : {
                    'auth-token' : user?.token
                }
            }).then(async(res) =>{
                const {data} = await res
                setAlertMessage(data.message)
                setAlert(true)
                setTimeout(() => {
                    setAlert(false)
                    setAlertMessage('')
                    data.status === 200 && history.goBack()
                }, 2000);
                
            })
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }

    const handleSaveAndSend = async ()=>{
        await submit()
        await sendInvoice()
    }

    const handleSave = async ()=>{
        await submit()
    }


    // FUNCTION BELOW WOULD BE USE TO PREPARE REPORTS FOR *SALES BY CUSTOMER, SALES BY ITEM, CUSTOMERS DEBT, AND MORE
    

    // const SampleDivEleFunc = ()=>{
    //     const submit = addedProducts?.map(product => {
    //         const elements = productsToSubmit.filter(item => item._id === product._id)
    //         console.log(elements);
    //         const filteredSum = elements.map(el => el.qty).reduce((acc, ele) => Number(acc) + Number(ele), 0)
    //         return <div>
    //             <div style={{display: filteredSum > 0 ? 'block' : 'none'}}>
    //                 <span>{product.productName} </span>
    //                 <span> {filteredSum}</span>
    //             </div>
    //     </div>
    //     })
    //     return submit
    // }


    return (
        
        <div className="Quotations NewInvoice">
            <div className="addProductHeading">
                <h2>Update Receipt #{receipt?.input?.number}</h2>
                <div className="cancelButton" onClick={history.goBack}><i className="fas fa-times"></i></div>
            </div>
            <div className="formContainer">
                <form className='invoiceForm'>
                    <div className="invoiceFormTop">
                        <div className="date invoiceControl">
                            <label htmlFor="date">Date:</label>
                            <input type="date" name='date' value={quoteInput.date} id='date' className='invoiceSelectInput' onChange={handleChange} />
                        </div>
                        
                        <div className="invoiceNumber invoiceControl">
                            <span>
                                Receipt Number:
                            </span>
                            <span>
                                {quoteInput?.number}
                            </span>
                        </div>
                    </div>

                    <div ref={wrapperRef} className='customerName'>
                        <label htmlFor="customerName">Receiver: </label>
                        <input 
                            type="text"
                            value={custName} 
                            onChange={(e)=>{setCustName(e.target.value)}}
                            onClick={()=>{setActive(!active)}}
                            name='customerName'
                            className='autoListItemInput'
                            id='customerName'
                            placeholder='Select Customer'
                        />

                        {
                            active && 
                            <div className="autoCompleteContainer">
                                <button
                                    type="button"
                                    onClick={()=>{history.push('/customer/new-customer')}}
                                    className='addNewCust'
                                >
                                    Add New Customer
                                </button>
                                {
                                    customers?.filter(item => {
                                        if (!custName) return true
                                        if ((`${item?.designation} ${item?.firstName} ${item?.lastName}`)?.toLocaleLowerCase()?.includes(custName?.toLowerCase)) {
                                        return true
                                        }
                                    })
                                    .map((item, i) => (
                                        <div
                                            className='autoListItem'
                                            onClick={()=>{setCustName(item.displayName); setActive(false);}}
                                            key={i}
                                            tabIndex='0'
                                        >
                                            <p>{item.displayName}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>

                    {
                        quoteInput?.customer?.displayName && <div className="emailAndDetails">
                        <div className="customerEmail">
                            <p>Email: {quoteInput.customer?.email}</p>
                        </div>
                        <div className="addressInfoCont">
                            <div className="deliveryAdress">
                                <h4>Billing Address</h4>
                                <div className="addressInfo">
                                    <p>Country: {quoteInput.customer?.billingAddress?.country}</p>
                                    <p>City: {quoteInput.customer?.billingAddress?.city}</p>
                                    <p>Street: {quoteInput.customer?.billingAddress?.street}</p>
                                    <p>Tel: {quoteInput.customer?.billingAddress?.tel}</p>
                                    <p>Mobile: {quoteInput.customer?.billingAddress?.mobile}</p>
                                </div>
                            </div>
                            <div className="deliveryAdress">
                                <h4>Shiping Address</h4>
                                <div className="addressInfo">
                                    <p>Country: {quoteInput.customer?.shippingAddress?.country}</p>
                                    <p>City: {quoteInput.customer?.shippingAddress?.city}</p>
                                    <p>Street: {quoteInput.customer?.shippingAddress?.street}</p>
                                    <p>Tel: {quoteInput.customer?.shippingAddress?.tel}</p>
                                    <p>Mobile: {quoteInput.customer?.shippingAddress?.mobile}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                    <div className="addInvoiceHeading">
                        <input name="invoiceHeading" id="additionalInfo" value={quoteInput.invoiceHeading} onChange={handleChange} placeholder='Add receipt heading here' className='invoiceHeading' />

                        <h3 className='netAmount'>Net Payable: {(grossAmount + totalOtherCharges).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
                    </div>

                    <div className="invoiceAddProducts">
                        <table className='addProductsInvoiceTable' >
                            <thead className='addProductsInvoiceTableHead'>
                                <tr className='addProductRow addProductRowHead'>
                                    <th className='addProductData'>Product Name</th>
                                    <th
                                    className='invoiceAmountElem addProductData'>Quantity</th>
                                    <th
                                    className='invoiceAmountElem addProductData'>Unit Price</th>
                                    <th className='addProductData'>Discount</th>
                                    <th
                                    className='invoiceAmountElem addProductData'>VAT Rate</th>
                                    <th
                                    className='invoiceAmountElem addProductData'>Amount</th>
                                </tr>
                            </thead>

                            <tbody className='addProductsInvoiceTableBody'>
                                
                                {addedProducts?.map((data, index) => (
                                    addedProducts[index] && <tr key={index} className='notActiveToAddPro addProductRow'>
                                        <td className='addProductData'>
                                            <div className="addProductDataControl">
                                                <label
                                                    onClick={(e)=>{
                                                        showAddProductsList(e, index)
                                                    }}
                                                    className='addProductLabel'
                                                >
                                                    Product Name
                                                </label>
                                                <input
                                                    placeholder='Select Product'
                                                    type='text'
                                                    name="productName"
                                                    value={addedProducts[index]?.name}
                                                    onClick={(e)=>{
                                                        showAddProductsList(e, index)
                                                    }}
                                                    className='selectProduct invoiceAmountElem'
                                                />
                                            </div>
                                            {
                                                addedProducts[index]?.stockSummary?.closingStock && 
                                                <p className='availableProducts'>
                                                    <span>Available</span> <span>{`${addedProducts[index]?.stockSummary?.closingStock?.qty || 0} ${addedProducts[index]?.units || 'N/A'}`}</span>
                                                </p>
                                            }
                                        </td>

                                        <td className='addProductData'>
                                            <div className="addProductDataControl">
                                                <label
                                                    className='addProductLabel'
                                                >
                                                    Quantity
                                                </label>
                                                <input
                                                    placeholder='Enter Quantity'
                                                    className='invoiceAmountElem'
                                                    type="text"
                                                    name="qty"
                                                    value={addedProducts[index]?.qty}
                                                    onChange={(e)=>{
                                                        if(isNaN(e.target.value)){
                                                            window.alert('Please only numbers allowed in this cell')
                                                            e.target.value = ''
                                                            return
                                                        }
                                                        updateFieldChanged("qty", index)(e)
                                                    }}
                                                />
                                            </div>
                                        </td>

                                        <td className='addProductData'>
                                            <div className="addProductDataControl">
                                                <label
                                                    className='addProductLabel'
                                                >
                                                    Unit Price
                                                </label>
                                                <input
                                                    placeholder='Unit Price'
                                                    className='invoiceAmountElem'
                                                    type="text"
                                                    name="sellingPrice"
                                                    value={addedProducts[index]?.sellingPrice}
                                                    onChange={(e)=>{
                                                        if(isNaN(e.target.value)){
                                                            window.alert('Please only numbers allowed in this cell')
                                                            e.target.value = ''
                                                            return
                                                        }
                                                        updateFieldChanged("sellingPrice", index)(e)
                                                        
                                                    }}
                                                />
                                            </div>
                                        </td>
                                            

                                        <td className='addProductData'>
                                            <div className="addProductDataControl">
                                                <label
                                                    className='addProductLabel'
                                                >
                                                    Discount
                                                </label>
                                                <div className="addProductDiscount">
                                                    <input
                                                        placeholder={addedProducts[index]?.discountType === '%' ? 'Enter Discount Rate' : 'Enter Discount Value'}
                                                        type="text"
                                                        name="discount"
                                                        className='invoiceDiscountElem'
                                                        value={addedProducts[index]?.discount}
                                                        onChange={(e)=>{
                                                            if(isNaN(e.target.value)){
                                                                window.alert('Please only numbers allowed in this cell')
                                                                e.target.value = ''
                                                            }
                                                            if(addedProducts[index]?.discountType === '%'){
                                                                if(Number(e.target.value) > 100){
                                                                    window.alert('Discount rate cannot be more than 100')
                                                                    e.target.value = ''
                                                                    // return
                                                                }
                                                            }
                                                            updateFieldChanged("discount", index)(e)
                                                        }}
                                                    />
                                                    <select name="discountType"
                                                        className='selectDiscountType'
                                                        id="discountType"
                                                        value={addedProducts[index]?.discountType}
                                                        onChange={updateFieldChanged("discountType", index)}
                                                    >
                                                        <option value="%">%</option>
                                                        <option value="value">Value</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                        </td>

                                        <td className='addProductData addProductVAT'>
                                            <div className="addProductDataControl">
                                                <label
                                                    className='addProductLabel'
                                                >
                                                    VAT Rate
                                                </label>
                                                <input
                                                    placeholder='Enter VAT Rate'
                                                    style={{width : '100%'}}
                                                    className='invoiceAmountElem'
                                                    type="text"
                                                    name="vatRate"
                                                    value={addedProducts[index]?.vatRate}
                                                    onChange={(e)=>{
                                                        if(isNaN(e.target.value)){
                                                            window.alert('Please only numbers allowed in this cell')
                                                            e.target.value = ''
                                                            return
                                                        }
                                                        if(Number(e.target.value) > 100){
                                                            window.alert('VAT rate cannot be more than 100%')
                                                            e.target.value = ''
                                                            return
                                                        }
                                                        updateFieldChanged("vatRate", index)(e)
                                                    }}
                                                />
                                            </div>
                                            
                                        </td>

                                        <td className='addProductData addProductAmount'>
                                            <div className="addProductDataControl">
                                                <label
                                                    className='addProductLabel'
                                                >
                                                    Amount
                                                </label>
                                                <input
                                                    style={{width : '100%'}}
                                                    className='invoiceAmountElem'
                                                    type="number"
                                                    name="amount"
                                                    value={addedProducts[index]?.discountType === '%' ? Math.round(((Number(addedProducts[index]?.qty) * Number(addedProducts[index]?.sellingPrice)) - ((Number(addedProducts[index]?.qty) * Number(addedProducts[index]?.sellingPrice)) * (Number(addedProducts[index]?.discount || 0)/100))) * (1 + (Number(addedProducts[index]?.vatRate || 0)/100))) : Math.round(((Number(addedProducts[index]?.qty) * Number(addedProducts[index]?.sellingPrice)) - (Number(addedProducts[index]?.discount || 0))) * (1 + (Number(addedProducts[index]?.vatRate || 0)/100)))}
                                                    readOnly={true}
                                                />
                                            </div>
                                            
                                        </td>
                                        <td className={visibleAutoComplete === index ? "autoCompleteContainer visibleAutoComplete" : "autoCompleteContainer"} ref={autoRef}>
                                            <input
                                                type='text'
                                                name="productName"
                                                value={productName}
                                                onChange={changeProductName}
                                                placeholder='Search Product'
                                                className='searchProductInput'
                                            />
                                            <button
                                                type="button"
                                                className='addNewCust addNewProduct'
                                            >
                                                <Link to='/products/new-product'>Add New Product</Link>
                                            </button>
                                            <div className='productItemCont'>
                                                {
                                                products?.filter(item => {
                                                    if (!productName || productName === '') return true
                                                    if (item?.name?.toLowerCase().includes(productName?.toLowerCase())) {
                                                    return true
                                                }}).map((item, i) => (
                                                    <div
                                                        key={i}
                                                        tabIndex='0'
                                                        className='productItem'
                                                    >
                                                        <p
                                                            onClick={(e)=>{
                                                                updateProducts(item, index)
                                                                removeAddProductClass(e, null)
                                                            }}
                                                        >
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                ))
                                            }
                                            </div>
                                            
                                        </td>
                                    </tr>
                                ))}
                                <tr className='summation addProductData'>
                                    <td>
                                        <button
                                        onClick={addNewProduct}
                                        type="button" className='addRows btn'
                                        disabled={addProduct}
                                    >
                                        Add Row
                                    </button>
                                    </td>

                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className='grossAmount'>Gross Amount:</td>
                                    <td className='grossAmount invoiceAmountElem'>{grossAmount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>

                                    
                                </tr>

                                <tr className='summation addProductData'>
                                    <td>
                                    </td>

                                    <td></td>
                                    <td></td>
                                    <td className='otherChargesHead'>Other Charges <p className='chargedTo'>Charged to other income</p></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                {
                                    addedCharges?.map((item, i) => (
                                        addedCharges[i] && <tr className='otherCharges'>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td className='otherChargeData'>
                                                <input type="text" name='name' value={addedCharges[i]?.name} onChange={otherAdditionsChange('name', i)} className='otherChargeInput' />
                                            </td>
                                            <td className='otherChargeData otherChargeInputAmountCont'>
                                                <input type="text" value={addedCharges[i]?.amount} onChange={(e)=>{
                                                    if(isNaN(e.target.value)){
                                                        window.alert('Please only numbers allowed in this cell');
                                                        e.target.value = ''
                                                        return
                                                    }
                                                    otherAdditionsChange('amount', i)(e)
                                                }} name='amount' className='otherChargeInputAmount' />
                                            </td>
                                            <td></td>
                                        </tr>
                                    ))
                                }
                                <tr className='addMoreChargesCont'>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className='addMoreCharges'>
                                        <button onClick={addNewCharge} type="button" className='addRows btn'>Add More</button>
                                    </td>
                                    <td>Total</td>
                                    <td className='totalCharges'>{totalOtherCharges?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>

                                <tr className='netAmountCont'>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td>Net Payable</td>
                                    <td ></td>
                                    <td className='netAmount'>{(grossAmount + totalOtherCharges).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>

                                <tr className='notActiveToAddPro addProductRow'>
                                    <td className='addProductData'>
                                        <div className='addProductDataControl'>
                                            <label className='addProductLabel'>Cash</label>
                                            <input type='text' className='invoiceAmountElem' id='cash' name='cashPayment' value={quoteInput?.cashPayment} placeholder='Enter Cash Payment' onChange={(e)=>{
                                                if(isNaN(e.target.value)){
                                                    window.alert('Please only numbers allowed in this cell')
                                                    e.target.value = ''
                                                    return
                                                }
                                                handleChange(e)
                                            }} />
                                        </div>
                                    </td>
                                    <td className='addProductData'>
                                        <div className='addProductDataControl'>
                                            <label className='addProductLabel'>Bank</label>
                                            <input type='text' className='invoiceAmountElem' id='bank' name='bankPayment' value={quoteInput?.bankPayment} placeholder='Enter Bank Payment' onChange={(e)=>{
                                                if(isNaN(e.target.value)){
                                                    window.alert('Please only numbers allowed in this cell')
                                                    e.target.value = ''
                                                    return
                                                }
                                                handleChange(e)
                                            }} />
                                        </div>
                                    </td>
                                    <td className='addProductData'>
                                        <div className='addProductDataControl'>
                                            <label className='addProductLabel'>Mobile Money</label>
                                            <input type='text' className='invoiceAmountElem' id='mobileMoney' name='mobileMoneyPayment' value={quoteInput?.mobileMoneyPayment} placeholder='Enter MoMo Payment' onChange={(e)=>{
                                                if(isNaN(e.target.value)){
                                                    window.alert('Please only numbers allowed in this cell')
                                                    e.target.value = ''
                                                    return
                                                }
                                                handleChange(e)
                                            }} />
                                        </div>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td className='checTotals'>
                                        {
                                            totalPayments === (grossAmount + totalOtherCharges) ? <i className="fas fa-check-circle"></i> : <p className="notCorrect">
                                                <span className="notCorrectText">Please Ensure total payments equals net payable</span>
                                                <i className="fas fa-times-circle"></i>
                                            </p>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        
                        
                        </table>
                    </div>
                    <div className="saveOptions" style={{
                        display : 'flex',
                        justifyContent : 'flex-end'
                    }}>
                        <button
                            onClick={history.goBack}
                            type="button" className='saveOption btn'>
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            type="button" className='saveOption btn'>
                            Update
                        </button>
                        <button
                            onClick={handleSaveAndSend}
                            type="button" className='saveOption btn'>
                            Update & Send
                        </button>
                    </div>
                </form>

            </div>
            {
                loader && <Loader />
            }
                <Alert
                    alert={alert}
                    cancelAlert={()=>{setAlert(false)}}
                    message={alertMessage}
                />
        </div>
    )
}

export default UpdateReceipt

