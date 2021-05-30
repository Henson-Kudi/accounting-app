import React, { useEffect, useState, useRef} from 'react'
import './Nav.css'
import {Link} from 'react-router-dom'
import AddReview from './AddReview'

function Nav() {
    const [addReview, setAddReview] = useState(false)
    
    return (
        <div className='NavBar'>
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
    )
}

export default Nav
