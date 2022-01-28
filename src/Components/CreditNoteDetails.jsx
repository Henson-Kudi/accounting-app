import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {saveAs} from 'file-saver'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from './userContext'
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

    const [styler, setStyler] = useState({
        transform: 'translateY(-5rem)',
        visibility: 'hidden'
    })

    const styles = {
        width: '100%',
        position: 'absolute',
        color: 'gray',
        fontWeight: '550',
        padding: '1rem',
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        transform : styler.transform,
        visibility : styler.visibility,
        transition: 'transform 0.5s ease',
    }

    const handleStyling = ()=>{
        styler.visibility === 'hidden' ? setStyler({transform: 'translateY(0)', visibility: 'visible'}) : setStyler({transform: 'translateY(-5rem)', visibility: 'hidden'})
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e){
        const {current : wrap} = wrapperRef;
        if(wrap && !wrap.contains(e.target)){
            setStyler({transform: 'translateY(-5rem)', visibility: 'hidden'})
        }
    }


    const handlePrint = async()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.get(`/creditNotes/noteTemplates/${noteNumber}`, {
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
            const {data} = await baseURL.get(`creditNotes/noteTemplates/${noteNumber}`, {
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
            const {data} = await baseURL.post(`/creditNotes/sendCreditNote/${noteNumber}`, noteData, {
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
                        <div className="moreOptionsCont" style={{...styles}}>
                            <p className="option" onClick={()=>{
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
