import Link from 'next/link';
import React, { useContext } from 'react'
import { MdStore, MdAccountCircle, MdFavorite, MdPets } from "react-icons/md";
import { AuthContext } from '../../Context/AuthContext'

const BottomNavigation = (props) => {

    const { setShowAuthModal, isLoggedIn } = useContext(AuthContext)

    return (
        <div className="bottom-navigation">

            <div className="mx-auto">
                <div className="flex justify-center items-center text-gray-400 text-2xl">
                    <div className="p-4">
                        <a href="index.html" className="btn btn-link-default active">
                            <MdStore className='footer-icons' />
                        </a>
                    </div>
                    <div className="p-4">
                        <a href="statistics.html" className="btn btn-link-default">
                            <MdPets className='footer-icons' />
                        </a>
                    </div>
                    <div className="p-4">
                        <Link href="/cart">
                            <div className="btn btn-default shadow centerbutton bg-theme cursor-pointer">
                                <img src="/img/icons/cart.png" alt="" />
                            </div>
                        </Link>
                    </div>
                    <div className="p-4">
                        <a href="favorite-products.html" className="btn btn-link-default">
                            <MdFavorite className='footer-icons' />
                        </a>
                    </div>
                    <div className="p-4">
                        {
                            isLoggedIn ?
                                <Link href='/profile'>
                                    <div className="btn btn-link-default">
                                        <MdAccountCircle className='footer-icons' />
                                    </div>
                                </Link> :
                                <div onClick={() => setShowAuthModal(true)} className="btn btn-link-default">
                                    <MdAccountCircle className='footer-icons' />
                                </div>
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default BottomNavigation