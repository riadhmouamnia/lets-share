import Link from "next/link";
import { useTranslation } from "next-i18next";
import React from "react";

import ProductCard from "../ProductCard";
import ClearFilterButton from "../ProductFiltering/ClearFilterButton";
import LocationFilter from "../ProductFiltering/LocationFilter";
import SearchBar from "../SearchBar";

function AllProductsContainer({ items, queryParams }) {
  const { t } = useTranslation();
  // const categories = getAllCategories(t);
  return (
    <div>
      {/* This is Categories Section */}
      {/* <div className='relative md:h-[75vh] h-[80vh] overflow-x-hidden w-full'>
        <Carousel t={t} items={categories} queryParams={queryParams} />
      </div> */}
      {/* <SliderRow categories={categories} title={t("productsPage:all")} /> */}
      {/* This is for Searchbar & Product Filtering */}
      <div className='flex flex-col md:flex-row gap-4 justify-between items-center px-10 mt-16'>
        <SearchBar t={t} queryParams={queryParams} />
        <LocationFilter t={t} queryParams={queryParams} />
        <Link
          href='/products/create'
          className='btn w-full md:w-40 bg-red-500 text-white hover:bg-green-900 btn-sm px-4 rounded-xl'
        >
          {t("common:buttons:addItem")}
        </Link>
        <ClearFilterButton t={t} />
      </div>
      {/* Section for Product Cards */}
      <h1
        className='text-2xl w-full font-semibold text-center my-16'
        id='products'
      >
        {t("productsPage:productsList")}
      </h1>
      <div className='flex flex-wrap gap-4 items-center justify-center w-full'>
        {items.map((item) => (
          <Link
            key={item.id}
            href={{
              pathname: `/products/${item.id}`,
            }}
          >
            <ProductCard
              title={item.title}
              listingType={t(`addItem:${item.listingType}`)}
              category={t(`categories:${item.category}`)}
              location={t(`states:${item.location}`)}
              imageUrl={item.images[0]}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllProductsContainer;
