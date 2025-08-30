// seeder.js
const mongoose = require("mongoose");
require("dotenv").config();

const Book = require("./models/Book");
const Copy = require("./models/Copy");

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Sample books data
const booksData = [
  {title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", publicationDate: 1925, description: "A novel about the American dream and the amazing twenties." },
  { title: "1984", author: "George Orwell", genre: "Dystopian", publicationDate: 1949, description: "A dystopian social science fiction novel and cautionary tale about totalitarianism." },
  { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", publicationDate: 1960, description: "A novel about racial injustice in the Deep South." },
  { title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Classic", publicationDate: 1951, description: "A story about teenage rebellion and alienation." },
  { title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", publicationDate: 1813, description: "A romantic novel that critiques the British landed gentry at the end of the 18th century." },
  { title: "Moby Dick", author: "Herman Melville", genre: "Adventure", publicationDate: 1851, description: "The narrative of Captain Ahab’s obsessive quest to kill the white whale." },
  {  title: "War and Peace", author: "Leo Tolstoy", genre: "Historical", publicationDate: 1869, description: "A novel that chronicles the French invasion of Russia and its impact on society." },
  { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", publicationDate: 1937, description: "A fantasy novel about Bilbo Baggins’ adventure." },
  { title: "Brave New World", author: "Aldous Huxley", genre: "Dystopian", publicationDate: 1932, description: "A dystopian novel exploring futuristic society and technology." },
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky", genre: "Psychological", publicationDate: 1866, description: "A novel about morality, guilt, and redemption." },
  { title: "The Alchemist", author: "Paulo Coelho", genre: "Philosophical", publicationDate: 1988, description: "A philosophical book about following your dreams." },
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy", publicationDate: 1954, description: "An epic high fantasy novel." },
  {  title: "Fahrenheit 451", author: "Ray Bradbury", genre: "Dystopian", publicationDate: 1953, description: "A novel about censorship and the suppression of ideas." },
  {title: "Jane Eyre", author: "Charlotte Brontë", genre: "Romance", publicationDate: 1847, description: "A novel about the experiences of the titular character, including her growth to adulthood." },
  {title: "Animal Farm", author: "George Orwell", genre: "Political Satire", publicationDate: 1945, description: "An allegorical novella criticizing totalitarian regimes." },
  {title: "The Da Vinci Code", author: "Dan Brown", genre: "Thriller", publicationDate: 2003, description: "A mystery thriller novel." },
  {title: "The Kite Runner", author: "Khaled Hosseini", genre: "Drama", publicationDate: 2003, description: "A story of friendship and redemption in Afghanistan." },
  {title: "A Tale of Two Cities", author: "Charles Dickens", genre: "Historical", publicationDate: 1859, description: "A novel set in London and Paris before and during the French Revolution." },
  {title: "The Shining", author: "Stephen King", genre: "Horror", publicationDate: 1977, description: "A horror novel about a haunted hotel." },
  {title: "The Hunger Games", author: "Suzanne Collins", genre: "Dystopian", publicationDate: 2008, description: "A dystopian novel about survival and rebellion." },
];

// Sample copies data
const copiesData = [
  { bookIdIndex: 1, copyId: "GATSBY-1" },
  { bookIdIndex: 1, copyId: "GATSBY-2" },
  { bookIdIndex: 2, copyId: "1984-1" },
  { bookIdIndex: 2, copyId: "1984-2" },
  { bookIdIndex: 3, copyId: "TKAM-1" },
  { bookIdIndex: 4, copyId: "CATCHER-1" },
  { bookIdIndex: 5, copyId: "PRIDE-1" },
  { bookIdIndex: 6, copyId: "MOBY-1" },
  { bookIdIndex: 7, copyId: "WARPEACE-1" },
  { bookIdIndex: 7, copyId: "WARPEACE-2" },
  { bookIdIndex: 8, copyId: "HOBBIT-1" },
  { bookIdIndex: 8, copyId: "HOBBIT-2" },
  { bookIdIndex: 9, copyId: "BRAVE-1" },
  { bookIdIndex: 10, copyId: "CRIME-1" },
  { bookIdIndex: 11, copyId: "ALCHEMIST-1" },
  { bookIdIndex: 11, copyId: "ALCHEMIST-2" },
  { bookIdIndex: 12, copyId: "LOTR-1" },
  { bookIdIndex: 12, copyId: "LOTR-2" },
  { bookIdIndex: 12, copyId: "LOTR-3" },
  { bookIdIndex: 13, copyId: "FAHRENHEIT-1" },
  { bookIdIndex: 14, copyId: "JANE-1" },
  { bookIdIndex: 15, copyId: "ANIMAL-1" },
  { bookIdIndex: 15, copyId: "ANIMAL-2" },
  { bookIdIndex: 16, copyId: "DAVINCI-1" },
  { bookIdIndex: 17, copyId: "KITE-1" },
  { bookIdIndex: 18, copyId: "TALE-1" },
  { bookIdIndex: 19, copyId: "SHINING-1" },
  { bookIdIndex: 20, copyId: "HUNGER-1" },
  { bookIdIndex: 20, copyId: "HUNGER-2" },
];

// Seeder function
// Seeder function
const seed = async () => {
    await connectDB();
  
    try {
      // Clear existing data
      await Book.deleteMany({});
      await Copy.deleteMany({});
  
      // Insert books
      const insertedBooks = await Book.insertMany(booksData);
      console.log(`✅ Inserted ${insertedBooks.length} books`);
  
      // Insert copies and map to correct book _id using array index
      const copiesToInsert = copiesData.map(copy => {
        const book = insertedBooks[copy.bookIdIndex - 1]; // -1 because array is 0-based
        return {
          bookId: book._id,
          copyId: copy.copyId,
          available: true,
        };
      });
  
      const insertedCopies = await Copy.insertMany(copiesToInsert);
      console.log(`✅ Inserted ${insertedCopies.length} copies`);
  
      process.exit();
    } catch (err) {
      console.error("❌ Seeder error:", err);
      process.exit(1);
    }
  };
  
  seed();  