import React, { useState, useEffect, useRef, useContext } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import {baseURL} from './axios'
import Loader from './Loader'
import './Liability.css'
import NewLongtermLiability from './NewLongtermLiability'
import Alert from './Alert'
import ConfirmMessageBox from './ConfirmMessageBox'
import { UserContext } from './userContext'

function Liability() {
    const [fetching, setfetching] = useState(true)
    const [data, setData] = useState([])
    const [newLiability, setNewLiability] = useState(false)
    const [redeemLiability, setRedeemLiability] =  useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [redeemMeansOfPayment, setRedeemMeansOfPayment] = useState('')
    const [redeemData, setRedeemData] = useState({})
    const wrapperRef = useRef(null)
    const {user} = useContext(UserContext)

    const {serialNumber} = useParams()

    const fetchAssets = async(unMounted, source)=>{
            await baseURL.get(`/longtermLiabilities/${serialNumber}`, {
                cancelToken: source.token,
                headers:{
                    'auth-token': user?.token
                }
            })
            .then(res => {
                setData(res.data)
                setfetching(false)
            })
            .catch(err => {
                if (!unMounted) {
                    if (axios.isCancel(err)) {
                        console.log('Request Cancelled');
                    } else {
                        console.log('Something went wrong');
                    }
                }
            })
        }

    useEffect(()=>{
        let unMounted = false;
        let source = axios.CancelToken.source();
        fetchAssets(unMounted, source)
    return () => {
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])
    
    const today = new Date()
    const thisYear = today.getFullYear()
    const thisMonth = today.getMonth()
    const months = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];

    let amortizationInfos = []

    data.amortizationData?.forEach(item => {
        const element = item.data;
        amortizationInfos = element

    })

    const ov = data.liabilityDetail?.map(item => item.amount).reduce((a, b) => a + b, 0)

    const balanceAtEndofPeriod = amortizationInfos.filter(item => item.month === months[thisMonth] && item.year === thisYear).map(item => item.balanceAtEnd).reduce((a, b) => a + b, 0);

    const redeemSubmitData = {
        userID : user.userID,
        ...redeemData,
        meansOfPayment : redeemMeansOfPayment
    }

    const handleRedeemLiability = async()=>{
        if (redeemMeansOfPayment === '') {
            setAlertMessage('Please Select means of payment')
            setAlert(true)
            setTimeout(()=>{
                setAlertMessage('')
                setAlert(false)
            }, 3000)
        }
        else{
            await baseURL.post('/longtermLiabilities/redeemLiability', redeemSubmitData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            .then(async(res) =>{
                const response = await res.data
                setRedeemLiability(false)
                setAlertMessage(response.message)
                setAlert(true)
                setTimeout(()=>{
                    setAlertMessage('')
                    setAlert(false)
                }, 3000)
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
            setRedeemLiability(false);
        }
    }

    return (
        <div className='Liability Invoices'>
        <div className="invoicesHeading">
                    <h1>Liability #{serialNumber}</h1>
                    <button className="invoiceButton" onClick={()=>{setNewLiability(true)}}>New Liability</button>
            </div>
            <div className="profilesDetails">
                {
                    data.liabilityDetail?.map(element => (
                        <div className="profileDetails" key={element._id}>
                            <div className="leftDetails">
                                <p><b>Identification Number:</b> <span>{element.serialNumber}</span></p>
                                <p><b>Source:</b> <span>{element.name}</span></p>
                                <p><b>Liability Name:</b> <span>{element.liabilityName}</span></p>
                                <p><b>Value:</b> <span>{(element.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                <p><b>Duration(Years):</b> <span>{element.duration}</span></p>
                            </div>
                            <div className="rightDetails">
                                <p><b>Duration(Months):</b> <span>{element.duration * 12}</span></p>
                                <p><b>Interest Rate:</b> <span>{element.interestRate}</span>%</p>
                                <p><b>Yearly Interest <small>(Interest after every 12months): </small></b><span>{((element.amount * element.interestRate/100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                <p><b>Monthly Interest:</b> <span>{(((element.amount * element.interestRate)/(100 * 12)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                <p><b>Balance as date:</b> <span>{((balanceAtEndofPeriod).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                            </div>
                        </div>
                    ))
                }

                <div className='amortizationTable'>
                    {
                        !fetching &&
                        <h3>Repayment Schedule</h3>
                    }
                    <table>
                    {
                        !fetching &&
                        <thead>
                            <tr>
                                <th className='amortization'>Period</th>
                                <th className='amortization'>Debt At Start</th>
                                <th className='amortization'>Interest</th>
                                <th className='amortization'>Constant Amortization</th>
                                <th className='amortization'>Annuity</th>
                                <th className='amortization'>Balance Owing At End</th>
                            </tr>
                        </thead>
                    }
                        <tbody>
                            {
                                amortizationInfos.map((item, index) => (
                                    <tr className={months[thisMonth] == item.month && thisYear === item.year ? 'selected' : 'notSelected'} key={item._id}
                                    >
                                        <td className='amortization'>{`${item.month} ${item.year}`}</td>
                                        <td className='amortization'>{(ov - (item.constantMonthlyAmortization * index)).toFixed(2)}</td>
                                        <td className='amortization'>{item.interest}</td>
                                        <td className='amortization'>{item.constantMonthlyAmortization}</td>
                                        <td className='amortization'>{item.annuity}</td>
                                        <td className='amortization'>{item.balanceAtEnd}</td>
                                        {months[thisMonth] === item.month && thisYear === item.year ? <td className='redeemLiab' onClick={()=>{
                                            setRedeemData({
                                                ...item,
                                                holderNumber: data.liabilityDetail[0].serialNumber,
                                                liabilityName: data.liabilityDetail[0].liabilityName,
                                                institute: data.liabilityDetail[0].name
                                            })
                                        setRedeemLiability(true)
                                        }}>Redeem</td> : null}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {
                fetching &&
                <Loader />
            }
            {
                newLiability &&
                <NewLongtermLiability
                    onClick={()=>{
                        setNewLiability(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Liability Added Successfully')
                        setAlert(true)
                        setTimeout(() => {
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000);
                    }}
                />
            }
            {
                redeemLiability &&
                <div ref={wrapperRef}>
                    <ConfirmMessageBox
                    message = {<select type='text' value={redeemMeansOfPayment} name='redeemMeansOfPayment' onChange={(e )=>{setRedeemMeansOfPayment(e.target.value)}} style={{ border: '1px solid black'}}>
                        <option value="">Select Means of Payment</option>
                        <option value="cash">Cash</option>
                        <option value="bank">Bank</option>
                        <option value="mobileMoney">Mobile Money</option>
                    </select>}
                    submit = {handleRedeemLiability}
                />
                </div>
            }
            <Alert
                alert={alert}
                cancelAlert={()=>{setAlert(false)}}
                message={alertMessage}
            />
        </div>
    )
}

export default Liability
