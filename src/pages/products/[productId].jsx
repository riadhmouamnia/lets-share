import { withTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { fetchCollection } from "@/lib/fetchCollection";
import fetchFirebaseDoc from "@/lib/fetchFirebaseDoc";
import { fetchItemsByCategory } from "@/lib/fetchItemsByCategory";
import fetchUserInfo from "@/lib/fetchUserInfo";
import { getLocationName } from "@/lib/helpers";

import Container from "@/components/container";
import ProductCard from "@/components/ProductCard";
import SingleProductCard from "@/components/SingleProductCard";

function ProductDetails({ t, product, userInfo, relatedProducts }) {
  const translatedLocation = t(`states:${product.location}`);
  const loctionName = getLocationName(translatedLocation);
  return (
    <>
      <section className='lg:flex lg:min-h-screen lg:justify-center lg:items-center'>
        <SingleProductCard
          title={product.title}
          description={product.description}
          location={loctionName}
          listingType={t(`addItem:${product.listingType}`)}
          category={t(`categories:${product.category}`)}
          ceatedAt='10/10/2023'
          images={product.images}
          username={userInfo.name}
          email={userInfo.email}
          phone={userInfo.phone}
        />
      </section>
      <h1 className='font-bold text-3xl m-4 text-center'>Related Products</h1>
      <Container className='flex justify-center items-center gap-4 m-4'>
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.title}
            title={product.title}
            listingType={t(`addItem:${product.listingType}`)}
            category={t(`category:${product.category}`)}
            location={t(`states:${product.location}`)}
            imageUrl={product.images[0]}
          />
        ))}
      </Container>
    </>
  );
}
export default withTranslation("ProductDetails")(ProductDetails);

export async function getStaticPaths({ locales }) {
  const products = await fetchCollection("items");
  const paths = [];

  products.forEach((product) => {
    locales.forEach((locale) => {
      paths.push({
        params: { productId: product.id.toString() },
        locale: locale,
      });
    });
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params, locale }) {
  const { productId } = params;
  const product = await fetchFirebaseDoc("items", productId);
  const relatedProducts = await fetchItemsByCategory("items", product.category);
  const userInfo = await fetchUserInfo(product.uid);
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "states",
        "categories",
        "addItem",
      ])),
      product,
      userInfo,
      relatedProducts,
    },
    revalidate: 10,
  };
}
