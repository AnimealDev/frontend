import React, { useState, useContext, useEffect } from 'react';
import Rating from '../../Components/ProductBox/Rating';
import Breadcrumb from '../../Components/ProductPageComponents/Breadcrumb';
import { BiRupee, } from 'react-icons/bi';
import { RiShoppingCartLine, RiHeart3Line, RiHeart3Fill } from 'react-icons/ri';
import { HiMinusSm, HiPlusSm, HiDotsHorizontal } from 'react-icons/hi';
import { Input, Collapse, Text } from '@nextui-org/react';
import ProductRow from '../../Components/HomeComponents/ProductRow'
import Reviews from '../../Components/ProductPageComponents/Reviews';
import Link from 'next/link';
import { AuthContext } from '../../Context/AuthContext'
import { CartContext } from '../../Context/CartContext'
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper";
import toast, { Toaster } from 'react-hot-toast';
import getWeight from '../../Helpers/GetWeight'
import Head from 'next/head'
import axios from 'axios';
import qs from 'qs'


import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";


const Product = (props) => {
    console.log("🚀 ~ file: [slug].js:29 ~ Product ~ props:", props.product)

    const [inWishlist, setInWishlist] = useState(false)
    const [inCart, setInCart] = useState(false)
    const [productImages, setProductImages] = useState([])
    const [checkPinCode, setCheckPinCode] = useState('')
    const [isDeliverable, setIsDeliverable] = useState()
    const [similarproducts, setSimilarProducts] = useState()
    const [variants, setVariants] = useState()

    const { setShowAuthModal, isLoggedIn, token, userDetails } = useContext(AuthContext)
    const { addToCart, setRefreshCart, refreshCart } = useContext(CartContext)

    const [thumbsSwiper, setThumbsSwiper] = useState(null);


    useEffect(() => {

        if (userDetails) {
            checkInCart()
            checkInWishlist()
        } else {
            // check kar local cart mei hai kya
            if (JSON.parse(localStorage.getItem('unauthcart'))) {
                let localCart = JSON.parse(localStorage.getItem('unauthcart'))
                let findItem = localCart.filter(item => item[0].product_id == props.product.attributes.product_id)
                if (findItem && findItem.length > 0) {
                    setInCart(true)
                } else {
                    setInCart(false)
                }
            }

        }
        // set product images in one state
        if (props.product.attributes.display_image.data && props.product.attributes.gallery.data) {
            setProductImages([props.product.attributes.display_image.data, ...props.product.attributes.gallery.data])
        } else if (props.product.attributes.display_image.data) {
            setProductImages([props.product.attributes.display_image.data])
        } else {
            setProductImages([])
        }

        // get similar products
        getSimilarProducts()

        // get variants
        if (props.product.attributes.variant.data) {
            getVariants()
        }

    }, [token, props])


    const getSimilarProducts = async () => {

        let animals = props.product.attributes.animals.data.map(animal => animal.attributes.slug)
        let categories = props.product.attributes.categories.data.map(category => category.attributes.slug)
        let subcategories = props.product.attributes.subcategories.data.map(subcategory => subcategory.attributes.slug)

        let query = qs.stringify({
            filters: {
                animals: {
                    slug: {
                        $in: animals
                    }
                },
                categories: {
                    slug: {
                        $in: categories
                    }
                },
                subcategories: {
                    slug: {
                        $in: subcategories
                    }
                },
                slug: {
                    $ne: props.product.attributes.slug
                }
            },
            populate: ['animals', 'categories']
        }, {
            encodeValuesOnly: true, // prettify URL
        })

        let productData = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/products?${query}`)
        setSimilarProducts([...productData.data.data])
    }

    const getVariants = async () => {
        let query = qs.stringify({
            filters: {
                variant: {
                    id: {
                        $eq: props.product.attributes.variant.data.id
                    }
                },
                slug: {
                    $ne: props.product.attributes.slug
                }
            },
            populate: ['animals', 'categories']
        }, {
            encodeValuesOnly: true, // prettify URL
        })

        let productData = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/products?${query}`)
        console.log("productData", productData)
        setVariants([...productData.data.data])
    }

    const checkInCart = () => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URI}/carts?filters[user][id]=${userDetails.id}`,
            {
                headers: {
                    Authorization: token
                }
            }
        )
            .then(res => {
                console.log(res.data, "zed")
            })
            .catch(err => alert(err))
    }

    const checkInWishlist = () => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URI}/wishlists?filters[user][id]=${userDetails.id}&populate=*`,
            {
                headers: {
                    Authorization: token
                }
            }
        )
            .then(res => {
                console.log(res.data, "zed")
            })
            .catch(err => alert(err))
    }

    const cartClicked = () => {
        if (isLoggedIn) {
            axios.post(`${process.env.NEXT_PUBLIC_API_URI}/carts/`,
                {
                    product_id: props.product.attributes.product_id,
                    quantity: props.product.attributes.minimum_quantity
                },
                {
                    headers: {
                        Authorization: token
                    }
                })
                .then(res => {
                    console.log("🚀 ~ file: [slug].js ~ line 97 ~ cartClicked ~ res", res.data)
                    toast.success('Item added to cart');
                    setInCart(true)
                    addToCart([{
                        ...res.data.success,
                        available_stock: parseInt(props.product.availableStock) - props.product.attributes.minimum_quantity,
                        category: props.product.attributes.category,
                        minimum_quantity: props.product.attributes.minimum_quantity
                    }])
                })
                .catch(err => console.log(err))
        } else {
            // setShowAuthModal(true)
            toast.success('Item added to cart');
            setInCart(true)
            let itemForCart = {
                product_main_id: props.product.attributes.id,
                product_id: props.product.attributes.product_id,
                product_name: props.product.attributes.website_pro_name,
                product_image: props.product.productimages[0] ? props.product.productimages[0].product_image : '',
                product_description: props.product.attributes.shortdescription,
                quantity: props.product.attributes.minimum_quantity,
                product_price: props.product.productPriceApi,
                product_discount: parseInt(props.product.productMrp) - parseInt(props.product.productPriceApi),
                product_offer: props.product.attributes.offer,
                product_total: props.product.productPriceApi,
                product_discount_total: parseInt(props.product.productMrp) - parseInt(props.product.productPriceApi),
                product_weight: props.product.attributes.size,
                updated_at: props.product.attributes.updated_at,
                created_at: props.product.attributes.created_at,
                category: props.product.attributes.category,
                available_stock: parseInt(props.product.attributes.stock),
                minimum_quantity: parseInt(props.product.attributes.minimum_quantity)
            }
            let localCartList = JSON.parse(localStorage.getItem('unauthcart'))
            if (localCartList) {
                localCartList.push([itemForCart])
            } else {
                localCartList = [[itemForCart]]
            }

            localStorage.setItem('unauthcart', JSON.stringify(localCartList))
            setRefreshCart(refreshCart + 1)
        }
    }

    const wishlistClicked = (type) => {
        if (isLoggedIn) {
            if (type == "add") {
                axios.post(`${process.env.NEXT_PUBLIC_API_URI}/wishlists`,
                    {
                        data: {
                            products: [1, 2],
                            user: 1
                        }
                    },
                    {
                        headers: {
                            Authorization: token
                        }
                    })
                    .then(res => {
                        setInWishlist(true)
                    })
                    .catch(err => console.log(err))
            } else {
                axios.delete(`${process.env.NEXT_PUBLIC_API_URI}/wishlists/`,
                    {
                        headers: {
                            Authorization: token
                        }
                    })
                    .then(res => {
                        setInWishlist(false)
                    })
                    .catch(err => console.log(err))
            }

        } else {
            setShowAuthModal(true)
        }
    }

    const checkAvailability = async (e) => {
        e.preventDefault()
        let isAvailable = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/pincodes?filters[pincode][$eq]=${checkPinCode}`)
        if (isAvailable.data.data.length > 0) {
            setIsDeliverable(true)
        } else {
            setIsDeliverable(false)
        }
    }

    return (

        <div className='product-page my-16 xl:my-10'>

            {
                props.metaData ?
                    <Head>
                        <title>{props.metaData.meta_title}</title>
                        <meta name="description" content={props.metaData.meta_description} />
                    </Head> :
                    <Head>
                        <title>{props.product.meta_title}</title>
                        <meta name="description" content={props.product.meta_description} />
                    </Head>
            }

            <div className="lg:flex container gap-20 mb-20">
                {/* PRODUCT IMAGE SLIDER */}
                <div className='rounded-lg lg:w-5/12 single-product-slider'>
                    {/* MAIN SLIDER */}
                    {
                        !productImages || productImages.length === 0 ?
                            <div className='mx-auto bg-white rounded-lg p-4'><img src='/img/product-placeholder.webp' className='h-96 mx-auto' /></div> :
                            <Swiper
                                slidesPerView={1}
                                className='mx-auto h-full main-img-container drop-shadow'
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode, Navigation, Thumbs]}
                            >
                                {
                                    productImages.map((image, index) => {
                                        return (<SwiperSlide key={index} className=''>
                                            <div id='img-container'>
                                                <img src={`${image.attributes.url}`} alt="" id="single-product-image" className='rounded-lg mx-auto bg-white' />
                                            </div>
                                        </SwiperSlide>)
                                    })
                                }
                            </Swiper>
                    }


                    {/* MINI SLIDER */}
                    <Swiper
                        slidesPerView={4}
                        className='mx-auto mt-4 w-6/12 lg:w-9/12'
                        onSwiper={setThumbsSwiper}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        spaceBetween={10}
                    >
                        {
                            productImages.map((image, index) => {
                                return (<SwiperSlide key={index} className=''>
                                    <img src={`${image.attributes.url}`} alt="" className='rounded-lg mx-auto h-12 lg:h-20 border border-gray-200' />
                                </SwiperSlide>)
                            })
                        }
                    </Swiper>
                </div>



                {/* DATA */}
                <div className="product-data flex-1 mt-6 lg:mt-0">
                    {/* <Breadcrumb className="hidden lg:block" /> */}
                    <Link href={`/shop/?slug=${props.product.attributes.subcategories?.data?.attributes?.slug}`}><h3 className="text-xs lg:text-sm text-theme font-semibold cursor-pointer">{props.product.attributes.subcategories?.data?.attributes?.name}</h3></Link>
                    <h1 className="text-base lg:text-3xl font-semibold text-slate-900">
                        {props.product.attributes.name}
                    </h1>

                    <Link href={`/shop/?slug=${props.product.attributes.brand.data?.attributes.slug}`}><p className='text text-slate-600 font-medium my-2 cursor-pointer'>by : {props.product.attributes.brand.data?.attributes.name}</p></Link>
                    {
                        props.product.attributes.categories?.data?.attributes?.slug == 'medicine' ?
                            <div className="flex items-center gap-2 my-2">
                                <img src="/img/icons/rx.webp" className='h-8' alt="" />
                                <p className='text-sm font-semibold text-theme'>Prescription required</p>
                            </div> :
                            <></>
                    }
                    <div className="flex items-center">
                        <Rating value={0} />
                        {/* TODO GET NUMBER OF REVIEWS FROM REVIEWS TABLES */}
                        {/* <p className='text-xs lg:text-base text-slate-600 ml-3 font-medium'> customer reviews</p> */}
                    </div>

                    <div className="flex mt-4 items-center">
                        {
                            props.product.attributes.selling_price == props.product.attributes.mrp ?
                                <></> :
                                <h3 className="text-sm lg:text-base font-medium text-gray-500 flex items-center mr-2 line-through"><BiRupee />{props.product.attributes.mrp}</h3>
                        }
                        <h2 className="text-2xl flex items-center font-semibold"><BiRupee />{props.product.attributes.selling_price}</h2>
                    </div>
                    <p className="text-sm lg:text-base flex items-center mt-2 text-green-700 font-semibold">you save <BiRupee /> {parseInt(props.product.attributes.mrp) - parseInt(props.product.attributes.selling_price)} </p>
                    {/* <p className='text-sm text-slate-600 mt-3 font-medium'>Free 1-3 day shipping on this item.</p> */}

                    <div className="bg-white rounded-lg p-3 mt-3">
                        {
                            props.product.attributes.stock == 0 ?
                                <p className='text-red-500 text-sm lg:text-base font-semibold mb-4'>Out Of Stock</p> :
                                props.product.attributes.stock <= 10 ?
                                    <p className='text-red-500 text-sm lg:text-base font-semibold mb-4'>Only {props.product.attributes.stock} left in stock</p> :
                                    <p className='text-green-700 text-sm lg:text-base font-semibold mb-4'>In stock</p>
                        }

                        <div className="xl:flex items-center xl:w-full  gap-6">
                            <div className='flex items-center gap-3'>
                                <p className="text-xs lg:text-base font-semibold">Deliver to : </p>
                                <form onSubmit={checkAvailability}>
                                    <Input onClearClick={() => { setCheckPinCode(); setIsDeliverable() }} onChange={(e) => setCheckPinCode(e.target.value)} clearable placeholder='check for delivery' type={'number'} />
                                </form>
                            </div>
                            {
                                isDeliverable !== undefined ?
                                    <p className={`text-xs lg:text-base font-semibold ${isDeliverable ? 'text-green-600' : 'text-red-400'}  ml-2 lg:ml-0`}>
                                        {
                                            isDeliverable ?
                                                "will reach you in 24hrs" :
                                                "sorry we are not delivering to your area yet"
                                        }
                                    </p> :
                                    <></>
                            }

                        </div>

                        <div className="flex items-start w-full mt-4">

                            {/* <div className='counter mr-10'>
                                <p className="text-center mb-3 text-sm">Quantity</p>
                                <div className="flex items-center justify-between">
                                    <HiPlusSm className='cursor-pointer bg-slate-200 text-slate-600 text-lg rounded' />
                                    <span className="text-sm mx-4">{count}</span>
                                    <HiMinusSm className='cursor-pointer bg-slate-200 text-slate-600 text-lg rounded' />
                                </div>
                            </div> */}

                            {
                                variants ?
                                    <div className="variations">
                                        <p className="mb-3 text-sm lg:text-base font-medium">Variations</p>
                                        <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
                                            {
                                                variants.map((prod, index) => {
                                                    return (<Link key={index} href={`/product/${prod.attributes.slug}`}>
                                                        <div className="size cursor-pointer bg-slate-100 p-2 text-sm lg:text-base text-center font-medium shadow rounded">
                                                            {prod.attributes.size}
                                                            <br />
                                                            {
                                                                prod.attributes.category.data.attributes.slug == 'food' ?
                                                                    <div className="flex items-center text-sm text-slate-600 mt-2">
                                                                        <BiRupee /> {Math.round(prod.attributes.selling_price / getWeight(prod.attributes.size))} / Kg
                                                                    </div> :
                                                                    <></>
                                                            }

                                                        </div>
                                                    </Link>)
                                                })

                                            }

                                        </div>
                                    </div> :
                                    <></>
                            }



                        </div>

                        <div className="flex gap-4">
                            {
                                props.product.attributes.stock == 0 || props.product.attributes.selling_price == 0 ?
                                    <></> :
                                    inCart ?
                                        <Link href='/cart'>
                                            <button className='bg-theme flex items-center mt-6 py-2 px-2 lg:px-4 rounded shadow text-sm lg:text-base flex-1 lg:flex-none'>
                                                <RiShoppingCartLine className='lg:text-sm mr-2' />
                                                Go To Cart
                                            </button>
                                        </Link>
                                        :
                                        <button onClick={cartClicked} className='bg-theme flex items-center mt-6 py-2 px-2 lg:px-4 rounded shadow text-sm lg:text-base flex-1 lg:flex-none'>
                                            <RiShoppingCartLine className='lg:text-sm mr-2' />
                                            Add To Cart
                                        </button>
                            }

                            {
                                inWishlist ?
                                    <button onClick={() => wishlistClicked('remove')} className='bg-slate-100 flex items-center mt-6 py-2 px-2 lg:px-4 rounded shadow text-slate-600 text-sm lg:text-base flex-1 lg:flex-none'>
                                        <RiHeart3Fill className='text-sm mr-2 text-red-400' />
                                        Wishlisted
                                    </button> :
                                    <button onClick={() => wishlistClicked('add')} className='bg-slate-100 flex items-center mt-6 py-2 px-2 lg:px-4 rounded shadow text-slate-600 text-sm lg:text-base flex-1 lg:flex-none'>
                                        <RiHeart3Line className='text-sm mr-2' />
                                        Add To Wishlist
                                    </button>
                            }
                        </div>

                    </div>


                    <hr className='border-1 border-gray-300 my-6' />

                    {/* <div className="content-box">
                        <p className={`text-justify text-sm leading-5 text-slate-600 mb-0 font-medium max-h-16 hover:max-h-fit overflow-hidden transition-all ease-in-out duration-500`}>
                            {props.product.attributes.shortdescription}
                        </p>
                        <p className="text-sm text-theme">read more..</p>
                    </div> */}
                    {
                        props.product.attributes.shortdescription ?
                            <Collapse title={props.product.attributes.shortdescription.substr(0, 90)} >
                                <p className='text-justify'>
                                    {props.product.attributes.shortdescription}
                                </p>
                            </Collapse> :
                            <></>
                    }


                </div>

            </div>

            {/* RELATED ITEMS */}
            <ProductRow title="Your fur baby might also like this" products={similarproducts} />

            <div className="container">
                <hr className='border-1 border-gray-300 my-10' />
            </div>

            {/* CUSTOMER REVIEW */}
            {/* <Reviews /> */}
            <Toaster />
        </div>
    )
}

export async function getServerSideProps({ query }) {

    let slug = query.slug;

    let productData = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/products?filters[slug][$eq]=${slug}&populate=*`)

    return {
        props: {
            product: productData.data.data[0]
        }
    }
}

export default Product