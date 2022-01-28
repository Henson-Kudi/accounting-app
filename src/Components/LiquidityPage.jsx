import React, {useState, useEffect, useRef, useContext} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import {parse} from 'query-string'
import Barchart from './Barchart'
import Loader from './Loader'
import './LiquidityPage.css'
import Contra from './Contra'
import {UserContext} from './userContext'
import useFetch from '../customHooks/useFetch'

function LiquidityPage() {
    const history = useHistory()
    const {pathname, search} = useLocation()

    const query = parse(search)

    const today = new Date()

    const {data : {cash, bank, momo}, loader, setData} = useFetch("meansOfPayment", {})
    const [overview, setOverview] = useState(true)
    const [interAccount, setInterAccount] = useState(false)
    const {user} = useContext(UserContext)


    const totalOut = !query.details ? (cash?.filter(item => item.inOrOut === 'out' && (new Date(item.date).getFullYear() === today.getFullYear()))?.map(item => item.amount)?.reduce((a, b) => a + b, 0)) : query.details === 'bank' ? (bank?.filter(item => item.inOrOut === 'out' && (new Date(item.date).getFullYear() === today.getFullYear()))?.map(item => item.amount)?.reduce((a, b) => a + b, 0)) : (momo?.filter(item => item.inOrOut === 'out' && (new Date(item.date).getFullYear() === today.getFullYear()))?.map(item => item.amount)?.reduce((a, b) => a + b, 0))

    const totalIn = !query.details ? (cash?.filter(item => item.inOrOut === 'in' && (new Date(item.date).getFullYear() === today.getFullYear()))?.map(item => item.amount)?.reduce((a, b) => a + b, 0)) : query.details === 'bank' ? (bank?.filter(item => item.inOrOut === 'in' && (new Date(item.date).getFullYear() === today.getFullYear()))?.map(item => item.amount).reduce((a, b) => a + b, 0)) : (momo?.filter(item => item.inOrOut === 'in' && (new Date(item.date).getFullYear() === today.getFullYear()))?.map(item => item.amount)?.reduce((a, b) => a + b, 0))

    const accountBalance = (totalIn - totalOut)

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const insGraphData = labels.map((labIndex) => {
        return !query.details ? cash?.filter(item => ((new Date(item.date).getFullYear() === today.getFullYear()) && (new Date(item.date).getMonth() === labIndex) && (item.inOrOut === 'in')))?.map(item => Number(item.amount))?.reduce((acc, item) => acc + item, 0) : query.details === 'bank' ? bank?.filter(item => ((new Date(item.date).getFullYear() === today.getFullYear()) && (new Date(item.date).getMonth() === labIndex) && (item.inOrOut === 'in')))?.map(item => Number(item.amount))?.reduce((acc, item) => acc + item, 0) : momo?.filter(item => ((new Date(item.date).getFullYear() === today.getFullYear()) && (new Date(item.date).getMonth() === labIndex) && (item.inOrOut === 'in')))?.map(item => Number(item.amount))?.reduce((acc, item) => acc + item, 0);
    })

    const outsGraphData = labels?.map((label, labIndex) => {
        return !query.details ? cash?.filter(item => ((new Date(item.date).getFullYear() === today.getFullYear()) && (new Date(item.date).getMonth() === labIndex) && (item.inOrOut === 'out')))?.map(item => Number(item.amount))?.reduce((acc, item) => acc + item, 0) : query.details === 'bank' ? bank?.filter(item => ((new Date(item.date).getFullYear() === today.getFullYear()) && (new Date(item.date).getMonth() === labIndex) && (item.inOrOut === 'out')))?.map(item => Number(item.amount))?.reduce((acc, item) => acc + item, 0) : momo?.filter(item => ((new Date(item.date).getFullYear() === today.getFullYear()) && (new Date(item.date).getMonth() === labIndex) && (item.inOrOut === 'out')))?.map(item => Number(item.amount))?.reduce((acc, item) => acc + item, 0);
    })

    const balancesGraph = labels.map((label, labIndex) => {
        return insGraphData[labIndex] - outsGraphData[labIndex]
    })

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

    return (
        <div className='liquidityPage Invoices'>
            <div className="invoicesHeading invoicesHeadingCont">
                    <h1>Treasury</h1>
                    <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                        <button className="invoiceButton" onClick={handleStyling}>
                            New Transaction <i className="fas fa-sort-down"></i>
                        </button>
                        <div className="moreOptionsCont" style={{...styles}}>
                            <p className="option" onClick={()=>{history.push('/receipt/new-receipt')}}>Sales Receipt</p>
                            <p className="option" onClick={()=>{history.push('/payments/customer-payment')}}>Receive Payment</p>
                            <p className="option" onClick={()=>{history.push('/purchase-receipt/new-purchase-receipt')}}>Puchase Receipt</p>
                            <p className="option" onClick={()=>{history.push('/payments/supplier-payment')}}>Make Payment</p>
                            <p className="option" onClick={()=>{setInterAccount(true)}}>Inter Account (Contra)</p>
                        </div>
                    </div>
                    
            </div>
            
            
            <div className="liquidityOptions">
                <p className={!query.details ? 'selected' : 'option'} onClick={()=>{
                    query.details && history.push(pathname)
                }}>Cash Account</p>
                <p className={query.details === 'bank' ? 'selected' : 'option'} onClick={()=>{
                    (query.details !== 'bank') && history.push(`${pathname}?details=bank`)
                }}>Bank Account</p>
                <p className={query.details === 'mobile money' ? 'selected' : 'option'} onClick={()=>{
                    (query.details !== 'mobile money') && history.push(`${pathname}?details=mobile money`)
                }}>Mobile Money Account</p>
            </div>

            <div className="totalInAccount">
                <div>
                    <p className='accountTotal'>
                        {query.details === 'bank' ? 'Total Bank In' : query.details === 'mobile money' ? 'Total Mobile Money In ' : 'Total Cash In'}
                    </p>
                    <p>
                        {(totalIn)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                </div>
                    
                <div>
                    <p className='accountTotal'>
                        {query.details === 'bank' ? 'Total Bank Out' : query.details === 'mobile money' ? 'Total Mobile Money Out ' : 'Total Cash Out'} 
                    </p>
                    <p>
                        {(totalOut)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                </div>
                <div>
                    <p className='accountTotal'>
                        Balance in Account
                    </p>
                    <p>
                        {(accountBalance)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                </div>
            </div>
        
            <div className="filters treasuryFilters">
                <button className={overview ? "treasuryButton treasuryOverview" : 'treasuryButton'} onClick={()=>{setOverview(true)}}>
                    Overview
                </button>

                <button className={!overview ? "treasuryButton treasuryOverview" : 'treasuryButton'} onClick={()=>{setOverview(false)}}>
                    All Transactions
                </button>
            </div>

            <div>
                {
                    overview ?(
                    <Barchart
                        labels = {labels}

                        data1={insGraphData}
                        tooltip1={`monthly ${query.details ?? 'cash'} ins of ${today.getFullYear()}`}
                        data2={outsGraphData}
                        tooltip2={`monthly ${query.details ?? 'cash'} outs of ${today.getFullYear()}`}
                        data3={balancesGraph}
                        tooltip3={`monthly ${query.details ?? 'cash'} balances of ${today.getFullYear()}`}
                    />) : (
                    <div className="allTrans allDebtorsContainer">
                        <table className='allDebtorsTable'>
                            <thead>
                                <tr className='recentItemHead'>
                                    <th className='recentItem'>Date</th>
                                    <th className='recentItem'>Source</th>
                                    <th className='recentItem'>Description</th>
                                    <th className='recentItem'>Amount</th>
                                    <th className='recentItem'>In or Out</th>
                                </tr>
                            </thead>
                            <tbody className='treasuryBody'>
                                {
                                    !query.details ? cash?.filter(item => new Date(item?.date).getFullYear() === today.getFullYear())?.sort((a, b) => new Date(b?.date) - new Date(a?.date))?.map(item => (
                                    <tr key={item?._id} className='recentItemHead'>
                                        <td className='recentItem'>{new Date(item?.date)?.toLocaleDateString()}</td>
                                        <td className='recentItem'>{item?.source}</td>
                                        <td className='recentItem'>{item?.reason}</td>
                                        <td className='recentItem'>{(Number(item?.amount))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='recentItem'>{item?.inOrOut}</td>
                                    </tr>
                                    )) : query.details === 'bank' ? bank?.filter(item => new Date(item?.date).getFullYear() === today.getFullYear())?.sort((a, b) => new Date(b?.date) - new Date(a?.date))?.map(item => (
                                    <tr key={item?._id} className='recentItemHead'>
                                        <td className='recentItem'>{new Date(item?.date)?.toLocaleDateString()}</td>
                                        <td className='recentItem'>{item?.source}</td>
                                        <td className='recentItem'>{item?.reason}</td>
                                        <td className='recentItem'>{(Number(item?.amount))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='recentItem'>{item?.inOrOut}</td>
                                    </tr>
                                    )) : momo?.filter(item => new Date(item?.date).getFullYear() === today.getFullYear())?.sort((a, b) => new Date(b?.date) - new Date(a?.date))?.map(item => (
                                    <tr key={item?._id} className='recentItemHead'>
                                        <td className='recentItem'>{new Date(item?.date)?.toLocaleDateString()}</td>
                                        <td className='recentItem'>{item?.source}</td>
                                        <td className='recentItem'>{item?.reason}</td>
                                        <td className='recentItem'>{(Number(item?.amount))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='recentItem'>{item?.inOrOut}</td>
                                    </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    )
                }
            </div>

            {
                loader &&
                <Loader/>
            }
            
            {
                interAccount && 
                <Contra
                    cancel={()=>{setInterAccount(false)}}
                />
            }
        </div>
    )
}

export default LiquidityPage
