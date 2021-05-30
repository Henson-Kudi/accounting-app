import React, {useEffect, useState, useRef}  from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { baseURL } from './axios'
import './InventoriesPage.css'
import Loader from './Loader'
import AddProductForm from './AddProductForm'
import Invoice from './Invoice'
import Receipt from './Receipt'
import PurchaseInvoice from './PurchaseInvoice'
import UpdateProductForm from './UpdateProduct'
import DeleteBox from './DeleteBox'

function InventoriesPage() {

    const [fetching, setfetching] = useState(true)
    const [newProduct, setNewProduct] = useState(false)
    const [updateProduct, setUpdateProduct] = useState(false)
    const [transactionOptions, setTransactionOptions] = useState(false)
    const [invoice, setInvoice] = useState(false)
    const [receipt, setReceipt] = useState(false)
    const [purchaseInvoice, setPurchaseInvoice] = useState(false)
    const [deleteBox, setDeleteBox] = useState(false)

    const [products, setProducts] = useState([])
    const [entriesAndExits, setEntriesAndExits] = useState([])
    const [updateProductData, setUpdateProductData] = useState({
        productName: '',
        description: ''
    })

    const wrapperRef = useRef(null)
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e) {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(e.target)) {
            setTransactionOptions(false);
        }
    }

    useEffect(async() => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        const request1 = baseURL.get('/products')
        const request2 = baseURL.get('/entriesAndExits')
        await axios.all([request1, request2], {
            cancelToken: source.token
        })
        .then(res => {
            const [result1, result2] = res
            setProducts(result1.data)
            setEntriesAndExits(result2.data)
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

    // CODE BELOW SHOULD BE COPIED TO INVENTORY PAGE IN ORDER TO SHOW FREQUENTLY BOUGHT ITEMS
    const exits = entriesAndExits.filter(a => a.exitOrEntry === 'exit').map(a => a.productName)

    const entries = entriesAndExits.filter(a => a.exitOrEntry === 'entry').map(a => a.productName)

    var frequentlySold = exits;
    var s = frequentlySold.reduce(function(m,v){
    m[v] = (m[v]||0)+1; return m;
    }, {}); // builds {2: 4, 4: 2, 6: 3} 
    var mostSold = [];
    for (let k in s) mostSold.push({k:k,n:s[k]});
    // now we have [{"k":"2","n":4},{"k":"4","n":2},{"k":"6","n":3}] 
    mostSold.sort(function(a,b){ return b.n-a.n });
    const mostSoldElements = mostSold.map(function(a) { return a.k }).slice(0,5);

    var frequentlyBought = entries;
    var s = frequentlyBought.reduce(function(m,v){
    m[v] = (m[v]||0)+1; return m;
    }, {}); // builds {2: 4, 4: 2, 6: 3} 
    var mostBought = [];
    for (let k in s) mostBought.push({k:k,n:s[k]});
    // now we have [{"k":"2","n":4},{"k":"4","n":2},{"k":"6","n":3}] 
    mostBought.sort(function(a,b){ return b.n-a.n });
    const mostBoughtElements = mostBought.map(function(a) { return a.k }).slice(0,5);

    const showUpdateProduct = (item)=>{
        setUpdateProductData(item)
        setUpdateProduct(true)
    }

    const showDeleteBox = (item)=>{
        setUpdateProductData(item)
        setDeleteBox(true)
    }

    const handleDeleteItem = async()=>{
        await baseURL.put('/deleteProduct', updateProductData)
        .then(res => setProducts(res.data))
    }


    const handleProductUpdate = (e) => {
        const {name, value} = e.target
        setUpdateProductData(prevValue =>{
            return {
                ...prevValue,
                [name] : value,
            }
        })
    }

    const handleProductSubmit  = async ()=>{
        await baseURL.put('/product', updateProductData)
        .then(res => setProducts(res.data))
        setUpdateProduct(false)
    }



    return (
        <div className='InventoryPage'>
            <div className="salesTop">
                <div className='salesOptionsLeft'>
                    <Link to='/' className='button'>Home</Link>
                    <div className='salesTransactions' ref={wrapperRef}>
                        <button onClick={() => { setTransactionOptions(!transactionOptions) }} className='button'>New Transaction <i className="fas fa-angle-down"></i></button>
                        {
                            transactionOptions &&
                            <ul className='transactionOptions' style={{ backgroundColor: 'rgba(211, 211, 211,0.5)' }}>
                                <li className='transactionOption' onClick={() => { setNewProduct(true) }}>New Product</li>
                                <li className='transactionOption' onClick={() => { setInvoice(true) }}>Invoice</li>
                                <li className='transactionOption' onClick={() => { setReceipt(true) }}>Receipt</li>
                                <li className='transactionOption' onClick={() => { setPurchaseInvoice(true) }}>Purchase Invoice</li>

                            </ul>
                        }
                    </div>
                </div>
                <h3>Inventories Dashboard</h3>

                <div className="salesOptionsRight">
                    <button className='button' onClick={() => {
                        window.print()
                    }}>Print Page</button>
                </div>
            </div>

            <div className="mostSoldAndMostBought">
                <div className="mostSold">
                <h3>Most Sold Products</h3>
                    <ul>
                        {
                                mostSoldElements.map(a =>(
                                    <li className='inventoryItem'>
                                        <Link to={`/inventories/${a}`} className='link'>{a}</Link>
                                    </li>
                                ))
                        }
                    </ul>
                </div>

                <div className="mostSold">
                <h3>Most Purchased Products</h3>
                    <ul>
                        {
                                mostBoughtElements.map(a =>(
                                    <li className='inventoryItem'>
                                        <Link to={`/inventories/${a}`} className='link'>{a}</Link>
                                    </li>
                                ))
                        }
                    </ul>
                </div>
            </div>

            <div className="products">
            <ul className='inventoryListHead productListTitle'>
                <li className='inventoryItem'>Product Name</li>
                <li className='inventoryItem'>Description</li>
                <li className='inventoryItem'></li>
            </ul>
                <div>
                    {
                        products?.map(pdt => (
                            <ul className='inventoryList'>
                                <li className='inventoryItem'>
                                    <Link to={`/inventories/${pdt.productName}`} className='link'>{pdt.productName}</Link>
                                </li>

                                <li className='inventoryItem'>{pdt.description}</li>

                                <li className='inventoryItem upDateOptions'>
                                    <i className="fas fa-pen" onClick={()=>{
                                        showUpdateProduct(pdt)
                                    }}></i>
                                    <i className="fas fa-trash" onClick={()=>{
                                        showDeleteBox(pdt)
                                    }}></i>
                                </li>

                            </ul>
                        ))
                    }
                </div>
            </div>


            {
                fetching &&
                <Loader/>
            }
            {
                newProduct &&
                <AddProductForm
                    onClick={()=>{setNewProduct(false)}}
                />
            }
            {
                invoice &&
                <Invoice
                    onClick={() => {setInvoice(false)}}
                />
            }
            {
                receipt &&
                <Receipt
                    onClick={() => {setReceipt(false)}}
                />
            }
            {
                purchaseInvoice &&
                <PurchaseInvoice
                onClick={() => {setPurchaseInvoice(false)}}
                />
            }

            {
                updateProduct &&
                <UpdateProductForm
                    onClick={()=>{setUpdateProduct(false)}}
                    productName={updateProductData.productName}
                    description={updateProductData.description}
                    sellingPrice={updateProductData.sellingPrice}
                    handleProductSubmit={handleProductSubmit}
                    handleUpdate={handleProductUpdate}
                />
            }

            {
                deleteBox &&
                <DeleteBox
                    onClick={()=>{setDeleteBox(false)}}
                    handleDelete={()=>{
                        handleDeleteItem()
                    }}
                />
            }
        </div>
    )
}

export default InventoriesPage
