import React, {useState, useRef, useEffect, useContext} from 'react'
import Alert from './Alert';
import { baseURL } from './axios';
import './NewLongtermLiability.css';
import { UserContext } from './userContext';

function NewLongtermLiability({onClick, refetch}) {
    const {user} = useContext(UserContext)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const wrapperRef = useRef(null)
    const [liability, setLiability] = useState({
        date: new Date().toDateString(),
        name: '',
        liabilityName: '',
        serialNumber: (liability)=>{
            const date = new Date().valueOf();
            const liabilityInitials = liability.match(/\b(\w)/g).join('').toUpperCase()

            return liabilityInitials.concat(date.toString())
        },
        amount: '',
        duration: '',
        interestRate: '',
        receivedBy: 'cash'
    })

    const handleChange = (e)=>{
        const {name, value} = e.target;

        setLiability(prevValues => (
            {
                ...prevValues,
                [name] : value
            }
        ))
    }

    const submitData = {
        userID : user.userID,
        date: liability.date,
        name: liability.name,
        liabilityName : liability.liabilityName,
        serialNumber: liability.liabilityName !== '' ? liability.serialNumber(liability.liabilityName) : '',
        amount: liability.amount !== '' ? Number(liability.amount) : 0,
        duration: liability.duration !== '' ? Number(liability.duration) : 0,
        interestRate: liability.interestRate !== '' ? Number(liability.interestRate) : 0,
        receivedBy: liability.receivedBy
    }


    const handleSubmit = async()=>{
        if (liability.name === '' || liability.amount === '' || liability.duration === '' || liability.interestRate === '') {
            setAlertMessage('please fill all required fields')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
        }else{
            await baseURL.post('/longtermLiabilities', submitData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            .then(res =>{
                onClick()
                refetch()
            })
        }
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
            onClick()
        }
    }



    return (
        <div className='NewLiability' ref={wrapperRef}>
        <h3>New Long Term Liability</h3>
            <div className="liabilityFormContainer">
                <div className="date optionItem">
                    <label htmlFor="date">Date</label>
                    <input type="text" name="date" value={liability.date} readOnly={true} />
                </div>
                <div className="individual optionItem">
                    <label htmlFor="name">From:</label>
                    <input type="text" name="name" value={liability.name} onChange={handleChange} placeholder='Institution or individual' />
                </div>
                <div className="name optionItem">
                    <label htmlFor="liabilityName">Name</label>
                    <input type="text" name="liabilityName" value={liability.liabilityName} onChange={handleChange} placeholder='Liability Name'/>
                </div>
                <div className="serialNumber optionItem">
                    <label htmlFor="serialNumber">Serial Number</label>
                    <input type="text" name="serialNumber" value={liability.liabilityName !== '' ? liability.serialNumber(liability.liabilityName) : ''} readOnly={true} />
                </div>
                <div className="duration optionItem">
                    <label htmlFor="duration">Duration (years)</label>
                    <input type="number" name="duration" value={liability.duration} onChange={handleChange} placeholder='Duration in years' />
                </div>
                <div className="interestRate optionItem">
                    <label htmlFor="interestRate">Interest Rate(%)</label>
                    <input type="number" name="interestRate" value={liability.interestRate} onChange={handleChange} placeholder='Yearly interest rate' />
                </div>
                <div className="amounts optionItem">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" name="amount" value={liability.amount} onChange={handleChange} placeholder='Liability value' />
                </div>
                <div className="receivedBy optionItem">
                    <label htmlFor="receivedBy">Received By</label>
                    <select type="text" name="receivedBy" value={liability.receivedBy} onChange={handleChange} >
                        <option value="cash">Cash</option>
                        <option value="bank">Bank</option>
                        <option value="mobileMoney">Mobile Money</option>
                    </select>
                </div>
                
            </div>
            <div className="liabilityButtons">
                <button className="btn" onClick={onClick}>Cancel</button>
                <button className="btn" onClick={handleSubmit}>Save</button>
            </div>
            <Alert
                message={alertMessage}
                cancelAlert={()=>{setAlert(false)}}
                alert={alert}
            />
        </div>
    )
}

export default NewLongtermLiability
