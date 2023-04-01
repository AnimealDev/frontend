import axios from 'axios';
import { useState, useEffect } from 'react'
import BannerSection from "../Components/HomeComponents/BannerSection";
import Brands from "../Components/HomeComponents/Brands";
import ProductRow from "../Components/HomeComponents/ProductRow";
import ShopByPet from "../Components/HomeComponents/ShopByPet";
import Head from 'next/head'




export default function Home(props) {

  const [animals, setAnimals] = useState()
  const [topProducts, setTopProducts] = useState()
  const [customerFav, setCustomerFav] = useState()
  const [expertPick, setExpertPick] = useState()
  const [brands, setBrands] = useState()
  useEffect(() => {

    let endpoints = [
      `${process.env.NEXT_PUBLIC_API_URI}/getcategories`,
      `${process.env.NEXT_PUBLIC_API_URI}/topratedproducts/get/data`,
      `${process.env.NEXT_PUBLIC_API_URI}/customerfavorite/get/data`,
      `${process.env.NEXT_PUBLIC_API_URI}/pickedbyexperts/get/data`,
      `${process.env.NEXT_PUBLIC_API_URI}/brand/homepagebrand`
    ];

    axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(res => {
        setAnimals(res[0].data.category_level1);
        setTopProducts(res[1].data.topRatedProducts)
        setCustomerFav(res[2].data.customerFavoriteProducts)
        setExpertPick(res[3].data.pickedByExpertsProducts)
        setBrands(res[4].data.homePageBrand)
      })
      .catch(err => console.log(err))
  }, []);

  return (

    <div className="homepage mt-16 lg:mt-0">

      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
      </Head>

      {/* BANNER SECTION */}
      <BannerSection banners={props.banners} />

      {/* SHOP BY PET */}
      <ShopByPet animals={animals} />

      {/* TOP PRODUCTS */}
      <ProductRow title="Top Products" products={topProducts} />

      {/* CUSTOMER FAVORITES */}
      <ProductRow title="Customer Favorites" products={expertPick} />

      {/* TOP SUPPLIES */}
      <ProductRow title="Top Supplies" products={customerFav} />

      {/* CTA */}

      {/* BRANDS */}
      <Brands brands={brands} title={"Popular Brands"} />

    </div>

  )

}

export async function getServerSideProps(context) {

  let [metaData, banners] = await Promise.all[
    axios.post(
      `${process.env.NEXT_PUBLIC_API_URI}/metaurl/post/data`,
      {
        slug: "https://animeal.in/"
      }
    ),
    axios.get(
      `https://cms.animeal.in/api/banners?populate=*`,
    )
  ]
  return {
    props: {
      title: metaData.data.success.meta_title,
      description: metaData.data.success.meta_description,
      banners: banners.data
    }
  }
}
