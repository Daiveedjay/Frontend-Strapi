import Pagination from "@/Pagination";
const PER_PAGE = 5;

import BlogsData from "./blogs.json";

import { motion } from "framer-motion";
import { useRouter } from "next/router";
export default function Home({ blogs, currentPage, pagination }) {
  const router = useRouter();
  console.log(blogs);
  return (
    <div className="container">
      <h1> Blog Header: {currentPage}</h1>

      <motion.div
        key={router.asPath}
        initial="pageInitial"
        animate="pageAnimate"
        exit="pageExit"
        variants={{
          pageInitial: {
            y: "100%",
            opacity: 0,
          },
          pageAnimate: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.5,
            },
          },
          pageExit: {
            y: "100%",
            opacity: 0,
            transition: {
              duration: 0.5,
            },
          },
        }}
      >
        <Pagination
          blogs={blogs}
          currentPage={currentPage}
          pagination={pagination}
          perpage={PER_PAGE}
        />
      </motion.div>
    </div>
  );
}

export async function getServerSideProps({ query: { page = 1 }, res }) {
  const currentPage = +page;

  // Calculate the total number of pages
  const totalEntries = BlogsData.data.length;
  const lastPage = Math.ceil(totalEntries / PER_PAGE);

  // If the current page exceeds the last page, redirect to page 1
  if (currentPage > lastPage) {
    res.setHeader("location", "/?page=1");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  // Calculate start and end indices for pagination
  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  // Extract the required data based on the current page and PER_PAGE value
  const blogs = {
    data: BlogsData.data.slice(start, end),
    meta: BlogsData.meta,
  };

  const { meta } = blogs;
  const pagination = { meta };

  return {
    props: {
      blogs,
      currentPage,
      pagination,
    },
  };
}
