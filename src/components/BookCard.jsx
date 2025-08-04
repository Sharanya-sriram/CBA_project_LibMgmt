// src/components/BookCard.jsx
const BookCard = ({ book }) => {
    return (
      <div style={styles.card}>
        <h3>{book.title}</h3>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Genre:</strong> {book.genre}</p>
        <p style={{ color: book.available ? "green" : "red" }}>
          {book.available ? "Available" : "Issued"}
        </p>
      </div>
    );
  };
  
  const styles = {
    card: {
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
      width: "250px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
  };
  
  export default BookCard;
  