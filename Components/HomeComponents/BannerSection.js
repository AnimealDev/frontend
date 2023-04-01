import React, { useContext, useState } from 'react'
import Link from 'next/link'
import PrescriptionUpload from './PrescriptionUpload'
import { AuthContext } from '../../Context/AuthContext'
import UploadStatusModal from './UploadStatusModal'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from "swiper"

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import 'swiper/css/pagination';
import BannerBox from './BannerBox'

const BannerSection = (props) => {
    const { isMobile } = useContext(AuthContext)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
    const [status, setStatus] = useState()

    const handleClose = (status) => {
        setStatus(status)
        setIsUploadModalOpen(false)
        setIsStatusModalOpen(true)
    }

    return (
        <div className="banner-section lg:grid lg:grid-cols-12 lg:gap-4 justify-between container">

            {/* POPULAR CATEGORIES */}
            <div className="hidden lg:block popular-categories bg-white shadow rounded-lg p-3 h-full text-sm col-span-2">
                <h1 className='font-semibold'>Popular Categories</h1>

                <Link href='/dog/food'>
                    <div className="popular-category-item flex items-center mt-6 gap-2 font-medium cursor-pointer">
                        <img src="/img/icons/dog.webp" alt="" className='h-6' />
                        Dog Food
                    </div>
                </Link>
                <Link href='/cat/food'>
                    <div className="popular-category-item flex items-center mt-6 gap-2  font-medium cursor-pointer">
                        <img src="/img/icons/cat.webp" alt="" className='h-6' />
                        Cat Food
                    </div>
                </Link>
                <Link href='/dog/medicine'>
                    <div className="popular-category-item flex items-center mt-6 gap-2  font-medium cursor-pointer">
                        <img src="/img/icons/medicines.webp" alt="" className='h-6' />
                        Dog Medicine
                    </div>
                </Link>
                <Link href='/dog/treats'>
                    <div className="popular-category-item flex items-center mt-6 gap-2  font-medium cursor-pointer">
                        <img src="/img/icons/treats.webp" alt="" className='h-6' />
                        Dog Treats
                    </div>
                </Link>
                <Link href='/cat/supplies'>
                    <div className="popular-category-item flex items-center mt-6 gap-2  font-medium cursor-pointer">
                        <img src="/img/icons/toys.webp" alt="" className='h-6' />
                        Cat Supplies
                    </div>
                </Link>
                <Link href='/dog/supplements'>
                    <div className="popular-category-item flex items-center mt-6 gap-2  font-medium cursor-pointer">
                        <img src="/img/icons/supplements.webp" alt="" className='h-6' />
                        Dog Supplements
                    </div>
                </Link>
                <Link href='/cat/treats'>
                    <div className="popular-category-item flex items-center mt-6 gap-2  font-medium cursor-pointer">
                        <img src="/img/icons/premium-food.webp" alt="" className='h-6' />
                        Cat Treats
                    </div>
                </Link>
                <Link href='/dog/supplies'>
                    <div className="popular-category-item flex items-center mt-6 gap-2  font-medium cursor-pointer">
                        <img src="/img/icons/cat-wet-food.webp" alt="" className='h-6' />
                        Dog Supplies
                    </div>
                </Link>
            </div>

            {/* MAIN BANNER */}
            <div className="main-banner col-span-10">
                <Swiper
                    slidesPerView={1}
                    className=''
                    spaceBetween={0}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, Pagination]}
                    loop={true}
                    pagination={{
                        dynamicBullets: true,
                        clickable: true
                    }}
                >
                    {/* <SwiperSlide>
                        <BannerBox link="/shop?slug=food" image="/img/banner-0.jpeg" heading="" button="" />
                    </SwiperSlide> */}
                    {
                        props.banners.data.map((banner, index) => {
                            return <SwiperSlide>
                                <BannerBox link={banner.attributes.url} image={banner.attributes.image.data.attributes.url} heading={banner.attributes.title} button={banner.attributes.buttontext} />
                            </SwiperSlide>
                        })
                    }
                </Swiper>
                {/* 
                <Swiper
                    slidesPerView={1}
                    className=''
                    spaceBetween={0}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay]}
                >
                    <SwiperSlide>
                        <BannerBox link="/shop?slug=veterinary" image="/img/banner-2.webp" heading="Vaccines and <br/> Medical Supplies" button="Shop Now" />
                    </SwiperSlide>
                </Swiper> */}
            </div>

            {/* <div className="flex col-span-5 gap-1 lg:gap-4 lg:mt-0 mt-2">
         
                <div className="relative h-90 lg:w-3/6 w-3/6 text-center">
                    <img src="/img/3rd.webp" alt="" className='h-full object-cover rounded-lg w-full shadow' />
                    <h2 className="text-white xl:text-xl font-bold absolute top-4 xl:top-10 left-0 w-full px-2">Send us the prescription and we'll have it delivered</h2>
                    <Link href="/upload-prescription" >
                        <button className='bg-amber-900 hover:bg-transparent transition-all border-2 border-white p-2 xl:px-4 xl:py-2 text-white absolute bottom-4 xl:bottom-96 left-10 xl:left-20 font-semibold rounded-lg text-xs xl:text-base'>
                            Upload Now
                        </button>
                    </Link>
                </div>

       
                <div className="relative h-90 w-3/6 lg:w-3/6 text-center">
                    <img src="/img/4th.webp" alt="" className='h-full object-cover rounded-lg w-full shadow' />
                    <h2 className="text-white text-xl font-bold absolute bottom-10 left-0 w-full px-2">Pathology <br /> <span className='text-3xl'>Coming Soon</span> </h2>
                </div>
            </div> */}
            <PrescriptionUpload isOpen={isUploadModalOpen} isMobile={isMobile} close={() => setIsUploadModalOpen(false)} showStatus={handleClose} />
            <UploadStatusModal isOpen={isStatusModalOpen} close={() => setIsStatusModalOpen(false)} status={status} />
        </div>
    )
}

export default BannerSection