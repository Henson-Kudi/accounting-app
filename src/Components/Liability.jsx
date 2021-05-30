import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import {baseURL} from './axios'
import Loader from './Loader'
import './Liability.css'

function Liability() {
    const [fetching, setfetching] = useState(true)
    const [data, setData] = useState([])
    const {serialNumber} = useParams()

    const fetchAssets = async(unMounted, source)=>{
            await baseURL.get(`/longtermLiability/${serialNumber}`, {
                cancelToken: source.token
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


    return (
        <div className='Liability'>
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
                                    <tr className={months[thisMonth] == item.month && thisYear === item.year ? 'selected' : 'notSelected'} key={item._id}>
                                        <td className='amortization'>{`${item.month} ${item.year}`}</td>
                                        <td className='amortization'>{(ov - (item.constantMonthlyAmortization * index)).toFixed(2)}</td>
                                        <td className='amortization'>{item.interest}</td>
                                        <td className='amortization'>{item.constantMonthlyAmortization}</td>
                                        <td className='amortization'>{item.annuity}</td>
                                        <td className='amortization'>{item.balanceAtEnd}</td>
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
        </div>
    )
}

export default Liability
