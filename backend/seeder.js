// seeder.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

// adjust paths if your models are in a different folder
const User = require("./models/User");
const Book = require("./models/Book");
const Copy = require("./models/Copy");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/librarydb";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB:", MONGO_URI);

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Book.deleteMany({}),
      Copy.deleteMany({}),
    ]);
    console.log("🧹 Cleared users, books, copies");

    // Create Admin and User
    const adminPassword = await bcrypt.hash("admins123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    const adminUser = await User.create({
      name: "Admin User",
      username: "moulya",
      password: adminPassword,
      age: 22,
      college: "DSATM",
      email: "admin@example.com",
      role: "admin",
    });

    const normalUser = await User.create({
      name: "Regular User",
      username: "student1",
      password: userPassword,
      age: 20,
      college: "DSATM",
      email: "student@example.com",
      role: "user",
    });

    console.log("👤 Created users:");
    console.log(" - admin:", adminUser.username, "(password: admins123)");
    console.log(" - user :", normalUser.username, "(password: user123)");

    // Books array (20 books)
    const books = [
      { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", publicationDate: 1925, description: "A novel about the American dream and the amazing twenties." },
      { title: "1984", author: "George Orwell", genre: "Dystopian", publicationDate: 1949, description: "A dystopian social science fiction novel and cautionary tale about totalitarianism." },
      { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", publicationDate: 1960, description: "A novel about racial injustice in the Deep South." },
      { title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Classic", publicationDate: 1951, description: "A story about teenage rebellion and alienation." },
      { title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", publicationDate: 1813, description: "A romantic novel that critiques the British landed gentry at the end of the 18th century." },
      { title: "Moby Dick", author: "Herman Melville", genre: "Adventure", publicationDate: 1851, description: "The narrative of Captain Ahab's obsessive quest to kill the white whale." },
      { title: "War and Peace", author: "Leo Tolstoy", genre: "Historical", publicationDate: 1869, description: "A novel that chronicles the French invasion of Russia and its impact on society." },
      { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", publicationDate: 1937, description: "A fantasy novel about Bilbo Baggins' adventure." },
      { title: "Brave New World", author: "Aldous Huxley", genre: "Dystopian", publicationDate: 1932, description: "A dystopian novel exploring futuristic society and technology." },
      { title: "Crime and Punishment", author: "Fyodor Dostoevsky", genre: "Psychological", publicationDate: 1866, description: "A novel about morality, guilt, and redemption." },
      { title: "The Alchemist", author: "Paulo Coelho", genre: "Philosophical", publicationDate: 1988, description: "A philosophical book about following your dreams." },
      { title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy", publicationDate: 1954, description: "An epic high fantasy novel." },
      { title: "Fahrenheit 451", author: "Ray Bradbury", genre: "Dystopian", publicationDate: 1953, description: "A novel about censorship and the suppression of ideas." },
      { title: "Jane Eyre", author: "Charlotte Brontë", genre: "Romance", publicationDate: 1847, description: "A novel about the experiences of the titular character, including her growth to adulthood." },
      { title: "Animal Farm", author: "George Orwell", genre: "Political Satire", publicationDate: 1945, description: "An allegorical novella criticizing totalitarian regimes." },
      { title: "The Da Vinci Code", author: "Dan Brown", genre: "Thriller", publicationDate: 2003, description: "A mystery thriller novel." },
      { title: "The Kite Runner", author: "Khaled Hosseini", genre: "Drama", publicationDate: 2003, description: "A story of friendship and redemption in Afghanistan." },
      { title: "A Tale of Two Cities", author: "Charles Dickens", genre: "Historical", publicationDate: 1859, description: "A novel set in London and Paris before and during the French Revolution." },
      { title: "The Shining", author: "Stephen King", genre: "Horror", publicationDate: 1977, description: "A horror novel about a haunted hotel." },
      { title: "The Hunger Games", author: "Suzanne Collins", genre: "Dystopian", publicationDate: 2008, description: "A dystopian novel about survival and rebellion." }
    ];

    // Insert books
    const insertedBooks = await Book.insertMany(books);
    console.log(`📚 Inserted ${insertedBooks.length} books`);

    // copies data referencing book index (1-based) from the books array above
    const copiesData = [
      { bookIndex: 1, copyId: "GATSBY-1", available: true },
      { bookIndex: 1, copyId: "GATSBY-2", available: true },
      { bookIndex: 2, copyId: "1984-1", available: true },
      { bookIndex: 2, copyId: "1984-2", available: true },
      { bookIndex: 3, copyId: "TKAM-1", available: true },
      { bookIndex: 4, copyId: "CATCHER-1", available: true },
      { bookIndex: 5, copyId: "PRIDE-1", available: true },
      { bookIndex: 6, copyId: "MOBY-1", available: true },
      { bookIndex: 7, copyId: "WARPEACE-1", available: true },
      { bookIndex: 7, copyId: "WARPEACE-2", available: true },
      { bookIndex: 8, copyId: "HOBBIT-1", available: true },
      { bookIndex: 8, copyId: "HOBBIT-2", available: true },
      { bookIndex: 9, copyId: "BRAVE-1", available: true },
      { bookIndex: 10, copyId: "CRIME-1", available: true },
      { bookIndex: 11, copyId: "ALCHEMIST-1", available: true },
      { bookIndex: 11, copyId: "ALCHEMIST-2", available: true },
      { bookIndex: 12, copyId: "LOTR-1", available: true },
      { bookIndex: 12, copyId: "LOTR-2", available: true },
      { bookIndex: 12, copyId: "LOTR-3", available: true },
      { bookIndex: 13, copyId: "FAHRENHEIT-1", available: true },
      { bookIndex: 14, copyId: "JANE-1", available: true },
      { bookIndex: 15, copyId: "ANIMAL-1", available: true },
      { bookIndex: 15, copyId: "ANIMAL-2", available: true },
      { bookIndex: 16, copyId: "DAVINCI-1", available: true },
      { bookIndex: 17, copyId: "KITE-1", available: true },
      { bookIndex: 18, copyId: "TALE-1", available: true },
      { bookIndex: 19, copyId: "SHINING-1", available: true },
      { bookIndex: 20, copyId: "HUNGER-1", available: true },
      { bookIndex: 20, copyId: "HUNGER-2", available: true },
    ];

    // Build copy docs by mapping bookIndex => actual _id from insertedBooks
    const copiesToInsert = copiesData.map(c => {
      const bookDoc = insertedBooks[c.bookIndex - 1];
      if (!bookDoc) throw new Error(`Book not found for index ${c.bookIndex}`);
      return {
        bookId: bookDoc._id,
        copyId: c.copyId,
        available: Boolean(c.available),
      };
    });

    await Copy.insertMany(copiesToInsert);
    console.log(`📦 Inserted ${copiesToInsert.length} copies`);

    console.log("✅ Seeding complete!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    try { await mongoose.connection.close(); } catch(e) {}
    process.exit(1);
  }
}

seed();
