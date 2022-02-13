import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {saveAs} from 'file-saver'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'
import CreditNoteTemplate from './CreditNoteTemplate'
import DeleteBox from './DeleteBox'

function CreditNoteDetails() {
    const history = useHistory()
    const {user} = useContext(UserContext)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const wrapperRef = useRef(null)
    const {noteNumber} = useParams()
    const [deleteItem, setDeleteItem] = useState(false)

    const {data: noteData, loader, setLoader} =useFetch(`creditNotes/${noteNumber}`, {})
    const {data:customerData} = useFetch('customers', {})
    const {data:products} = useFetch('products', [])

    const customers = customerData?.customers


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

    const cust = customers?.filter(cust => cust._id ===noteData?.customer?._id && cust.id ===noteData?.customer?.id && cust.number ===noteData?.customer?.number) ?? []

    const printData = {
        image : user?.logoURL,
        userName : user?.companyName,
        userAddress : user?.country,
        userEmail : user?.userEmail,
        noteNumber : noteData?.input?.number,
        date : new Date(noteData?.input?.date)?.toLocaleDateString(),
        dueDate : noteData?.input?.dueDate,
        selectInvoiceTerm : noteData?.input?.terms,
        customerName : cust[0]?.displayName,
        companyName : cust[0]?.companyName,
        email : cust[0]?.email,
        customerAddress : cust[0]?.billingAddress?.address,
        city : cust[0]?.billingAddress?.city,
        tel : cust[0]?.billingAddress?.tel,
        products : noteData?.products?.map(pdt => {
            const prdt = products?.filter(product => product._id === pdt._id)
            return {
                ...pdt,
                name : prdt[0]?.name,
                amount : (Number(pdt?.qty) * Number(pdt?.up) - Number(pdt?.discount?.amount) + Number(pdt?.vat?.amount))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                discount : {
                    rate : pdt?.discount?.rate,
                    amount : Number(pdt?.discount?.amount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                },
                vat : {
                    rate : pdt?.vat?.rate,
                    amount : Number(pdt?.vat?.amount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                },
                sellingPrice : Number(pdt?.up)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        }),
        totalDiscount : (noteData?.products?.map(pdt => Number(pdt?.discount?.amount))?.reduce((acc, pdt) => Number(acc) + Number(pdt), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        totalVat : (noteData?.products?.map(pdt => Number(pdt?.vat?.amount))?.reduce((acc, pdt) => Number(acc) + Number(pdt), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        grossAmount : (noteData?.products?.map(pdt => (Number(pdt?.qty) * Number(pdt?.up)) + Number(pdt?.vat?.amount) - Number(pdt?.discount?.amount))?.reduce((a, b) => a + b, 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        additions : noteData?.otherCharges?.map(item => ({
            ...item,
            amount : Number(item.amount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        })),
        totalOtherAdditions : (noteData?.otherCharges?.map(item => Number(item.amount))?.reduce((acc, item) => Number(acc) + Number(item), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        netPayable : Number(noteData?.netPayable)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    }


    const handlePrint = async()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.post(`/creditNotes/noteTemplates/${noteNumber}`, printData, {
                responseType: 'blob',
                headers: {
                    'auth-token' : user?.token
                }
            })
            
            const pdfBlob = new Blob([data], {type:'application/pdf'})

            const pdfUrl = await URL.createObjectURL(pdfBlob)

            print({
                printable : pdfUrl,
                type: 'pdf',
                documentTitle: '@HK Solutions',
            })
        } catch (error) {
            setAlertMessage('File not found. Maybe file has been deleted.')
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
            }, 3000)
        }finally {
            setLoader(false)
        }
    }


    const handleExportPDF = async ()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.post(`creditNotes/noteTemplates/${noteNumber}`, printData, {
                responseType: 'blob',
                headers : {
                    'auth-token' : user?.token
                }
            })

            const pdfBlob = new Blob([data], {type:'application/pdf'})
            saveAs(pdfBlob, `credit-note-number${noteData?.input?.number}`)
        } catch (error) {
            setAlertMessage('File not found. Maybe file has been deleted.')
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
            }, 3000)
        }finally{
            setLoader(false)
        }
    }

    const handleSendCreditNote = async ()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.post(`/creditNotes/sendCreditNote/${noteNumber}`, printData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(()=>{
                setAlertMessage('')
                setAlert(false)
            },3000)
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }

    const handleDelete = async ()=>{
        try {
            setLoader(true);
            const {data} = await baseURL.delete(`creditNotes/${noteNumber}`, {
                headers : {
                    'auth-token' : user?.token
                }
            })

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
            setLoader(false)
        }
    }

    const handleUpdate = async ()=>{
        history.push(`/update-credit-note/${noteNumber}`)
    }



    return (
        <div className='Invoices'>
            <div className="invoicesHeading invoicesHeadingCont">
                <h1>Return #{noteData?.input?.number}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                <button className="invoiceButton noMobile" onClick={()=>{
                    history.push('/credit-note/new-credit-note')
                }}>New Return</button>
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling}>More Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont">
                            <p className="option mobile" onClick={()=>{
                                history.push('/credit-note/new-credit-note')
                            }}>New Return</p>
                            <p className="option" onClick={handlePrint}>Print Credit Note</p>
                            <p className="option" onClick={handleExportPDF}>Export PDF</p>
                            <p className="option" onClick={handleSendCreditNote}>Resend</p>
                            <p className="option updateQuote" onClick={handleUpdate}>Update</p>
                            <p className="option deleteQuote" onClick={()=>{
                                setDeleteItem(true)
                            }}>Delete</p>
                        </div>
                    </div>
                </div>
            </div>

            <CreditNoteTemplate
                data = {noteData}
            />

            
            {
                loader && <Loader/>
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

export default CreditNoteDetails
