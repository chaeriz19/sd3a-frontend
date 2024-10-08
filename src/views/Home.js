import Header from "../components/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Card from "../components/Card";
import Filter from "../components/Filter";
import React, { useState, useCallback, useEffect, } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { HiOutlineChevronUp } from "react-icons/hi";
export default function Home() {

  // fetch data en zet in state!
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleFilterChange = (newFilters) => setFilters(newFilters);

  function scrollUp() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  useEffect(() => {
    fetchData();
  }, [currentPage]);


  const fetchData = async () => {
    console.log("Fetching data: " + currentPage);
    setLoading(true);
    try {
      const response = await axios.get(`https://chrisouboter.com/api/content`, {
        params: {
          page: currentPage,
        },
      });
      setApiData(response.data.data);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > 100) {
      console.log(newPage);
      setCurrentPage(1);
      return;
    } 
    setCurrentPage(newPage);
  };

  return (
<div className="min-h-full">
      <Header />
      <main>
 <div className="flex relative bg-sec-white sm:pb-32 p-2 w-full">
  <div className="flex flex-col items-center lg:w-4/4 w-full">
    {/* zoek ding */}

    <div className="bg-main-white shadow-md rounded-md w-5/6 sticky top-4 p-4 flex justify-center items-center">
  <div className="relative mt-1 rounded-md shadow-sm flex w-full max-w-lg content-center bg-red">
    <button 
      className="lg:hidden block rounded-md border-0 py-2 pl-3 pr-6 mr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >Filters</button>
    <input
      type="text"
      name="postcode"
      id="postcode"
      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      placeholder="Zoeken op ...."
    />
    <a
      href="#"
      className="absolute inset-y-0 right-3 flex items-center font-semibold leading-6 text-tert-blue hover:text-tert-blue-hover duration-300 ease-in-out"
    >
      Zoek
    </a>
  </div>
  <button
    onClick={scrollUp}
    className="block h-9 rounded-md border-0 mx-4 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
  >
    <HiOutlineChevronUp />
  </button>
</div>
  

          <div className="flex w-5/6 ">
            <div className="hidden lg:block lg:w-1/4 w-full self-start  sticky top-28 py-4 pr-4">
              <Filter />
            </div>
            <div className="pagination">
            
</div>

            <div className="flex-col items-center lg:w-3/4 w-full  py-4">

            {/* Pagination */}
            <div className="p-4 bg-main-white flex shadow-md content-center">
                <button className="text-black mr-2" onClick={() => handlePageChange(currentPage - 1)}>prev</button>
                {Array.from({ length: 10 }, (_, index) => (
                
                <button 
                  key={index} 
                  onClick={() => handlePageChange(index + 1)} 
                  className={currentPage === index + 1 ? 'text-prim-green p-4 bg-slate-200 font-bold hover:bg-slate-400 hover:text-white' : 'p-4 hover:text-white hover:bg-slate-400'}
                >
                  {index + 1}
                </button>
              ))}
                <button className="text-black ml-2" onClick={() => handlePageChange(currentPage + 1)}>next</button>

              </div>
              {/* Pagination */}
            
              <div className="mx-auto grid gap-x-2 p-4 gap-y-10 w-full bg-main-white shadow-lg">

                {/* Als API nog geen reactie heeft gegeven, 
                laat een spinner zien. */}

                { !apiData.length ? (
                  <div className="flex flex-col justify-center items-center h-64 gap-x-8 gap-y-2">
                    <span>Loading listings..</span>
                  <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                </div>
                 
                  ) : (
                    <ul role="list" className="grid gap-x-2 gap-y-2 sm:grid-cols-1 sm:gap-y-4">
                    {apiData.map(card => (
                      <Card 
                      type={card.type}
                        key={card.id}
                        title={card.address}
                        price={card.price}
                      />
                    ))}
                    </ul>
                  )
                }

              </div>
                {/* Pagination */}
            <div className="p-4 bg-main-white flex shadow-md content-center">
                <button className="text-black mr-2" onClick={() => handlePageChange(currentPage - 1)}>prev</button>
                {Array.from({ length: 10 }, (_, index) => (
                
                <button 
                  key={index} 
                  onClick={() => handlePageChange(index + 1)} 
                  className={currentPage === index + 1 ? 'text-prim-green p-4 bg-slate-200 font-bold hover:bg-slate-400 hover:text-white' : 'p-4 hover:text-white hover:bg-slate-400'}
                >
                  {index + 1}
                </button>
              ))}
                <button className="text-black ml-2" onClick={() => handlePageChange(currentPage + 1)}>next</button>

              </div>
              {/* Pagination */}
            </div>
            
          </div>
        </div>
      </div>
      </main>
      </div>
  );
}
