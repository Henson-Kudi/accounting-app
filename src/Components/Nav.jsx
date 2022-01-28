import React, { useEffect, useState, useRef, useContext} from 'react'
import './Nav.css'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from './userContext'
import {baseURL} from './axios'


function Nav({click}) {
    const {user, login} = useContext(UserContext)
    
    const [visibleNav, setVisibleNav] = useState(true)
    const [viewIncomeTabs, setViewIncomeTabs] = useState(false)
    const [viewExpenditureTabs, setViewExpenditureTabs] = useState(false)
    const [viewCustTabs, setViewCustTabs] = useState(false)
    const wrapperRef = useRef(null)
    const wrapper_Ref = useRef(null)
    const history = useHistory()

    useEffect(()=>{
        if (window.outerWidth < 1050) {
            setVisibleNav(false)
        }
        return window.outerWidth > 1050 && setVisibleNav(true)
    }, visibleNav)

    useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);

            return ()=>{
                document.removeEventListener('mousedown', handleClickOutside);
            }
        }, [])

        function handleClickOutside(e){
            if (window.outerWidth < 1050) {
                const {current : wrap} = wrapperRef;
                if(wrap && !wrap.contains(e.target)){
                    setVisibleNav(false);
                }
            }
        }

        const [navStyler, setNavStyler] = useState({
            width: window.innerWidth < 1050 ? '0rem' : window.innerWidth <= 900 ? '70%' : '30rem'
        })
        const [userProfileStyler, setUserProfileStyler] = useState({
            right : '-5rem',
            visibility : 'hidden'
        })
        const styles = {
            transition : 'width 300ms ease',
            width : navStyler.width
        }

        const handleNavStyle = () => {
            if (navStyler.width === '0rem') { 
                setNavStyler({
                    width : window.innerWidth <= 900 ? '70%' : '30rem'
                })
            }else{
                setNavStyler({width : '0rem'})
            }
        }

        useEffect(() => {
            document.addEventListener('mousedown', handle_Click_Outside);

            return ()=>{
                document.removeEventListener('mousedown', handle_Click_Outside);
            }
        }, [])

        function handle_Click_Outside(e){
            if (window.innerWidth < 1050) {
                const {current : wrap} = wrapperRef;
                if(wrap && !wrap.contains(e.target)){
                    setNavStyler({width : '0rem'})
                }
            }
        }

        useEffect(() => {
            document.addEventListener('mousedown', removeProfileBoards);

            return ()=>{
                document.removeEventListener('mousedown', removeProfileBoards);
            }
        }, [])

        

        const userProfileStyles = {
            right : userProfileStyler.right,
            visibility : userProfileStyler.visibility,
        }

        const showUserProfile = ()=>{
            setUserProfileStyler({
                right : '0.5rem',
                visibility : 'visible'
            })
        }

        const removeProfileBoard = ()=>{
            setUserProfileStyler({
                right : '-5rem',
                visibility : 'hidden'
            })
        }

        function removeProfileBoards(e){
                const {current : wrap} = wrapper_Ref;
                if(wrap && !wrap.contains(e.target)){
                    removeProfileBoard()
                }
        }

        const innerLogoContainer = {
            width: '7rem',
            height: '7rem',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundImage: `url(${user.logoURL})`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            margin : '0.5rem auto 0',
        }

        const logOutUser = async ()=>{
            await baseURL.get('/users/logout')
            .then(async res => {
                await login(res.data)
                history.push('/login')
            })
        }
    
    return (
        <div className="NavBarElement" style={{...styles}}>
            <div className="hamburger">
                <i className="fas fa-bars fa-lg" onClick={handleNavStyle}></i>
                <div className="userLogoContainer" style={{
                    backgroundImage : `url(${user?.logoURL})`
                }} onClick={showUserProfile}>
                </div>
                <div className="userProfile" style={userProfileStyles} ref={wrapper_Ref}>
                    <div className='userProfileTop'>
                        <i className="fas fa-times fa-lg" onClick={removeProfileBoard}></i>
                        <div className="userLogoContainer innerLogoContainer" style={{
                            backgroundImage: `url(${user?.logoURL})`
                        }} onClick={showUserProfile}></div>
                        <div className="companyDetails">
                            <h3 className='companyName'>{user.companyName.slice(0, 20)}...</h3>
                            <p>{user.userEmail}</p>
                        </div>

                        <div className="accountSettings">
                            <i  class="fas fa-cog"onClick={() => {
                                removeProfileBoard()
                                history.push(`/users/${user?.userID}/account-settings`)
                            }}><span>Account Settings</span></i>

                            <i class="fas fa-sign-out-alt" onClick={logOutUser}><span>Log Out</span></i>
                        </div>

                    </div>
                </div>
            </div>
            
                <div className='NavBar' ref={wrapperRef}>
                    <header className='header'>
                        {/* <p className="link">
                            <a href="https://api.whatsapp.com/message/NMRLROUT6FKQM1">Have difficulties? <br/> Tell us on WhatsApp (click)</a>
                        </p> */}
                    </header>
                    <nav className='nav'>
                        <div className="buttonCont">
                            <button className="addNew" onClick={click}>Add New</button>
                        </div>
                        <ul className='nav-list'>
                            <li className="nav-item"><Link to='/'>Dashboard</Link></li>
                            <li className='nav-item income'>
                                <span onClick={() =>{setViewIncomeTabs(!viewIncomeTabs)}}>Income:</span>
                                {
                                    !viewIncomeTabs ? <i class="fas fa-chevron-right" onClick={() =>{setViewIncomeTabs(true)}}></i> : <i class="fas fa-chevron-down" onClick={() =>{setViewIncomeTabs(false)}}></i>
                                }
                                <ul className={viewIncomeTabs ? 'options' : 'navOptions'}>
                                    <li className='option'>
                                        <Link to='/sales'>Sales Dashboard</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/invoices'>Sales Invoices</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/receipts'>Sales Receipts</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/credit-notes'>Sales Returns</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/quotes'>Quotes</Link>
                                    </li>
                                </ul>
                            </li>

                            <li className='nav-item'>
                                <span onClick={() =>{setViewExpenditureTabs(!viewExpenditureTabs)}}>Expenditure:</span>
                                {
                                    !viewExpenditureTabs ? <i class="fas fa-chevron-right" onClick={() =>{setViewExpenditureTabs(true)}}></i> : <i class="fas fa-chevron-down" onClick={() =>{setViewExpenditureTabs(false)}}></i>
                                }
                                <ul className={viewExpenditureTabs ? 'options' : 'navOptions'}>
                                    <li className='option'>
                                        <Link to='/purchases'>Purchases Dashboard</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/purchase-invoices'>Purchase Invoices</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/purchase-receipts'>Purchase Receipts</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/purchase-orders'>Purchase Orders</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/purchase-returns'>Purchase Returns</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/expenses'>Other Expenses</Link>
                                    </li>
                                </ul>
                            </li>

                            <li className='nav-item'>
                                <span onClick={() =>{setViewCustTabs(!viewCustTabs)}}>Third Party:</span>
                                {
                                    !viewCustTabs ? <i class="fas fa-chevron-right" onClick={() =>{setViewCustTabs(true)}}></i> : <i class="fas fa-chevron-down" onClick={() =>{setViewCustTabs(false)}}></i>
                                }
                                <ul className={viewCustTabs ? 'options' : 'navOptions'}>
                                    <li className='option'>
                                        <Link to='/suppliers'>Suppliers</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/customers'>Customers</Link>
                                    </li>
                                </ul>
                            </li>

                            <li className='nav-item'>
                                <Link to='/inventories'>Inventory</Link>
                            </li>

                            <li className='nav-item'>
                                <Link to='/treasury'>Treasury</Link>
                            </li>

                            {/* <li className='nav-item'>
                                <Link to='/capital-and-fixed-assets'>Fixed Assets & Capital</Link>
                            </li> */}

                            <li className='nav-item'>
                                <Link to='/reports'>
                                    Reports
                                </Link>
                                
                            </li>
                        </ul>
                        
                    </nav>
                    
                </div>
        </div>
    )
}

export default Nav
