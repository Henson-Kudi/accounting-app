import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, Link, useHistory} from 'react-router-dom'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'
import DeleteBox from './DeleteBox'
import PurchaseReturnTemplate from './PurchaseReturnTemplate'

function PurchaseReturnDetails() {
    const history = useHistory()
    const {user} = useContext(UserContext)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const wrapperRef = useRef(null)
    const {returnNumber} = useParams()
    const [fetching, setFetching] = useState(false)
    const [deleteItem, setDeleteItem] = useState(false)

    const {data: returnData, loader} =useFetch(`purchaseReturns/${returnNumber}`, {})

    const handleStyling = () => {
        wrapperRef.current.classList.toggle('showOptions')
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e) {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(e.target)) {
            wrap.classList.remove('showOptions')
        }
    }


    const handleDelete = async ()=>{
        try {
            setFetching(true);
            const res = await baseURL.delete(`purchaseReturns/${returnNumber}`, {
                headers : {
                    'auth-token' : user?.token
                }
            })

            const {data} = await res
            setAlertMessage(data.message);
            setAlert(true);
            setTimeout(() =>{
                setAlert(false);
                setAlertMessage('')
                data.status === 200 && history.goBack()
            }, 3000)
        } catch (error) {
            console.log(error);
        }finally{
            setFetching(false)
        }
    }

    const handleUpdate = async ()=>{
        history.push(`/update-purchase-return/${returnNumber}`)
    }



    return (
        <div className='Invoices'>
            {
                !fetching && <div className="invoicesHeading invoicesHeadingCont">
                <h1>Return #{returnData?.input?.number}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                <button className="invoiceButton noMobile" onClick={()=>{
                    history.push('/purchase-return/new-purchase-return')
                }}>New Return</button>
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling}>More Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont">
                            <p className="option mobile" onClick={()=>{
                                history.push('/purchase-return/new-purchase-return')
                            }}>New Return</p>
                            <p className="option updateQuote" onClick={handleUpdate}>Update</p>
                            <p className="option deleteQuote" onClick={()=>{
                                setDeleteItem(true)
                            }}>Delete</p>
                        </div>
                    </div>
                </div>
            </div>
            }

            <PurchaseReturnTemplate
                data = {returnData}
            />

            
            {
                loader && <Loader/>
            }
            {
                fetching && <Loader/>
            }

            {
                deleteItem && <DeleteBox
                    handleDelete={handleDelete}
                    onClick={()=>{setDeleteItem(false)}}
                />
            }
            
            <Alert
                alert={alert}
                cancelAlert={()=>{setAlert(false)}}
                message={alertMessage}
            />
        </div>
    )
}

export default PurchaseReturnDetails
