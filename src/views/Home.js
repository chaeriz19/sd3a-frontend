import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Card from "../components/Card";
import Filter from "../components/Filter";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { HiOutlineChevronUp } from "react-icons/hi";

import Paginator from "../components/Paginator";
import MainLogo from "../components/MainLogo";
import Spinner from "../components/Spinner";
import ApiConnection from "../components/ApiConnection";

export default function Home() {
  // SCROLL FUNCTIONS
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = 200;
      setIsScrolled(window.scrollY > headerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // fetch data en zet in state!
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState();
  const [totalPages, setTotalPages] = useState();
  
  // FILTER SHIT:
  const [filterCurrentType, setFilterCurrentType] = useState("All");
  const [filterCurrentAvailability, setCurrentAvailability] = useState("1");
  const [maxPrice, setMaxPrice] = useState(2500000);
  const [searchTerms, setSearchTerms] = useState("");
  const [mobileFilterToggle, setMobileFilterToggle] = useState(false);
  const [sort, setSort] = useState('up');

  function scrollUp() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const toggleMobileFilter = () => {
    setMobileFilterToggle(!mobileFilterToggle);
  }

  useEffect(() => {

    fetchData();
  }, [currentPage, filterCurrentType, filterCurrentAvailability, maxPrice, sort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sort])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchData = async () => {
    console.log("Fetching data: " + currentPage);
    setLoading(true);
    try {
      const response = await axios.get(`${ApiConnection()}/api/content`, {
        params: {
          page: currentPage,
          type: filterCurrentType,
          availability: filterCurrentAvailability,
          price_max: maxPrice,
          search: searchTerms,
          sort: sort,
        },
      });
      setApiData(response.data.data);
      setTotalResults(response.data.total)
      setTotalPages(response.data.last_page)
    
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full">
      <Header />

      {mobileFilterToggle ? (
        <div className="m-4 h-full">
          <button  onClick={toggleMobileFilter} className="block rounded-md border-0 py-2 pl-3 pr-6 mr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            Close
          </button>
          <Filter 
                setType={setFilterCurrentType} 
                setAvailability={setCurrentAvailability} 
                setMaxPrice={setMaxPrice}
                type={filterCurrentType}
                availability={filterCurrentAvailability}
                maxPrice={maxPrice}
                setSort={setSort}
                sort={sort} />
        </div>
      ) : (
        <main>
        <div className="flex relative bg-sec-white sm:pb-32 p-2 w-full">
          <div className="flex flex-col items-center lg:w-4/4 w-full z-100">
            {/* zoek ding */}

            <div
              className={`bg-main-white shadow-md rounded-md w-5/6 sticky top-4 p-4 flex justify-center items-center ${
                isScrolled ? "opacity" : ""
              }`}
              style={{ zIndex: 10 }}
            >
              <div
                className={`relative mt-1 rounded-md shadow-sm flex w-full max-w-lg content-center bg-red w-full `}
              >
                {isScrolled ? (
                  <a href="/home" className="hidden sm:block justify-start mx-2">
                    <MainLogo text={false} />
                  </a>
                ) : (
                  ""
                )}
                <button onClick={toggleMobileFilter} className="lg:hidden block rounded-md border-0 py-2 pl-3 pr-6 mr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  Filters
                </button>
                <input
                  type="text"
                  name="postcode"
                  id="postcode"
                  value={searchTerms}
                  onChange={(e) => setSearchTerms(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      fetchData();
                    }
                  }}
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Zoek op Huisvest.."
                />
                <button
                  onClick={fetchData}
                  className="absolute inset-y-0 right-3 flex items-center font-semibold leading-6 text-tert-blue hover:text-tert-blue-hover duration-300 ease-in-out"
                >
                  Zoek
                </button>
              </div>
              <button
                onClick={scrollUp}
                className={` ${ isScrolled ? "" : "hidden"} block h-9 rounded-md border-0 mx-4 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
              >
                <HiOutlineChevronUp />
              </button>
            </div>

            <div className="flex w-5/6 ">
             
              <div className="lg:block hidden lg:w-1/4 w-full self-start  sticky top-28 py-2 pr-4">
              <Filter 
                setType={setFilterCurrentType} 
                setAvailability={setCurrentAvailability} 
                setMaxPrice={setMaxPrice}
                type={filterCurrentType}
                availability={filterCurrentAvailability}
                maxPrice={maxPrice}
                setSort={setSort}
                sort={sort} />
              </div>

              <div className="flex-col items-center lg:w-3/4 w-full  py-4">
                { totalResults ? (
                  <>
              <p className="text-xs text-gray-400 my-2"> <b>{totalResults} </b>Resultaten gevonden op <b>{totalPages}</b> pagina(s)</p>

                  {/* Pagination */}
                <Paginator
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                  totalPages={totalPages}
                />
                {/* Pagination */}
                  </>

                ) : (<></>)

                }

                
                <div className="mx-auto grid gap-x-2 p-4 gap-y-10 w-full bg-main-white shadow-lg z-10">
                  {/* Als API nog geen reactie heeft gegeven, 
                laat een spinner zien. */}
         
                  {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-x-8 gap-y-2">
                      <span>Loading listings..</span>
                      <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                    </div>
                  ) : (
                    <ul
                      role="list"
                      className="grid gap-x-2 gap-y-2 sm:grid-cols-1 sm:gap-y-4"
                    >
                      {apiData.map((card) => (
                        <Card
                          type={card.type}
                          key={card.id}
                          title={card.address}
                          price={card.price}
                          m2={card.m2}
                          bedrooms={card.bedrooms}
                          bathrooms={card.bathrooms}
                          // new:
                          city={card.city}
                          availability={card.availability}
                          created_at={card.created_at}
                        />
                      ))}
                    </ul>


                  )}
                  { totalResults && apiData.length >= 1 ? "" :  <h1>Oeps, geen resultaten gevonden</h1>}
                </div>
                {/* Pagination */}
                { totalResults ? (
                  <>

                  {/* Pagination */}
                <Paginator
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                  totalPages={totalPages}
                />
                {/* Pagination */}
                  </>

                ) : (<></>)

                }
                {/* Pagination */}
              </div>
             
            </div>
          </div>
        </div>
      </main>
      )}
     
    </div>
  );
}
