import { withTranslation } from "next-i18next";

import { fetchCollection } from "@/lib/fetchCollection";

import AllProductsContainer from "@/components/AllProductsContainer/AllProductsContainer";

function ProductsPage({ items, queryParams }) {
  return (
    <main className='mb-10'>
      <AllProductsContainer queryParams={queryParams} items={items} />
    </main>
  );
}

export default withTranslation([
  "common",
  "productsPage",
  "states",
  "categories",
  "addItem",
])(ProductsPage);

export async function getServerSideProps({ query }) {
  const queryParams = query;
  const items = await fetchCollection("items", queryParams);
  return {
    props: {
      // ...(await serverSideTranslations(locale, [
      //   "common",
      //   "states",
      //   "productsPage",
      //   "categories",
      //   "addItem",
      // ])),
      items,
      queryParams,
    },
  };
}
