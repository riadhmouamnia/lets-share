import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import ReactPaginate from "react-paginate";

function Pagination({ page, queryParams, totalPages }) {
  const router = useRouter();
  const { i18n, t } = useTranslation();

  const handlePageClick = (page) => {
    router.push(
      {
        pathname: `/items`,
        query: { ...queryParams, page: page.selected + 1 },
      },
      undefined,
      { scroll: false }
    );
  };

  return (
    <div
      className={`flex items-center ${
        i18n?.language === "ar" ? "flex-row-reverse" : ""
      } justify-center md:justify-between flex-wrap gap-4`}
    >
      <ReactPaginate
        previousLabel={
          <>
            <BiLeftArrow className='hidden md:flex' />
            {t("common:buttons:prevButton")}
          </>
        }
        nextLabel={
          <>
            {t("common:buttons:nextButton")}
            <BiRightArrow className='hidden md:flex' />
          </>
        }
        breakLabel='...'
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName='join'
        pageLinkClassName='join-item btn btn-sm hover:btn-secondary hover:bg-opacity-40 hover:text-current'
        previousLinkClassName={`${
          page === 1 && "btn-disabled"
        } join-item btn btn-sm hover:btn-secondary hover:bg-opacity-40 hover:text-current`}
        nextLinkClassName={`${page === totalPages && "btn-disabled"} ${
          !totalPages && "btn-disabled"
        } join-item btn btn-sm hover:btn-secondary hover:bg-opacity-40 hover:text-current`}
        breakLinkClassName='join-item btn btn-sm hover:btn-secondary hover:bg-opacity-40'
        activeClassName={`${queryParams.page && "btn-secondary bg-opacity-40"}`}
      />
      <div>
        <p className='font-normal opacity-50 text-sm tracking-wide'>
          {t("itemsPage:page")}: {!totalPages ? 0 : page} {t("itemsPage:of")}{" "}
          {totalPages}
        </p>
      </div>
    </div>
  );
}

export default Pagination;
