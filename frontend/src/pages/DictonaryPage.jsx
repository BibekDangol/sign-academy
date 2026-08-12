import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./footer1"; // ✅ Import Footer here
import "./DictionaryPage.css";

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
    <div className="page-wrapper">
      <Navbar />

      <main id="container">
        <div id="search" className="text-center mb-4">
          <label htmlFor="searchInput" className="form-label">Search Dictionary</label>
          <input
            id="searchInput"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="form-control mx-auto"
            style={{ maxWidth: "400px" }}
            placeholder="Search for a word..."
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Word</th>
                <th>Description</th>
                <th>Difficulty Rating</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {filteredDictionary.map((item) => (
                <tr key={item.id}>
                  <td>{item.word}</td>
                  <td>{item.description || "No description provided"}</td>
                  <td>{item.difficulty_rating || "N/A"}</td>
                  <td>
                    {item.sign_image && (
                      <div className="image-container">
                        <img
                          src={item.sign_image}
                          alt={item.word}
                          className="word-image"
                          onClick={() => setImageToShow(item.sign_image)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {imageToShow && (
          <div id="imagePopup" onClick={() => setImageToShow(null)}>
            <img src={imageToShow} alt="Sign Language" />
          </div>
        )}
      </main>

      <Footer /> {/* ✅ Footer added here */}
    </div>
  );
}
