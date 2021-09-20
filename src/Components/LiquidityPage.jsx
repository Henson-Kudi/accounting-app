import React, {useState, useEffect, useRef, useContext} from 'react'
import axios from 'axios'
import {baseURL} from './axios'
import Barchart from './Barchart'
import Loader from './Loader'
import Invoice from './Invoice'
import Receipt from './Receipt'
import MakePayment from './MakePayment'
import ReceivePayment from './ReceivePayment'
import PurchaseInvoice from './PurchaseInvoice'
import PurchaseReceipt from './CashPurchase'
import NewCustomerForm from './NewCustomerForm'
import NewSupplierForm from './NewSupplierForm'
import './LiquidityPage.css'
import Contra from './Contra'
import {UserContext} from './userContext'

function LiquidityPage() {

    const [fetching, setfetching] = useState(false)
    const [data, setData] = useState([])
    const [newInvoice, setNewInvoice] = useState(false)
    const [newReceipt, setNewReceipt] = useState(false)
    const [newMakePayment, setNewMakePayment] = useState(false)
    const [newReceivePayment, setNewReceivePayment] = useState(false)
    const [newPurchaseInvoice, setNewPurchaseInvoice] = useState(false)
    const [newPurchaseReceipt, setNewPurchaseReceipt] = useState(false)
    const [newCustomer, setNewCustomer] = useState(false)
    const [newSupplier, setNewSupplier] = useState(false)
    const [overview, setOverview] = useState(true)
    const [selected, setSelected] = useState('cash')
    const [interAccount, setInterAccount] = useState(false)
    const {user} = useContext(UserContext)


    useEffect(()=>{
        let source = axios.CancelToken.source();
        let unMounted = false;
        getData(source, unMounted)

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }

    }, [])

    const getData = async(source, unMounted) => {
        
        await baseURL.get('/meansOfPayment', {
            cancelToken: source.token,
            headers:{
                'auth-token': user?.token
            }
        })
        .then(res =>{
            setfetching(false)
            setData(res.data)
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
    }

    const totalOut = (data.filter(item => item.meansOfPayment === selected).filter(item => item.inOrOut === 'out').map(item => item.amount).reduce((a, b) => a + b, 0)).toFixed(2)

    const totalIn = (data.filter(item => item.meansOfPayment === selected).filter(item => item.inOrOut === 'in').map(item => item.amount).reduce((a, b) => a + b, 0)).toFixed(2)

    const accountBalance = (totalIn - totalOut).toFixed(2)

    let janIn = []; let janOut = []
    let febIn = []; let febOut = []
    let marIn = []; let marOut = []
    let aprIn = []; let aprOut = []
    let mayIn = []; let mayOut = []
    let junIn = []; let junOut = []
    let julIn = []; let julOut = []
    let augIn = []; let augOut = []
    let septIn = []; let septOut = []
    let octIn = []; let octOut = []
    let novIn = []; let novOut = []
    let decIn = []; let decOut = []

    const chart = data.filter(item => item.meansOfPayment === selected)

    chart.filter(item => item.inOrOut === 'in').map(item => {
        const month = new Date(item.date).getMonth()
        switch (month) {
            case 0:
                janIn.push(item.amount)
                break;
            
            case 1:
                febIn.push(item.amount)
                break;

            case 2:
                marIn.push(item.amount)
                break;

            case 3:
                aprIn.push(item.amount)
                break;

            case 4:
                mayIn.push(item.amount)
                break;

            case 5:
                junIn.push(item.amount)
                break;

            case 6:
                julIn.push(item.amount)
                break;

            case 7:
                augIn.push(item.amount)
                break;

            case 8:
                septIn.push(item.amount)
                break;

            case 9:
                octIn.push(item.amount)
                break;

            case 10:
                novIn.push(item.amount)
                break;
        
            case 11:
                decIn.push(item.amount)
                break;

            
            default: return null
                break;
        }
    })

    chart.filter(item => item.inOrOut === 'out').map(item => {
        const month = new Date(item.date).getMonth()
        switch (month) {
            case 0:
                janOut.push(item.amount)
                break;
            
            case 1:
                febOut.push(item.amount)
                break;

            case 2:
                marOut.push(item.amount)
                break;

            case 3:
                aprOut.push(item.amount)
                break;

            case 4:
                mayOut.push(item.amount)
                break;

            case 5:
                junOut.push(item.amount)
                break;

            case 6:
                julOut.push(item.amount)
                break;

            case 7:
                augOut.push(item.amount)
                break;

            case 8:
                septOut.push(item.amount)
                break;

            case 9:
                octOut.push(item.amount)
                break;

            case 10:
                novOut.push(item.amount)
                break;
        
            case 11:
                decOut.push(item.amount)
                break;

            
            default: return null
                break;
        }
    })

    janIn = janIn.reduce((a, b) => a + b, 0)
    febIn = febIn.reduce((a, b) => a + b, 0)
    marIn = marIn.reduce((a, b) => a + b, 0)
    aprIn = aprIn.reduce((a, b) => a + b, 0)
    mayIn = mayIn.reduce((a, b) => a + b, 0)
    junIn = junIn.reduce((a, b) => a + b, 0)
    julIn = julIn.reduce((a, b) => a + b, 0)
    augIn = augIn.reduce((a, b) => a + b, 0)
    septIn = septIn.reduce((a, b) => a + b, 0)
    octIn = octIn.reduce((a, b) => a + b, 0)
    novIn = novIn.reduce((a, b) => a + b, 0)
    decIn = decIn.reduce((a, b) => a + b, 0)

    janOut = janOut.reduce((a, b) => a + b, 0); 
    febOut = febOut.reduce((a, b) => a + b, 0); 
    marOut = marOut.reduce((a, b) => a + b, 0); 
    aprOut = aprOut.reduce((a, b) => a + b, 0); 
    mayOut = mayOut.reduce((a, b) => a + b, 0); 
    junOut = junOut.reduce((a, b) => a + b, 0); 
    julOut = julOut.reduce((a, b) => a + b, 0); 
    augOut = augOut.reduce((a, b) => a + b, 0); 
    septOut = septOut.reduce((a, b) => a + b, 0); 
    octOut = octOut.reduce((a, b) => a + b, 0); 
    novOut = novOut.reduce((a, b) => a + b, 0); 
    decOut = decOut.reduce((a, b) => a + b, 0); 

    const janBal = janIn - janOut
    const febBal = febIn - febOut
    const marBal = marIn - marOut
    const aprBal = aprIn - aprOut
    const mayBal = mayIn - mayOut
    const junBal = junIn - junOut
    const julBal = julIn - julOut
    const augBal = augIn - augOut
    const septBal = septIn - septOut
    const octBal = octIn - octOut
    const novBal = novIn - novOut
    const decBal = decIn - decOut

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
            <div className="invoicesHeading">
                    <h1>Treasury</h1>
                    <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                        <button className="invoiceButton" onClick={handleStyling}>
                            New Transaction <i className="fas fa-sort-down"></i>
                        </button>
                        <div className="moreOptionsCont" style={{...styles}}>
                            <p className="option" onClick={()=>{setNewReceipt(true)}}>Sales Receipt</p>
                            <p className="option" onClick={()=>{setNewReceivePayment(true)}}>Receive Payment</p>
                            <p className="option" onClick={()=>{setNewPurchaseReceipt(true)}}>Puchase Receipt</p>
                            <p className="option" onClick={()=>{setNewMakePayment(true)}}>Make Payment</p>
                            <p className="option" onClick={()=>{setInterAccount(true)}}>Inter Account (Contra)</p>
                        </div>
                    </div>
                    
            </div>
            
            
            <div className="liquidityOptions">
                <p className={selected === 'cash' ? 'selected' : 'option'} onClick={()=>{setSelected('cash')}}>Cash Account</p>
                <p className={selected === 'bank' ? 'selected' : 'option'} onClick={()=>{setSelected('bank')}}>Bank Account</p>
                <p className={selected === 'mobileMoney' ? 'selected' : 'option'} onClick={()=>{setSelected('mobileMoney')}}>Mobile Money Account</p>
            </div>

            <div className="totalInAccount">
                <div>
                    <p className='accountTotal'>
                        {selected === 'cash' ? 'Total Cash In ' : selected === 'bank' ? 'Total Bank In ' : 'Total Mobile Money In '}
                    </p>
                    <p>
                        {(totalIn).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                </div>
                    
                <div>
                    <p className='accountTotal'>
                        {selected === 'cash' ? 'Total Cash Out ' : selected === 'bank' ? 'Total Bank Out ' : 'Total Mobile Money Out '} 
                    </p>
                    <p>
                        {(totalOut).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                </div>
                <div>
                    <p className='accountTotal'>
                        Balance in Account
                    </p>
                    <p>
                        {(accountBalance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                </div>
            </div>
        
            <div className="filters">
                <button className={overview ? "button" : 'btn'} onClick={()=>{setOverview(true)}}>
                    Overview
                </button>

                <button className={!overview ? "button" : 'btn'} onClick={()=>{setOverview(false)}}>
                    All Transactions
                </button>
            </div>

            <div>
                {
                    overview &&
                    <Barchart
                        labels = {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']}

                        data1={
                                [janIn, febIn,marIn, aprIn, mayIn, junIn, julIn, augIn, septIn, octIn, novIn, decIn]
                            }
                        tooltip1={`${selected} in`}
                        data2={
                                [janOut, febOut,marOut, aprOut, mayOut, junOut, julOut, augOut, septOut, octOut, novOut, decOut]
                            }
                        tooltip2={`${selected} out`}
                        data3={
                                [janBal, febBal,marBal, aprBal, mayBal, junBal, julBal, augBal, septBal, octBal, novBal, decBal]
                            }
                        tooltip3={`${selected} balance`}
                    />
                }

                {
                    !overview &&
                    <div className="allTrans allDebtorsContainer">
                        <table className='allDebtorsTable'>
                            <thead>
                                <tr className='recentItemHead'>
                                    <th className='recentItem'>Date</th>
                                    <th className='recentItem'>Sent to / Received from:</th>
                                    <th className='recentItem'>Description</th>
                                    <th className='recentItem'>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.filter(item => item.meansOfPayment === selected).sort((a, b) => new Date(b.date) - new Date(a.date)).map(item => (
                                    <tr key={item._id} className='recentItemHead'>
                                        <td className='recentItem'>{item.date}</td>
                                        <td className='recentItem'>{item.name}</td>
                                        <td className='recentItem'>{item.reason}</td>
                                        <td className='recentItem'>{(Number(item.amount)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>

            {
                fetching &&
                <Loader/>
            }
            {
                newInvoice &&
                <Invoice
                    newInvoice={()=>{setNewInvoice(true)}}
                    onClick={()=>{setNewInvoice(false)}}
                />
            }
            {
                newReceipt &&
                <Receipt
                    newReceipt={()=>{setNewReceipt(true)}}
                    onClick={()=>{setNewReceipt(false)}}
                />
            }
            {
                newMakePayment&&
                <MakePayment
                    onClick={()=>{setNewMakePayment(false)}}
                />
            }
            {
                newReceivePayment &&
                <ReceivePayment
                    onClick={()=>{setNewReceivePayment(false)}}
                />
            }
            {
                newPurchaseInvoice &&
                <PurchaseInvoice
                newInvoice={() => {setNewPurchaseInvoice(true)}}
                    onClick={()=>{setNewPurchaseInvoice(false)}}
                />
            }
            {
                newPurchaseReceipt &&
                <PurchaseReceipt
                    onClick={()=>{setNewPurchaseReceipt(false)}}
                    newReceipt={()=>{setNewPurchaseReceipt(true)}}
                />
            }
            {
                newCustomer &&
                <NewCustomerForm
                    onClick={()=>{setNewCustomer(false)}}
                />
            }
            {
                newSupplier &&
                <NewSupplierForm
                    onClick={()=>{setNewSupplier(false)}}
                />
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
