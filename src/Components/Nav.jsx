import React, { useEffect, useState, useRef} from 'react'
import './Nav.css'
import {Link} from 'react-router-dom'


function Nav({click}) {
    
    const [visibleNav, setVisibleNav] = useState(true)
    const [viewIncomeTabs, setViewIncomeTabs] = useState(false)
    const [viewExpenditureTabs, setViewExpenditureTabs] = useState(false)
    const [viewCustTabs, setViewCustTabs] = useState(false)
    const wrapperRef = useRef(null)

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
            width: window.innerWidth < 1050 ? '0rem' : window.innerWidth <= 900 ? '20rem' : '40rem'
        })
        const styles = {
            transition : 'width 1s ease',
            width : navStyler.width
        }

        const handleNavStyle = () => {
            if (navStyler.width === '0rem') { 
                setNavStyler({
                    width : window.innerWidth <= 900 ? '25rem' : '40rem'
                })
            }else{
                setNavStyler({width : '0rem'})
            }
        }
    
    return (
        <div className="NavBarElement" style={{...styles}}>
            <div className="hamburger">
                <i className="fas fa-bars fa-lg" onClick={handleNavStyle}></i>
            </div>
            {/* {
                visibleNav && */}
                <div className='NavBar' ref={wrapperRef}>
                    <header className='header'>
                        
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

                            <li className='nav-item'>
                                <Link to='/capital-and-fixed-assets'>Fixed Assets & Capital</Link>
                            </li>

                            <li className='nav-item'>
                                <Link to='/reports'>
                                    Reports
                                </Link>
                                
                            </li>
                        </ul>
                        
                    </nav>
                    
                </div>
            {/* } */}
        </div>
    )
}

export default Nav
