INSERT INTO books (id, title, author, genre, publicationDate, description) VALUES
(1, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', '1925-04-10', 'A novel about the American dream and the roaring twenties.'),
(2, '1984', 'George Orwell', 'Dystopian', '1949-06-08', 'A dystopian social science fiction novel and cautionary tale about totalitarianism.'),
(3, 'To Kill a Mockingbird', 'Harper Lee', 'Classic', '1960-07-11', 'A novel about racial injustice in the Deep South.'),
(4, 'The Catcher in the Rye', 'J.D. Salinger', 'Classic', '1951-07-16', 'A story about teenage rebellion and alienation.'),
(5, 'Pride and Prejudice', 'Jane Austen', 'Romance', '1813-01-28', 'A romantic novel that critiques the British landed gentry at the end of the 18th century.'),
(6, 'Moby Dick', 'Herman Melville', 'Adventure', '1851-11-14', 'The narrative of Captain Ahab\'s obsessive quest to kill the white whale.'),
(7, 'War and Peace', 'Leo Tolstoy', 'Historical', '1869-01-01', 'A novel that chronicles the French invasion of Russia and its impact on society.'),
(8, 'The Hobbit', 'J.R.R. Tolkien', 'Fantasy', '1937-09-21', 'A fantasy novel about Bilbo Baggins\' adventure.'),
(9, 'Brave New World', 'Aldous Huxley', 'Dystopian', '1932-08-31', 'A dystopian novel exploring futuristic society and technology.'),
(10, 'Crime and Punishment', 'Fyodor Dostoevsky', 'Psychological', '1866-01-01', 'A novel about morality, guilt, and redemption.'),
(11, 'The Alchemist', 'Paulo Coelho', 'Philosophical', '1988-01-01', 'A philosophical book about following your dreams.'),
(12, 'The Lord of the Rings', 'J.R.R. Tolkien', 'Fantasy', '1954-07-29', 'An epic high fantasy novel.'),
(13, 'Fahrenheit 451', 'Ray Bradbury', 'Dystopian', '1953-10-19', 'A novel about censorship and the suppression of ideas.'),
(14, 'Jane Eyre', 'Charlotte Brontë', 'Romance', '1847-10-16', 'A novel about the experiences of the titular character, including her growth to adulthood.'),
(15, 'Animal Farm', 'George Orwell', 'Political Satire', '1945-08-17', 'An allegorical novella criticizing totalitarian regimes.'),
(16, 'The Da Vinci Code', 'Dan Brown', 'Thriller', '2003-03-18', 'A mystery thriller novel.'),
(17, 'The Kite Runner', 'Khaled Hosseini', 'Drama', '2003-05-29', 'A story of friendship and redemption in Afghanistan.'),
(18, 'A Tale of Two Cities', 'Charles Dickens', 'Historical', '1859-04-30', 'A novel set in London and Paris before and during the French Revolution.'),
(19, 'The Shining', 'Stephen King', 'Horror', '1977-01-28', 'A horror novel about a haunted hotel.'),
(20, 'The Hunger Games', 'Suzanne Collins', 'Dystopian', '2008-09-14', 'A dystopian novel about survival and rebellion.');

INSERT INTO copies (bookId, copyId, available) VALUES
(1, 'GATSBY-1', FALSE),
(1, 'GATSBY-2', TRUE),
(2, '1984-1', TRUE),
(2, '1984-2', TRUE),
(3, 'TKAM-1', TRUE),
(4, 'CATCHER-1', TRUE),
(5, 'PRIDE-1', TRUE),
(6, 'MOBY-1', TRUE),
(7, 'WARPEACE-1', TRUE),
(7, 'WARPEACE-2', TRUE),
(8, 'HOBBIT-1', TRUE),
(8, 'HOBBIT-2', FALSE),
(9, 'BRAVE-1', TRUE),
(10, 'CRIME-1', TRUE),
(11, 'ALCHEMIST-1', TRUE),
(11, 'ALCHEMIST-2', TRUE),
(12, 'LOTR-1', TRUE),
(12, 'LOTR-2', FALSE),
(12, 'LOTR-3', TRUE),
(13, 'FAHRENHEIT-1', TRUE),
(14, 'JANE-1', TRUE),
(15, 'ANIMAL-1', TRUE),
(15, 'ANIMAL-2', TRUE),
(16, 'DAVINCI-1', TRUE),
(17, 'KITE-1', TRUE),
(18, 'TALE-1', TRUE),
(19, 'SHINING-1', TRUE),
(20, 'HUNGER-1', TRUE),
(20, 'HUNGER-2', FALSE);

INSERT INTO users (id, name, username, password, age, college, email) VALUES
(1, 'Alice', 'alice01', 'hashed_password_1', 22, 'XYZ University', 'alice@example.com'),
(2, 'Bob', 'bob02', 'hashed_password_2', 24, 'ABC College', 'bob@example.com'),
(3, 'Charlie', 'charlie03', 'hashed_password_3', 21, 'PQR Institute', 'charlie@example.com'),
(4, 'David', 'david04', 'hashed_password_4', 23, 'LMN University', 'david@example.com'),
(5, 'Emma', 'emma05', 'hashed_password_5', 25, 'UVW College', 'emma@example.com');

ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

INSERT INTO users (name, username, password, age, college, email, role) VALUES
('User One', 'user1', 'user1', 22, 'Demo College', 'user1@example.com', 'user'),
('User Two', 'user2', 'user2', 24, 'Demo College', 'user2@example.com', 'admin');

INSERT INTO issuedBooks (id, userId, bookId, copyId, issueDate, returnDate) VALUES
(1, 2, 1, 'GATSBY-1', '2025-07-20', '2025-08-03'),
(2, 2, 8, 'HOBBIT-2', '2025-08-05', '2025-08-19');