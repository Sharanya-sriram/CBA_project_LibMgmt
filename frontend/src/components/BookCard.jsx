// src/components/BookCard.jsx
import { useAuth } from "../context/AuthContext.jsx";
import BookDetails from "../pages/BookDetails.jsx";
import { useNavigate } from "react-router-dom";
const BookCard = ({ book }) => {
  const { darkMode } = useAuth(); // 'light' or 'dark'
  const navigate = useNavigate();
  const bgClass = darkMode  ? "bg-gray-800" : "bg-white";
  const textClass = darkMode? "text-gray-100" : "text-gray-800";
  const subTextClass = darkMode? "text-gray-300" : "text-gray-600";
  const stock=book.availableCopies;

  const handleClick=()=>{
    navigate(`/book/${book.id}`);
  }
  return (
    <div
      className={`${bgClass} rounded-xl shadow-md p-4 w-64
                  hover:shadow-lg hover:-translate-y-1 transition-transform duration-200`}
     onClick={handleClick}>
      <div className="flex justify-between items-start">
        <h3 className={`text-lg font-semibold ${textClass}`}>{book.title}</h3>
        <span
          className={`text-xs font-bold px-2 py-1 rounded ${
            stock>0
              ? darkMode
                ? "bg-green-900 text-green-200"
                : "bg-green-100 text-green-700"
              : darkMode
                ? "bg-red-900 text-red-200"
                : "bg-red-100 text-red-700"
          }`}
        >
          {stock>0 ? "Available" : "Out of stock"}
        </span>
      </div>

      <p className={`text-sm ${subTextClass} mt-2`}>
        <strong>Author:</strong> {book.author}
      </p>
      <p className={`text-sm ${subTextClass}`}>
        <strong>Genre:</strong> {book.genre}
      </p>
    </div>
  );
};

export default BookCard;
