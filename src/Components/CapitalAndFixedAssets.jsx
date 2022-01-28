import React, {useState, useEffect, useRef, useContext} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'
import axios from 'axios'
import {baseURL} from './axios'
import NewFixedAsset from './NewFixedAsset'
import './CapitalAndFixedAssets.css'
import Loader from './Loader'
import NewShareholder from './NewShareholder'
import NewLongtermLiability from './NewLongtermLiability'
import queryString from 'query-string'
import Alert from './Alert'
import IncreaseCapital from './IncreaseCapital'
import ReduceCapital from './ReduceCapital'
import {UserContext} from './userContext'
import useHandleChange from '../customHooks/useHandleChange'
import useFetch from '../customHooks/useFetch'

function CapitalAndFixedAssets() {
    const [newAsset, setNewAsset] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [newLongtermLiability, setNewLongtermLiability] = useState(false)
    const [capitalInc, setCapitalInc] = useState(false)
    const [newShareholder, setNewShareholder] = useState(false)
    const [viewLiab, setViewLiab] = useState(false)
    const [reduceCap, setReduceCap] = useState(false)

    const {data: assets, loader: fetching} = useFetch('fixedAssets')

    const {data: shareholders} = useFetch('shareholders')

    const {data: liabilities} = useFetch('longtermLiabilities')

    const {change: reduceCapInput, handleChange : handleReduceCapChange} = useHandleChange({
        meansOfPayment: '',
        amountToPay: ''
    })

    const [requiredData, setRequiredData] = useState({})
    const [holderData, setHolderData] = useState({})

    const history = useHistory()
    const {search} = useLocation()
    const query = queryString.parse(search)

    const {user} = useContext(UserContext)

    const today = new Date()
    const thisYear = today.getFullYear()
    const thisMonth = today.getMonth()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',]


    let depInfos = []
    assets?.forEach(asset => {
        const element = asset.depInfos

        element.forEach(item => {
            if (item.year === thisYear) {
                depInfos.push(item)
            }
        })
        
    })
    const wrapperRef = useRef(null)

    useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);

            return ()=>{
                document.removeEventListener('mousedown', handleClickOutside);
            }
        }, [])

    function handleClickOutside(e){
        const {current : wrap} = wrapperRef;
        if(wrap && !wrap.contains(e.target)){
            setReduceCap(false);
        }
    }

    const serialNumbers = assets?.map(item => item.asset.serialNumber)

    const wrapper_Ref = useRef(null)

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
            document.addEventListener('mousedown', handle_Click_Outside);

            return ()=>{
                document.removeEventListener('mousedown', handle_Click_Outside);
            }
        }, [])

        function handle_Click_Outside(e){
                const {current : wrap} = wrapper_Ref;
                if(wrap && !wrap.contains(e.target)){
                    setStyler({transform: 'translateY(-5rem)', visibility: 'hidden'})
                }
        }

    const reduceCapSubmitData = {
        userID : user.userID,
        ...reduceCapInput,
        holderNumber: holderData?.serialNumber,
        date : new Date().toDateString(),
        holderName: holderData?.name,
    }

        const handleRedeem = async()=>{
            if (reduceCapInput.meansOfPayment === '') {
                window.alert('Please add means of payment')
            }
            else{
                if (reduceCapInput.amountToPay === '') {
                    window.alert('Please add amount to pay')
                }else{
                    await baseURL.post('/shareholders/reduceCapital', reduceCapSubmitData, {
                        headers : {
                            'auth-token' : user?.token
                        }
                    })
                    .then(async res => {
                        setReduceCap(false)
                        const data = await res.data
                        setAlertMessage(data.message)
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        }, 3000)
                    })
                }
            }
        }

        const handleUpdate = ()=>{
            setAlertMessage('Function Coming Soon!!!')
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 2000);
        }
        const handleRedeemLiability = ()=>{
            setAlertMessage('Function Coming Soon!!!')
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 2000);
        }
    

    return (
        <div className='Invoices'>
            <div className="invoicesHeading">
                    <h1>Fixed Assets, Capital & Longterm Liabilities</h1>
                    <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                        <button className="invoiceButton" onClick={handleStyling}>
                            New Transaction <i className="fas fa-sort-down"></i>
                        </button>
                        <div className="moreOptionsCont" style={{...styles}}>
                            <p className="option" onClick={()=>{setNewAsset(true)}}>Fixed Asset</p>
                            <p className="option" onClick={()=>{setNewShareholder(true)}}>Shareholder</p>
                            <p className="option" onClick={()=>{setNewLongtermLiability(true)}}>Longterm Liability</p>
                        </div>
                    </div>
                    
            </div>

            <div className="liquidityOptions">
                <p className={search === '' ? 'btn selected' : 'option'} onClick={()=>{
                    history.push('/capital-and-fixed-assets')
                }}>Assets Register</p>
                <p className={ search !== '' ? 'btn selected' : 'option'} onClick={()=>{
                    history.push('/capital-and-fixed-assets?eqt=true')
                }}>Equity and Long Term Liabilities</p>
            </div>

            <div className="assetsRegisterContainer">
                {
                    search === '' ?
                    <div className="assetsRegister">
                        <table>
                            <thead>
                                <tr>
                                    <th className='asset'> Date</th>
                                    <th className='asset'>Purchase Date</th>
                                    <th className='asset'>Asset Name</th>
                                    <th className='asset'>Ref Number</th>
                                    <th className='asset'>Serial Number</th>
                                    <th className='asset'>Original Value</th>
                                    <th className='asset'>Residual Value</th>
                                    <th className='asset'>Dep Rate</th>
                                    <th className='asset'>Life Span (Years)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    assets?.map(asset => (
                                        <tr key={asset._id} className='assetDetailParent' onClick={()=>{history.push(`/assets/${asset.asset.serialNumber}`)}}>
                                            <td className='asset'> {new Date(asset.asset.date).toLocaleDateString()}</td>
                                            <td className='asset'>{new Date(asset.asset.purchaseDate).toLocaleDateString()}</td>
                                            <td className='asset'>{asset.asset.assetName.slice(0, 10)}...</td>
                                            <td className='asset'>{asset.asset.ref.slice(0, 10)}...</td>
                                            <td className='asset'><Link className='assetLink' to={`/assets/${asset.asset.serialNumber}`}>{asset.asset.serialNumber.slice(0, 10)}...</Link></td>
                                            <td className='asset'>{((asset.asset.cost).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td className='asset'>{(Number(asset.asset.residualValue).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td className='asset'>{asset.asset.depRate}</td>
                                            <td className='asset'>{(100 / asset.asset.depRate).toFixed(1)}</td>
                                        </tr>
                                        
                                    ))
                                }
                            </tbody>
                        </table>

                        <table>
                            <thead>
                                <tr>
                                    <th className='asset'>Dep of Month <small>{months[thisMonth]}</small> </th>
                                    <th className='asset'>Dep of Year <small>{thisYear}</small></th>
                                    <th className='asset'>Previous Dep <small>{thisYear - 1}</small></th>
                                    <th className='asset'>Acc Dep <small>{`${months[11]} ${thisYear}`}</small></th>
                                    <th className='asset'>Book Value <small>{`${months[11]} ${thisYear}`}</small></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    depInfos.map((asset, i) => (
                                        <tr className='assetDetailParent' onClick={()=>{history.push(`/assets/${serialNumbers[i]}`)}}>
                                            <td className='asset'>{((asset.monthlyDep).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td className='asset'>{((asset.endOfYearDep).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td className='asset'>{((asset.previousAccDep).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td className='asset'>{((asset.accDep).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td className='asset'>{((asset.nbv).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div> : 

                    <div className="shareholdersList">
                    <div className="buttonContainer">
                        <button className={!viewLiab ? 'button' : "btn"} onClick={()=>{setViewLiab(false)}}>
                            View Shareholders List
                        </button>
                        <button className={!viewLiab ? 'btn' : "button"} onClick={()=>{setViewLiab(true)}}>
                            View Liabilities List
                        </button>
                    </div>
                    {
                        !viewLiab &&
                        <div className="allDebtorsContainer">
                            <h3>Shareholders List</h3>
                            <table className='allDebtorsTable'>
                                <thead>
                                    <tr>
                                        <th className='holderDetail'>Shareholder Name</th>
                                        <th className='holderDetail'>Address</th>
                                        <th className='holderDetail'>Email</th>
                                        <th className='holderDetail'>Telephone</th>
                                        <th className='holderDetail'>Identification Number</th>
                                        <th className='holderDetail'>Total Contribution</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        shareholders?.map(shareholder => (
                                            <tr className='shareholder invoiceDetail'>
                                                <td
                                                style={{textAlign: 'left'}}
                                                className='holderDetail' onClick={()=>{history.push(`/shareholders/${shareholder.serialNumber}`)}}>{shareholder.name}</td>
                                                <td className='holderDetail' onClick={()=>{history.push(`/shareholders/${shareholder.serialNumber}`)}}>{shareholder.address}</td>
                                                <td className='holderDetail' onClick={()=>{history.push(`/shareholders/${shareholder.serialNumber}`)}}><a href={`mailto:${shareholder.email}`}>{shareholder.email}</a></td>
                                                <td className='holderDetail' onClick={()=>{history.push(`/shareholders/${shareholder.serialNumber}`)}}>{shareholder.tel}</td>
                                                <td className='holderDetail' onClick={()=>{history.push(`/shareholders/${shareholder.serialNumber}`)}}> {shareholder.serialNumber}</td>
                                                <td className='holderDetail' onClick={()=>{history.push(`/shareholders/${shareholder.serialNumber}`)}}>{shareholder.totalContribution}</td>
                                                <td className='sendInvoice'>
                                                    <span onClick={()=>{
                                                        setRequiredData(shareholder)
                                                        setCapitalInc(true)
                                                        handleUpdate()
                                                    }}>Inc.Cap</span>
                                                    <span onClick={()=>{
                                                        setHolderData(shareholder);
                                                        setReduceCap(true)
                                                    }} style={{borderLeft: '2px solid white'}}>Red.Cap</span>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    }

                    {
                        viewLiab &&
                        <div className="allDebtorsContainer">
                            <h3>Liabilities List</h3>
                            <table className="allDebtorsTable">
                                <thead>
                                    <tr>
                                        <th className='holderDetail'>Date</th>
                                        <th className='holderDetail'>Libility Name</th>
                                        <th className='holderDetail'>Individual or Institution</th>
                                        <th className='holderDetail'>Identification Number</th>
                                        <th className='holderDetail'>Deposited to:</th>
                                        <th className='holderDetail'>Interest Rate</th>
                                        <th className='holderDetail'>Duration</th>
                                        <th className='holderDetail'>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        liabilities?.map(liability => (
                                            <tr className='invoiceDetail'>
                                                <td className='holderDetail' onClick={()=>{
                                                    history.push(`/liabilities/${liability.serialNumber}`)
                                                }}
                                                
                                                >{new Date(liability.date).toLocaleDateString()}</td>
                                                <td className='holderDetail' onClick={()=>{
                                                    history.push(`/liabilities/${liability.serialNumber}`)
                                                }}
                                                style={{textAlign: 'left'}}
                                                >{liability.liabilityName}</td>
                                                <td 
                                                style={{textAlign: 'left'}} className='holderDetail' onClick={()=>{
                                                    history.push(`/liabilities/${liability.serialNumber}`)
                                                }}>{liability.name}</td>
                                                <td className='holderDetail' onClick={()=>{
                                                    history.push(`/liabilities/${liability.serialNumber}`)
                                                }}>{liability.serialNumber}</td>
                                                <td
                                                style={{textAlign: 'left', textTransform: 'capitalize'}} className='holderDetail' onClick={()=>{
                                                    history.push(`/liabilities/${liability.serialNumber}`)
                                                }}>{liability.receivedBy.replace('M', ' m')}</td>
                                                <td className='holderDetail' onClick={()=>{
                                                    history.push(`/liabilities/${liability.serialNumber}`)
                                                }}>{liability.interestRate}</td>
                                                
                                                <td className='holderDetail' onClick={()=>{
                                                    history.push(`/liabilities/${liability.serialNumber}`)
                                                }}>{liability.duration}</td>
                                                <td className='holderDetail' onClick={()=>{
                                                    history.push(`/liabilities/${liability.serialNumber}`)
                                                }}>{liability.amount}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    }
                    </div>
                }
            </div>

            {
                newAsset &&
                <NewFixedAsset
                    onClick={()=>{setNewAsset(false)}}
                    refetch={()=>{
                        setAlertMessage('Fixed Asset Added Successfully')
                        setAlert(true)
                        setTimeout(() => {
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000);
                    }}
                    refetch={()=>{
                        setAlertMessage('Fixed Asset Added Successfully')
                        setAlert(true)
                        setTimeout(() => {
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000);
                    }}
                />
            }
            {
                newShareholder &&
                <NewShareholder
                    onClick={()=>{setNewShareholder(false)}}
                    refetch={()=>{
                        setAlertMessage('Shareholder Added Successfully')
                        setAlert(true)
                        setTimeout(() => {
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000);
                    }}
                    refetch={()=>{
                        setAlertMessage('Shareholder Added Successfully')
                        setAlert(true)
                        setTimeout(() => {
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000);
                    }}
                />
            }
            {
                fetching &&
                <Loader/>
            }
            {
                newLongtermLiability &&
                <NewLongtermLiability
                    onClick={()=>{setNewLongtermLiability(false)}}
                    refetch={()=>{
                        setAlertMessage('Liability Added Successfully')
                        setAlert(true)
                        setTimeout(() => {
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000);
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
            <Alert
                alert={alert}
                cancelAlert={()=>{setAlert(false)}}
                message={alertMessage}
            />
            {
                capitalInc && <IncreaseCapital
                    onClick={() => {setCapitalInc(false) }}
                    refetch={()=>{console.log('Refetch working')}}
                    requiredData={{
                        name : requiredData.name,
                        email : requiredData.email,
                        address : requiredData.address,
                        tel : requiredData.tel,
                        serialNumber : requiredData.serialNumber,
                    }}
                />
            }

            <div ref={wrapperRef}>
            {
            reduceCap && <ReduceCapital
                inputValue = {reduceCapInput}
                handleChange = {(e)=>{handleReduceCapChange(e)}}
                cancel = {()=>{setReduceCap(false)}}
                submit = {handleRedeem}
            />
            }
            </div>
            
        </div>
    )
}

export default CapitalAndFixedAssets
 