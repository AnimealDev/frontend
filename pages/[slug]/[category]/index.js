import React, { useState, useEffect } from 'react'
import SubCategoryBox from '../../../Components/AnimalPageComponents/SubCategoryBox'
import ProductRow from '../../../Components/HomeComponents/ProductRow'
import AnimalBanner from '../../../Components/AnimalPageComponents/AnimalBanner'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import axios from 'axios'


const index = (props) => {

    const [categoryWiseProducts, setCategoryWiseProducts] = useState()

    useEffect(() => {
        getProductsByCategory()
    }, [props])

    const getProductsByCategory = async () => {
        let allFetchedProducts = []
        for (const category of props.categorylevels) {
            let fetchedProducts = await axios.post(`${process.env.NEXT_PUBLIC_API_URI}/category/level3products/categoryonetwothreewise`, {
                category1: props.animal,
                category2: props.category,
                category3: category.category_name
            })
            allFetchedProducts.push({
                category: category.category_name,
                products: fetchedProducts.data
            })
        }
        setCategoryWiseProducts(allFetchedProducts)
    }

    return (
        <div className='subcategory-page mt-4'>

            {/* Banner */}
            <AnimalBanner image={`/category-banner/${props.banner}`} title={`${props.animal} ${props.category}`} />

            <div className="subcategory-row container my-10">
                <Swiper
                    modules={[Autoplay]}
                    breakpoints={{
                        320: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 40,
                        },
                        1024: {
                            slidesPerView: 5,
                            spaceBetween: 50,
                        },
                    }}
                    autoplay={{ delay: 2000 }}
                >
                    {
                        props.categorylevels && props.categorylevels.map((subcategory, index) => {
                            return <SwiperSlide key={index}><SubCategoryBox subcategory={subcategory} animal={props.animal} category={props.category} /></SwiperSlide>
                        })
                    }
                </Swiper>
            </div>

            {/* CATEGORY */}
            {
                categoryWiseProducts && categoryWiseProducts.map((products, index) => {
                    if (products.products.categoryLevel3WiseProduct && products.products.categoryLevel3WiseProduct.length !== null) {
                        return <ProductRow key={index} title={products.category} products={products.products.categoryLevel3WiseProduct} />
                    }
                })

            }

        </div>
    )
}

export async function getServerSideProps({ query }) {
    let res = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/category/${query.slug}/${query.category}`)
    let bannerRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/banners/getcategorybannerlevel2/${query.slug}/${query.category}`)
    let categorylevels = res.data.categorylevels3;
    let banner = bannerRes.data.categoryLevel2Banner
    return {
        props: {
            categorylevels: categorylevels,
            animal: query.slug,
            category: query.category,
            banner: banner
        }
    }
}

export default index