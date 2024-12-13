import React, { useState, useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';
import InfiniteScroll from "react-infinite-scroll-component";

const App = () => {

  const limit = 10;
  // totalpages can vary from 1 to 12
  const totalPages = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [quotes, setQuotes] = useState([]);

  // this state is created for infinte scroll

  const [hasMore, setHasMore] = useState(true);

  // Function to fetch quotes from the API
  const fetchQuotes = async () => {
    try {
      const response = await fetch(`https://api.javascripttutorial.net/v1/quotes/?page=${currentPage}&limit=${limit}`);
     
     /*  console.log(response); */
      
      // if the status is not in 200 series throw error
      if (!(response.status >= 200 && response.status < 300)) {
        throw new Error(`An error occurred while fetching`);
      }
      const result = await response.json();
      setQuotes((prevQuotes) => [...prevQuotes, ...result.data]);

      // hasmore false to indicate end of scroll
      if (currentPage >= totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      setQuotes([]);
    }
  };

  //  by currentpage update fetch is called
  useEffect(() => {
    fetchQuotes();
  }, [currentPage]); 


  const fetchNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="p-3 bg-dark text-light shadow">
      <h1 className="text-center">Quotes</h1>
      <div>
        <InfiniteScroll
          dataLength={quotes.length}
          next={fetchNextPage}
          hasMore={hasMore}
          loader={
              <span className="visually-hidden">Loading...</span>
          }
          endMessage={
            <div className="text-center">
              <b>Yay! You've seen all the quotes.</b>
            </div>
          }
        >
          {quotes.length > 0 ? (
            quotes.map((item) => (
              <div className="shadow p-4 m-2 border rounded-pill">
                {/* Displaying quotes here */}
                {item.quote}
              </div>
            ))
          ) : (
            // Showing loading icon while loading tha page initially by using spinner
         <div className="d-flex justify-content-center align-items-center w-100 vh-100">
              <Spinner variant="primary" animation="border" role="status" >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
         </div>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default App;
