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
         <div className="p-10 text-black">
            <div className=" flex justify-center mb-2">
               <SearchBar
                  onChangeText={(text) => setSearchQuery(text)}
                  value={searchQuery}
               />
            </div>

            {loading && <Loading />}

            {error && (
               <p className="text-center mt-20 font-serif">
                  Error : {error.message}
               </p>
            )}

            {!loading && !error && searchQuery.trim() && courts?.length > 0 && (
               <p className=" mt-4 text-xl text-black font-serif ">
                  {`Showing ${courts?.length} results for`}{" "}
                  <span className="text-black font-bold">{searchQuery}</span>
               </p>
            )}

            {!loading && !error && (!courts || courts?.length == 0) && (
               <div className="flex mt-20 justify-center items-center">
                  {searchQuery.trim() && courts?.length == 0 ? (
                     <div className="font-serif text-center text-balance">
                        <p className="text-xl sm:text-3xl  ">{`Sorry, we could not find any matches for '${searchQuery}'`}</p>
                        <p className="text-sm sm:text-lg mt-2 text-gray-600">
                           Try making your search simpler and double checking
                           your spelling{" "}
                        </p>
                     </div>
                  ) : (
                     <div className="flex flex-col justify-center items-center text-center text-balance">
                        <MagnifyingGlassIcon className="size-20 text-green-color" />
                        <p className="text-3xl font-serif mt-2">
                           What are you looking for?
                        </p>
                     </div>
                  )}
               </div>
            )}

            <div className="flex justify-between mt-10"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10  my-5 ">
               {courts?.map((court) => (
                  <CourtCard key={court.id} {...court} />
               ))}
            </div>
         </div>
      </>
   );
};

export default SearchPage;
