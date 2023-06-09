import Link from 'next/link'
import React from 'react'

const SubCategoryBox = (props) => {

    return (
        <Link href={`/${props.animal}/${props.category}/${props.subcategory.attributes.slug}`} >
            <div className='subcategory-box flex items-center p-3 rounded-lg cursor-pointer'>
                <img src={props.subcategory.attributes.icon.data ? props.subcategory.attributes.icon.url : '/img/category-placeholder.webp'} alt="" className='h-20' />
                <h1 className='text-sm font-medium ml-2'>{props.subcategory.attributes.name}</h1>
            </div>
        </Link>
    )
}

export default SubCategoryBox