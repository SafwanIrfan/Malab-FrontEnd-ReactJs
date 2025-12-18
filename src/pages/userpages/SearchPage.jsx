import CourtCard from "../../components/CourtCard";
import Loading from "../../smallcomponents/Loading";
import useFetch from "../../services/useFetch";
import { fetchCourts } from "../../services/api";
import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const SearchPage = () => {
   const [searchQuery, setSearchQuery] = useState("");

   const {
      data: courts,
      loading,
      error,
      refetch: loadCourts,
      reset,
   } = useFetch(
      () =>
         fetchCourts({
            query: searchQuery,
         }),
      false
   );

   useEffect(() => {
      const timeoutId = setTimeout(async () => {
         if (searchQuery.trim()) {
            console.log(searchQuery);
            await loadCourts();
         } else {
            reset();
         }
      }, 500);

      return () => clearTimeout(timeoutId);
   }, [searchQuery]);

   // useEffect(() => {
   //    fetchCourts();
   //    console.log(courts);
   // }, []);

   return (
      <>
         <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 text-black min-h-screen">
            <div className="flex justify-center mb-6 sm:mb-8">
               <div className="w-full max-w-2xl">
                  <SearchBar
                     onChangeText={(text) => setSearchQuery(text)}
                     value={searchQuery}
                     onClickSearchBar={() => {}}
                  />
               </div>
            </div>

            {loading && <Loading />}

            {error && (
               <div className="flex justify-center items-center mt-20">
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                     <p className="text-red-600 text-lg">
                        Error : {error.message}
                     </p>
                  </div>
               </div>
            )}

            {!loading && !error && searchQuery.trim() && courts?.length > 0 && (
               <div className="mb-6">
                  <p className="text-lg sm:text-xl text-gray-700">
                     {`Showing ${courts?.length} result${courts?.length !== 1 ? 's' : ''} for`}{" "}
                     <span className="text-green-color font-bold">{searchQuery}</span>
                  </p>
               </div>
            )}

            {!loading && !error && (!courts || courts?.length == 0) && (
               <div className="flex mt-20 justify-center items-center">
                  {searchQuery.trim() && courts?.length == 0 ? (
                     <div className="text-center text-balance max-w-2xl px-4">
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8">
                           <p className="text-xl sm:text-3xl text-gray-800 mb-4">
                              {`Sorry, we could not find any matches for '${searchQuery}'`}
                           </p>
                           <p className="text-sm sm:text-lg text-gray-600">
                              Try making your search simpler and double checking
                              your spelling
                           </p>
                        </div>
                     </div>
                  ) : (
                     <div className="flex flex-col justify-center items-center text-center text-balance py-12">
                        <div className="bg-white/80 backdrop-blur-sm rounded-full p-8 mb-6 shadow-lg">
                           <MagnifyingGlassIcon className="size-20 text-green-color" />
                        </div>
                        <p className="text-2xl sm:text-3xl mt-2 text-blackberry-color">
                           What are you looking for?
                        </p>
                        <p className="text-gray-600 mt-2">Start typing to search for courts</p>
                     </div>
                  )}
               </div>
            )}

            {!loading && !error && courts?.length > 0 && (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 my-5">
                  {courts?.map((court) => (
                     <CourtCard key={court.id} {...court} />
                  ))}
               </div>
            )}
         </div>
      </>
   );
};

export default SearchPage;
