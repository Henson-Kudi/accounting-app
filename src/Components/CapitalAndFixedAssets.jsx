import React, {useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {baseURL} from './axios'
import NewFixedAsset from './NewFixedAsset'
import './CapitalAndFixedAssets.css'
import Loader from './Loader'
import NewShareholder from './NewShareholder'
import NewLongtermLiability from './NewLongtermLiability'

function CapitalAndFixedAssets() {
    const [newAsset, setNewAsset] = useState(false)
    const [newLongtermLiability, setNewLongtermLiability] = useState(false)
    const [transactionOptions, setTransactionOptions] = useState(false)
    const [newShareholder, setNewShareholder] = useState(false)
    const [viewAssets, setViewAssets] = useState(true)
    const [viewLiab, setViewLiab] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [assets, setAssets] = useState([])
    const [shareholders, setShareholders] = useState([])
    const [liabilities, setLiabilities] = useState([])

    const fetchAssets = async(unMounted, source)=>{
        const request1 = baseURL.get('/fixedAssets')
        const request2 = baseURL.get('/shareholders')
        const request3 = baseURL.get('/longtermLiabilities')

            await axios.all([request1, request2, request3], {
                cancelToken: source.token
            })
            .then(res => {
                const [result1, result2, result3] = res
                setAssets(result1.data)
                setShareholders(result2.data)
                setLiabilities(result3.data)
                setFetching(false)
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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',]


    let depInfos = []
    assets.forEach(asset => {
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
            setTransactionOptions(false);
        }
    }
    

    return (
        <div className='capitalAndAssets'>
            <div className="expenseTop salesTop homeAndPrint">
                <div className='salesOptionsLeft'>
                    <Link to='/' className='button'>Home</Link>
                    <div className='salesTransactions' ref={wrapperRef}>
                        <button onClick={() => { setTransactionOptions(!transactionOptions) }} className='button'>New Transaction <i className="fas fa-angle-down"></i></button>
                        {
                            transactionOptions &&
                            <ul className='transactionOptions'>
                                <li className='transactionOption' onClick={() => { setNewAsset(true) }}>New Asset</li>
                                <li className='transactionOption' onClick={() => { setNewShareholder(true) }}>New Shareholder</li>
                                <li className='transactionOption' onClick={() => { setNewLongtermLiability(true) }}>Long Term Liability</li>

                            </ul>
                        }
                    </div>
                </div>

                <div className="salesOptionsMiddle">
                    <h1>Equity, Long Term Liabilities and Fixed Assets</h1>
                </div>

                <div className="salesOptionsRight">
                    <button className="button" onClick={()=>{window.print()}}>
                        Print Page
                    </button>
                </div>
            </div>

            <div className="liquidityOptions">
                <p className={viewAssets ? 'btn selected' : 'option'} onClick={()=>{setViewAssets(true)}}>Assets Register</p>
                <p className={ !viewAssets ? 'btn selected' : 'option'} onClick={()=>{setViewAssets(false)}}>Equity and Long Term Liabilities</p>
            </div>

            <div className="assetsRegisterContainer">
                {
                    viewAssets &&
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
                                    assets.map(asset => (
                                        <tr key={asset._id} className='assetDetailParent'>
                                            <td className='asset'> {new Date(asset.asset.date).toLocaleDateString()}</td>
                                            <td className='asset'>{new Date(asset.asset.purchaseDate).toLocaleDateString()}</td>
                                            <td className='asset'><Link className='assetLink' to={`/assets/${asset.asset.serialNumber}`}>{asset.asset.assetName.slice(0, 10)}...</Link></td>
                                            <td className='asset'>{asset.asset.ref.slice(0, 10)}...</td>
                                            <td className='asset'><Link className='assetLink' to={`/assets/${asset.asset.serialNumber}`}>{asset.asset.serialNumber.slice(0, 10)}...</Link></td>
                                            <td className='asset'>{((asset.asset.cost).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td className='asset'>{((asset.asset.residualValue).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
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
                                    depInfos.map(asset => (
                                        <tr className='assetDetailParent'>
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
                    </div>
                }

                {
                    !viewAssets &&
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
                        <div className="shareholders">
                            <h3>Shareholders List</h3>
                            <table>
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
                                        shareholders.map(shareholder => (
                                            <tr className='shareholder'>
                                                <td className='holderDetail'><Link to={`/shareholders/${shareholder.serialNumber}`}>{shareholder.name}</Link></td>
                                                <td className='holderDetail'>{shareholder.address}</td>
                                                <td className='holderDetail'><a href={`mailto:${shareholder.email}`}>{shareholder.email}</a></td>
                                                <td className='holderDetail'><a href={`tel:${shareholder.tel}`}>{shareholder.tel}</a></td>
                                                <td className='holderDetail'><Link to={`/shareholders/${shareholder.serialNumber}`}>{shareholder.serialNumber}</Link></td>
                                                <td className='holderDetail'>{shareholder.totalContribution}</td>
                                                <td className='holderDetail updateHolder'>
                                                    <small onClick={()=>{alert("expecting an update form")}}>Update</small>
                                                    <small onClick={()=>{alert("expecting a redemption form")}}>Redeem</small>
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
                        <div className="shareholders">
                            <h3>Liabilities List</h3>
                            <table>
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
                                        liabilities.map(liability => (
                                            <tr className='liability shareholder'>
                                                <td className='holderDetail'>{new Date(liability.date).toLocaleDateString()}</td>
                                                <td className='holderDetail'><Link to={`/liabilities/${liability.serialNumber}`}>{liability.liabilityName}</Link></td>
                                                <td className='holderDetail'>{liability.name}</td>
                                                <td className='holderDetail'><Link to={`/liabilities/${liability.serialNumber}`}>{liability.serialNumber}</Link></td>
                                                <td className='holderDetail'>{liability.receivedBy}</td>
                                                <td className='holderDetail'>{liability.interestRate}</td>
                                                
                                                <td className='holderDetail'>{liability.duration}</td>
                                                <td className='holderDetail'>{liability.amount}</td>
                                                <td className='holderDetail updateHolder'>
                                                    <small onClick={()=>{alert("expecting a redemption form")}}>Redeem</small>
                                                </td>
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
                />
            }
            {
                newShareholder &&
                <NewShareholder
                    onClick={()=>{setNewShareholder(false)}}
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
                />
            }
        </div>
    )
}

export default CapitalAndFixedAssets
