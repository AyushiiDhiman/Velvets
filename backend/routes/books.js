const router = require('express').Router();
const axios = require('axios');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Mock books database with Indian books
const mockBooks = {
'self-help': [
  { id: 'sh1', title: 'Atomic Habits', author: 'James Clear', cover: 'https://images-na.ssl-images-amazon.com/images/P/0735211299.01.L.jpg', description: 'Transform your life with tiny habits that compound over time.', rating: 4.7, goodreads: 'https://www.goodreads.com/book/show/40121378-atomic-habits' },
  { id: 'sh2', title: 'Ikigai', author: 'Héctor García', cover: 'https://images-na.ssl-images-amazon.com/images/P/0143130722.01.L.jpg', description: 'Discover your reason for being and live a fulfilling life.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/40534545-ikigai' },
  { id: 'sh3', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', cover: 'https://images-na.ssl-images-amazon.com/images/P/0374275637.01.L.jpg', description: 'Understand how your mind works and make better decisions.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow' },
  { id: 'sh4', title: 'The Power of Your Subconscious Mind', author: 'Joseph Murphy', cover: 'https://images-na.ssl-images-amazon.com/images/P/0553283286.01.L.jpg', description: 'Unlock the power of your subconscious mind to achieve your dreams.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/108546-the-power-of-your-subconscious-mind' },
  { id: 'sh5', title: 'The Rules of Life', author: 'Richard Templar', cover: 'https://images-na.ssl-images-amazon.com/images/P/0273705893.01.L.jpg', description: 'Simple truths for living a meaningful and fulfilling life.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/373841-the-rules-of-life' },
  { id: 'sh6', title: 'Man\'s Search for Meaning', author: 'Viktor Frankl', cover: 'https://images-na.ssl-images-amazon.com/images/P/0807014312.01.L.jpg', description: 'Find purpose and meaning even in the darkest times.', rating: 4.7, goodreads: 'https://www.goodreads.com/book/show/4069-man-s-search-for-meaning' },
  { id: 'sh7', title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey', cover: 'https://images-na.ssl-images-amazon.com/images/P/0743269519.01.L.jpg', description: 'Timeless principles for personal and professional success.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/36072-the-7-habits-of-highly-effective-people' },
  { id: 'sh8', title: 'Mindset', author: 'Carol S. Dweck', cover: 'https://images-na.ssl-images-amazon.com/images/P/0345472322.01.L.jpg', description: 'Develop a growth mindset to achieve your full potential.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/40745-mindset' },
  { id: 'sh9', title: 'The Power of Now', author: 'Eckhart Tolle', cover: 'https://images-na.ssl-images-amazon.com/images/P/1577314808.01.L.jpg', description: 'Live in the present moment for inner peace and spiritual awakening.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/10453-the-power-of-now' },
  { id: 'sh10', title: 'Steal Like an Artist', author: 'Austin Kleon', cover: 'https://images-na.ssl-images-amazon.com/images/P/0761169253.01.L.jpg', description: 'Tap into your creativity and become an original thinker.', rating: 4.4, goodreads: 'https://www.goodreads.com/book/show/13099738-steal-like-an-artist' },
  { id: 'sh11', title: 'Deep Work', author: 'Cal Newport', cover: 'https://images-na.ssl-images-amazon.com/images/P/0316257884.01.L.jpg', description: 'Master the art of focused, meaningful work in a distracted world.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/25744928-deep-work' },
  { id: 'sh12', title: 'Emotional Intelligence', author: 'Daniel Goleman', cover: 'https://images-na.ssl-images-amazon.com/images/P/0553383647.01.L.jpg', description: 'Develop emotional awareness for better relationships and success.', rating: 4.4, goodreads: 'https://www.goodreads.com/book/show/26329-emotional-intelligence' },
  { id: 'sh13', title: 'The Courage to be Disliked', author: 'Ichiro Kishimi', cover: 'https://images-na.ssl-images-amazon.com/images/P/1501197274.01.L.jpg', description: 'Philosophical wisdom for breaking free from self-limiting beliefs.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/43306206-the-courage-to-be-disliked' },
  { id: 'sh14', title: 'Essentialism', author: 'Greg McKeown', cover: 'https://images-na.ssl-images-amazon.com/images/P/0804137382.01.L.jpg', description: 'Learn to focus on what truly matters and eliminate the rest.', rating: 4.4, goodreads: 'https://www.goodreads.com/book/show/23876620-essentialism' },
  { id: 'sh15', title: 'Why Buddhism is True', author: 'Robert Wright', cover: 'https://images-na.ssl-images-amazon.com/images/P/1439195455.01.L.jpg', description: 'Ancient wisdom meets modern science for inner peace.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/32895641-why-buddhism-is-true' },
],
'science-fiction': [
  { id: 'sf1', title: 'Dune', author: 'Frank Herbert', cover: 'https://images-na.ssl-images-amazon.com/images/P/0441172717.01.L.jpg', description: 'Epic tale of politics, power, and desert planets.', rating: 4.8, goodreads: 'https://www.goodreads.com/book/show/44767458-dune' },
  { id: 'sf2', title: 'The Martian', author: 'Andy Weir', cover: 'https://images-na.ssl-images-amazon.com/images/P/0553418025.01.L.jpg', description: 'Survival, science, and humor on Mars.', rating: 4.7, goodreads: 'https://www.goodreads.com/book/show/18007564-the-martian' },
  { id: 'sf3', title: '1984', author: 'George Orwell', cover: 'https://images-na.ssl-images-amazon.com/images/P/0451524934.01.L.jpg', description: 'Dystopian masterpiece about totalitarianism.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/40961427-1984' },
  { id: 'sf4', title: 'Foundation', author: 'Isaac Asimov', cover: 'https://images-na.ssl-images-amazon.com/images/P/0553293354.01.L.jpg', description: 'The fall and rise of galactic civilization.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/29579-foundation' },
  { id: 'sf5', title: 'Neuromancer', author: 'William Gibson', cover: 'https://images-na.ssl-images-amazon.com/images/P/0441569595.01.L.jpg', description: 'Cyberpunk classic that defined the genre.', rating: 4.4, goodreads: 'https://www.goodreads.com/book/show/22328-neuromancer' },
  { id: 'sf6', title: 'Ender\'s Game', author: 'Orson Scott Card', cover: 'https://images-na.ssl-images-amazon.com/images/P/0812550706.01.L.jpg', description: 'A child prodigy\'s battle for humanity\'s survival.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/375802-ender-s-game' },
  { id: 'sf7', title: 'The Hunger Games', author: 'Suzanne Collins', cover: 'https://images-na.ssl-images-amazon.com/images/P/0439023483.01.L.jpg', description: 'Dystopian survival in a televised death match.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/2767052-the-hunger-games' },
  { id: 'sf8', title: 'Hyperion', author: 'Dan Simmons', cover: 'https://images-na.ssl-images-amazon.com/images/P/0553283681.01.L.jpg', description: 'Epic space opera with multiple timelines and characters.', rating: 4.7, goodreads: 'https://www.goodreads.com/book/show/77566-hyperion' },
  { id: 'sf9', title: 'Brave New World', author: 'Aldous Huxley', cover: 'https://images-na.ssl-images-amazon.com/images/P/0060850523.01.L.jpg', description: 'A seemingly perfect society with a dark underbelly.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/2969-brave-new-world' },
  { id: 'sf10', title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', cover: 'https://images-na.ssl-images-amazon.com/images/P/0441478557.01.L.jpg', description: 'Exploration of gender and society on an alien world.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/18423-the-left-hand-of-darkness' },
  { id: 'sf11', title: 'Snow Crash', author: 'Neal Stephenson', cover: 'https://images-na.ssl-images-amazon.com/images/P/0553380087.01.L.jpg', description: 'Virtual reality and real-world intrigue collide.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/40651883-snow-crash' },
  { id: 'sf12', title: 'The Three-Body Problem', author: 'Liu Cixin', cover: 'https://images-na.ssl-images-amazon.com/images/P/0765377063.01.L.jpg', description: 'First contact with an alien civilization during China\'s Cultural Revolution.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/20518872-the-three-body-problem' },
  { id: 'sf13', title: 'Altered Carbon', author: 'Richard K. Morgan', cover: 'https://images-na.ssl-images-amazon.com/images/P/0345457684.01.L.jpg', description: 'Noir detective story in a cyberpunk future.', rating: 4.4, goodreads: 'https://www.goodreads.com/book/show/40445-altered-carbon' },
  { id: 'sf14', title: 'The Expanse Series: Leviathan Wakes', author: 'James S.A. Corey', cover: 'https://images-na.ssl-images-amazon.com/images/P/0316129089.01.L.jpg', description: 'Political intrigue and space noir across the solar system.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/8855321-leviathan-wakes' },
  { id: 'sf15', title: 'Ready Player One', author: 'Ernest Cline', cover: 'https://images-na.ssl-images-amazon.com/images/P/0552562006.01.L.jpg', description: 'Quest in a massive virtual reality world filled with pop culture.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/9969571-ready-player-one' },
],
'thriller': [
  { id: 'th1', title: 'The Girl on the Train', author: 'Paula Hawkins', cover: 'https://images-na.ssl-images-amazon.com/images/P/1594633665.01.L.jpg', description: 'Gripping psychological thriller with shocking twists.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/22557272-the-girl-on-the-train' },
  { id: 'th2', title: 'Gone Girl', author: 'Gillian Flynn', cover: 'https://images-na.ssl-images-amazon.com/images/P/0307588378.01.L.jpg', description: 'Dark, twisty tale of a missing wife and lies.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/19288043-gone-girl' },
  { id: 'th3', title: 'The Silent Patient', author: 'Alex Michaelides', cover: 'https://images-na.ssl-images-amazon.com/images/P/1250132312.01.L.jpg', description: 'Shocking psychological thriller with a twist ending.', rating: 4.7, goodreads: 'https://www.goodreads.com/book/show/40097951-the-silent-patient' },
  { id: 'th4', title: 'The Woman in Cabin 10', author: 'Ruth Ware', cover: 'https://images-na.ssl-images-amazon.com/images/P/0062334638.01.L.jpg', description: 'Mystery unfolds on a luxury yacht with a missing woman.', rating: 4.3, goodreads: 'https://www.goodreads.com/book/show/27844885-the-woman-in-cabin-10' },
  { id: 'th5', title: 'The Casual Vacancy', author: 'J.K. Rowling', cover: 'https://images-na.ssl-images-amazon.com/images/P/0316228567.01.L.jpg', description: 'Small-town secrets unravel after a sudden death.', rating: 4.3, goodreads: 'https://www.goodreads.com/book/show/13268378-the-casual-vacancy' },
  { id: 'th6', title: 'Before the Coffee Gets Cold', author: 'Toshikazu Kawaguchi', cover: 'https://images-na.ssl-images-amazon.com/images/P/0063161184.01.L.jpg', description: 'A mysterious café where you can meet your past and future.', rating: 4.4, goodreads: 'https://www.goodreads.com/book/show/44141927-before-the-coffee-gets-cold' },
  { id: 'th7', title: 'We Need to Talk About Kevin', author: 'Lionel Shriver', cover: 'https://images-na.ssl-images-amazon.com/images/P/006000666X.01.L.jpg', description: 'Psychological exploration of a mother and her troubled son.', rating: 4.2, goodreads: 'https://www.goodreads.com/book/show/11268-we-need-to-talk-about-kevin' },
  { id: 'th8', title: 'Sharp Objects', author: 'Gillian Flynn', cover: 'https://images-na.ssl-images-amazon.com/images/P/0307410773.01.L.jpg', description: 'Dark mystery with layers of secrets and trauma.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/3839023-sharp-objects' },
  { id: 'th9', title: 'The Kind Worth Killing', author: 'Peter Swanson', cover: 'https://images-na.ssl-images-amazon.com/images/P/0062268449.01.L.jpg', description: 'Two strangers on a plane plot an elaborate revenge.', rating: 4.3, goodreads: 'https://www.goodreads.com/book/show/19063976-the-kind-worth-killing' },
  { id: 'th10', title: 'The Whisper Man', author: 'Alex North', cover: 'https://images-na.ssl-images-amazon.com/images/P/006267854X.01.L.jpg', description: 'Serial killer terror returns to haunt a small town.', rating: 4.4, goodreads: 'https://www.goodreads.com/book/show/39566265-the-whisper-man' },
  { id: 'th11', title: 'Rebecca', author: 'Daphne du Maurier', cover: 'https://images-na.ssl-images-amazon.com/images/P/0380730650.01.L.jpg', description: 'Classic gothic thriller with suspense and mystery.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/10020957-rebecca' },
  { id: 'th12', title: 'The Last Mrs. Parrish', author: 'Liv Constantine', cover: 'https://images-na.ssl-images-amazon.com/images/P/0062823566.01.L.jpg', description: 'A new friendship hides dangerous secrets and revenge.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/36664163-the-last-mrs-parrish' },
  { id: 'th13', title: 'In the Dark', author: 'Andreas Pflüger', cover: 'https://images-na.ssl-images-amazon.com/images/P/0062662082.01.L.jpg', description: 'Blind former cop hunted by a relentless assassin.', rating: 4.4, goodreads: 'https://www.goodreads.com/book/show/34069156-in-the-dark' },
  { id: 'th14', title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', cover: 'https://images-na.ssl-images-amazon.com/images/P/0307269752.01.L.jpg', description: 'Complex mystery solving a decades-old crime.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/2429135-the-girl-with-the-dragon-tattoo' },
  { id: 'th15', title: 'The Woman in Black', author: 'Susan Hill', cover: 'https://images-na.ssl-images-amazon.com/images/P/0618129200.01.L.jpg', description: 'Gothic horror and supernatural mystery on a lonely island.', rating: 4.3, goodreads: 'https://www.goodreads.com/book/show/99466-the-woman-in-black' },
],
'bestseller': [
  { id: 'bs1', title: 'Educated', author: 'Tara Westover', cover: 'https://images-na.ssl-images-amazon.com/images/P/0399590588.01.L.jpg', description: 'Memoir of a woman who leaves her survivalist family to pursue education.', rating: 4.8, goodreads: 'https://www.goodreads.com/book/show/35133922-educated' },
  { id: 'bs2', title: 'Sapiens', author: 'Yuval Noah Harari', cover: 'https://images-na.ssl-images-amazon.com/images/P/0062316095.01.L.jpg', description: 'Brief history of humankind from Stone Age to modern times.', rating: 4.7, goodreads: 'https://www.goodreads.com/book/show/23692271-sapiens' },
  { id: 'bs3', title: 'The Midnight Library', author: 'Matt Haig', cover: 'https://images-na.ssl-images-amazon.com/images/P/0020421273.01.L.jpg', description: 'Explore infinite possibilities of the life you could have lived.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/52578297-the-midnight-library' },
  { id: 'bs4', title: 'Where the Crawdads Sing', author: 'Delia Owens', cover: 'https://images-na.ssl-images-amazon.com/images/P/0735219095.01.L.jpg', description: 'Coming-of-age mystery in the marshlands of North Carolina.', rating: 4.7, goodreads: 'https://www.goodreads.com/book/show/36809135-where-the-crawdads-sing' },
  { id: 'bs5', title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', cover: 'https://images-na.ssl-images-amazon.com/images/P/0399562761.01.L.jpg', description: 'Reclusive Hollywood icon reveals her glamorous, scandalous life.', rating: 4.7, goodreads: 'https://www.goodreads.com/book/show/36624175-the-seven-husbands-of-evelyn-hugo' },
  { id: 'bs6', title: 'It Ends with Us', author: 'Colleen Hoover', cover: 'https://images-na.ssl-images-amazon.com/images/P/1492210994.01.L.jpg', description: 'Powerful story of love, resilience, and difficult choices.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/27362503-it-ends-with-us' },
  { id: 'bs7', title: 'Verity', author: 'Colleen Hoover', cover: 'https://images-na.ssl-images-amazon.com/images/P/1492938700.01.L.jpg', description: 'Dark, twisted psychological thriller with shocking revelations.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/45047234-verity' },
  { id: 'bs8', title: 'The Alchemist', author: 'Paulo Coelho', cover: 'https://images-na.ssl-images-amazon.com/images/P/0061122416.01.L.jpg', description: 'Journey of self-discovery and following your personal legend.', rating: 4.5, goodreads: 'https://www.goodreads.com/book/show/865-the-alchemist' },
  { id: 'bs9', title: 'Circe', author: 'Madeline Miller', cover: 'https://images-na.ssl-images-amazon.com/images/P/031635859X.01.L.jpg', description: 'Enchanting reimagining of Greek mythology through a goddess\'s eyes.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/35959740-circe' },
  { id: 'bs10', title: 'The Song of Achilles', author: 'Madeline Miller', cover: 'https://images-na.ssl-images-amazon.com/images/P/0062060625.01.L.jpg', description: 'Epic retelling of ancient Greece\'s greatest warrior.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/11985571-the-song-of-achilles' },
  { id: 'bs11', title: 'Daisy Jones & The Six', author: 'Taylor Jenkins Reid', cover: 'https://images-na.ssl-images-amazon.com/images/P/0385541554.01.L.jpg', description: 'Oral history of a 1970s rock band and their rise to fame.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/39592309-daisy-jones-the-six' },
  { id: 'bs12', title: 'The Thursday Murder Club', author: 'Richard Osman', cover: 'https://images-na.ssl-images-amazon.com/images/P/0062913751.01.L.jpg', description: 'Charming mystery solved by retirement home residents.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/51810619-the-thursday-murder-club' },
  { id: 'bs13', title: 'The Midnight Library', author: 'Matt Haig', cover: 'https://images-na.ssl-images-amazon.com/images/P/0316494038.01.L.jpg', description: 'Philosophical fantasy about life choices and infinite possibilities.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/52578297-the-midnight-library' },
  { id: 'bs14', title: 'Lessons in Chemistry', author: 'Bonnie Garmus', cover: 'https://images-na.ssl-images-amazon.com/images/P/0385547692.01.L.jpg', description: 'Female chemist breaking barriers in 1960s America.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/58196315-lessons-in-chemistry' },
  { id: 'bs15', title: 'A Man Called Ove', author: 'Fredrik Backman', cover: 'https://images-na.ssl-images-amazon.com/images/P/1476738017.01.L.jpg', description: 'Heartwarming story of a grumpy man and his unlikely friendships.', rating: 4.6, goodreads: 'https://www.goodreads.com/book/show/18465396-a-man-called-ove' },
],
};

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

const formatBook = (book) => ({
  id: book.id,
  title: book.title,
  author: book.author,
  cover: book.cover,
  description: book.description,
  rating: book.rating,
  goodreads: book.goodreads,
});

// Get books by category (self-help, romance, thriller, bestseller)
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  const books = mockBooks[category.toLowerCase()];
  
  if (!books) return res.status(404).json({ message: 'Category not found' });
  
  try {
    const shuffled = shuffle([...books]);
    res.json(shuffled.map(formatBook));
  } catch (err) {
    console.error('Books error:', err.message);
    res.status(500).json({ message: 'Could not fetch books' });
  }
});

// AI book picks - personalized
router.get('/ai-picks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const categories = Object.keys(mockBooks);
    
    // If user has saved books, weight toward their preferences
    const pickedCategories = shuffle(categories).slice(0, 2);
    
    const picks = pickedCategories.map(cat => {
      const booksInCat = mockBooks[cat];
      return shuffle([...booksInCat]).slice(0, 3);
    }).flat();
    
    res.json({ 
      personalized: false,
      books: shuffle(picks).slice(0, 8).map(formatBook)
    });
  } catch (err) {
    console.error('AI picks error:', err.message);
    res.status(500).json({ message: 'Could not generate book picks' });
  }
});

// Like book
router.post('/like', auth, async (req, res) => {
  try {
    const { bookId } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.likedBooks) user.likedBooks = [];
    const idx = user.likedBooks.indexOf(bookId);
    
    if (idx > -1) user.likedBooks.splice(idx, 1);
    else user.likedBooks.push(bookId);
    
    await user.save();
    res.json({ likedBooks: user.likedBooks });
  } catch (err) {
    res.status(500).json({ message: 'Could not like book' });
  }
});

// Save book
router.post('/save', auth, async (req, res) => {
  try {
    const { book } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.savedBooks) user.savedBooks = [];
    const exists = user.savedBooks.find(b => b.id === book.id);
    
    if (exists) {
      user.savedBooks = user.savedBooks.filter(b => b.id !== book.id);
    } else {
      user.savedBooks.push(book);
    }
    
    await user.save();
    res.json({ savedBooks: user.savedBooks });
  } catch (err) {
    res.status(500).json({ message: 'Could not save book' });
  }
});

// Search books
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query required' });
  
  try {
    const allBooks = Object.values(mockBooks).flat();
    const results = allBooks.filter(b =>
      b.title.toLowerCase().includes(q.toLowerCase()) ||
      b.author.toLowerCase().includes(q.toLowerCase())
    );
    
    res.json(results.map(formatBook));
  } catch (err) {
    res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;