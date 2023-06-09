import React, { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import { BsUnlockFill, BsFillPatchQuestionFill, BsFileRichtextFill } from 'react-icons/bs'
import { MdPets, MdLoop } from 'react-icons/md'
import { FaFileContract } from 'react-icons/fa'
import Link from 'next/link'

const Sidebar = () => {

    const { userDetails, isLoggedIn } = useContext(AuthContext)

    return (
        <div className="sidebar">
            <div className="text-center">
                <div className="figure-menu shadow">
                    {
                        isLoggedIn ?
                            <figure><img src={`${userDetails && userDetails.proimg ? userDetails.proimg : '/img/user.webp'}`} alt="" /></figure> :
                            <figure><img src={`${userDetails && userDetails.proimg ? userDetails.proimg : '/img/user.webp'}`} alt="" /></figure>
                    }
                </div>
                <h5 className="mb-1 text-lg font-semibold">{
                    userDetails && userDetails.name ?
                        `Hello! ${userDetails.name}` :
                        'Welcome To Animeal'
                }</h5>
            </div>
            <br />

            <ul className='pl-5'>
                <a href='/about'><li className='flex items-center font-medium text-white gap-2 p-2 my-3 cursor-pointer'><MdPets /> About Us</li></a>
                <a href='/faq'><li className='flex items-center font-medium text-white gap-2 p-2 my-3 cursor-pointer'><BsFillPatchQuestionFill /> FAQ</li></a>
                <a href='/privacy-policy'><li className='flex items-center font-medium text-white gap-2 p-2 my-3 cursor-pointer'><BsUnlockFill /> Privacy Policy</li></a>
                <a href='refund-cancelation'><li className='flex items-center font-medium text-white gap-2 p-2 my-3 cursor-pointer'><MdLoop /> Refund & Cancelation</li></a>
                <a href='/terms-conditions'><li className='flex items-center font-medium text-white gap-2 p-2 my-3 cursor-pointer'><FaFileContract /> Terms & Conditions</li></a>
                <a href='https://blog.animeal.in/'><li className='flex items-center font-medium text-white gap-2 p-2 my-3 cursor-pointer'><BsFileRichtextFill /> Blogs</li></a>
            </ul>

        </div>
    )
}

export default Sidebar