import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./footer1"; // ✅ Import Footer here
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function DictionaryPage() {
  const [dictionary, setDictionary] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageToShow, setImageToShow] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dictionary/")
      .then((response) => response.json())
      .then((data) => setDictionary(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredDictionary = dictionary.filter((item) =>
    item.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full m-0 p-0">
      <Navbar />

      <main id="container" className="max-w-[1200px] mx-auto py-8 px-4 font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] box-border overflow-x-hidden max-md:p-4">
        <div id="search" className="text-center mb-4 mt-8">
          <Label htmlFor="searchInput" className="form-label block mb-2 font-bold">Search Dictionary</Label>
          <Input
            id="searchInput"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="form-control mx-auto w-full p-[10px] rounded-[5px] border border-solid border-[#ccc]"
            style={{ maxWidth: "400px" }}
            placeholder="Search for a word..."
          />
        </div>

        <div className="overflow-x-auto border border-solid border-[#e0e0e0] rounded-lg bg-white mt-8 box-border">
          <Table className="w-full min-w-[700px] border-collapse mx-auto max-md:min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="p-4 text-center border-b border-solid border-[#ddd] align-middle max-md:p-3 max-md:text-[0.95rem]">Word</TableHead>
                <TableHead className="p-4 text-center border-b border-solid border-[#ddd] align-middle max-md:p-3 max-md:text-[0.95rem]">Description</TableHead>
                <TableHead className="p-4 text-center border-b border-solid border-[#ddd] align-middle max-md:p-3 max-md:text-[0.95rem]">Difficulty Rating</TableHead>
                <TableHead className="p-4 text-center border-b border-solid border-[#ddd] align-middle max-md:p-3 max-md:text-[0.95rem]">Photo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDictionary.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="p-4 text-center border-b border-solid border-[#ddd] align-middle max-md:p-3 max-md:text-[0.95rem]">{item.word}</TableCell>
                  <TableCell className="p-4 text-center border-b border-solid border-[#ddd] align-middle max-md:p-3 max-md:text-[0.95rem]">{item.description || "No description provided"}</TableCell>
                  <TableCell className="p-4 text-center border-b border-solid border-[#ddd] align-middle max-md:p-3 max-md:text-[0.95rem]">{item.difficulty_rating || "N/A"}</TableCell>
                  <TableCell className="p-4 text-center border-b border-solid border-[#ddd] align-middle max-md:p-3 max-md:text-[0.95rem]">
                    {item.sign_image && (
                      <div className="w-[60px] h-[60px] flex items-center justify-center rounded-lg overflow-hidden border-2 border-solid border-[#e0e0e0] bg-[#f8f8f8] mx-auto transition-transform duration-200 ease-in-out hover:scale-105 max-md:w-[50px] max-md:h-[50px]">
                        <img
                          src={item.sign_image}
                          alt={item.word}
                          className="w-full h-full object-cover rounded-md transition-transform duration-200 cursor-pointer"
                          onClick={() => setImageToShow(item.sign_image)}
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {imageToShow && (
          <div id="imagePopup" className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.8)] flex items-center justify-center cursor-pointer z-[1000]" onClick={() => setImageToShow(null)}>
            <img src={imageToShow} alt="Sign Language" className="max-w-[90%] max-h-[80%] rounded-lg shadow-[0_4px_10px_rgba(255,255,255,0.2)]" />
          </div>
        )}
      </main>

      <Footer /> {/* ✅ Footer added here */}
    </div>
  );
}
