import React, { useEffect, useState, useRef} from 'react'
import './Nav.css'
import {Link} from 'react-router-dom'
import AddReview from './AddReview'

function Nav() {
    const [addReview, setAddReview] = useState(false)
    const [visibleNav, setVisibleNav] = useState(false)
    const wrapperRef = useRef(null)

    window.onload = () =>{
        if (window.outerWidth > 900) {
            setVisibleNav(true)
        }
    };

    useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);

            return ()=>{
                document.removeEventListener('mousedown', handleClickOutside);
            }
        }, [])

        function handleClickOutside(e){
            if (window.outerWidth < 900) {
                const {current : wrap} = wrapperRef;
                if(wrap && !wrap.contains(e.target)){
                    setVisibleNav(false);
                }
            }
        }

    
    return (
        <div className="NavBarElement">
            <div className="hamburger">
                <i className="fas fa-bars fa-lg" onClick={() =>{setVisibleNav(!visibleNav)}}></i>
            </div>
            {
                visibleNav &&
                <div className='NavBar' ref={wrapperRef}>
                    <header className='header'>
                        <button className="button specialReviewButton" onClick={() => {setAddReview(true)}}>Please Add your Review Here 🙏</button>
                    </header>
                    <nav className='nav'>
                        <ul className='nav-list'>
                            <li className='nav-item income'>
                                Incomes
                                <ul className='options'>
                                    <li className='option'>
                                        <Link to='/sales'>Sales</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/customers'>Customers</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/inventories'>Inventory</Link>
                                    </li>
                                </ul>
                            </li>

                            <li className='nav-item'>
                                Expenditures
                                <ul className='options'>
                                    <li className='option'>
                                        <Link to='/purchases'>Purchases</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/suppliers'>Suppliers</Link>
                                    </li>
                                    <li className='option'>
                                        <Link to='/expenses'>Expenses</Link>
                                    </li>
                                </ul>
                            </li>

                            <li className='nav-item'>
                                <Link to='/inventories'>Inventory</Link>
                            </li>

                            <li className='nav-item'>
                                <Link to='/funds'>Bank, Cash ...</Link>
                            </li>

                            <li className='nav-item'>
                                <Link to='/capital-and-fixed-assets'>Fixed Assets & Capital</Link>
                            </li>

                            <li className='nav-item'>
                                <Link to='/dashboard'>
                                    Reports Dashboard
                                </Link>
                                
                            </li>
                        </ul>
                        
                    </nav>
                    {
                        addReview && 
                        <AddReview
                            onClick={()=>{setAddReview(false)}}
                        />
                    }

                </div>
            }
        </div>
    )
}

export default Nav
