/* ====================================================================
   LIBRISFLIX CONFIGURATION (config.js)
   Edit this file to customize site branding, rows, and feature flags.
   ==================================================================== */

const SITE_CONFIG = {
  // Brand & Identity
  siteName: "LibrisFlix",
  tagline: "The Great Works of World & Indian Literature, Adapted for the Screen",
  logoText: "LIBRISFLIX",
  logoImage: "logo.png",
  showLogoImage: true,

  // Color Theme
  theme: {
    primaryRed: "#e50914",
    darkBg: "#141414",
    cardBg: "#1f1f1f",
    textLight: "#ffffff",
    textMuted: "#aaaaaa",
    accentGold: "#d4af37"
  },

  // Feature Switches
  features: {
    enableContinueWatching: true,
    enableMyList: true,
    enableWatchHistory: true,
    enableAutoNext: true,
    enableSpeedControl: true,
    enableBookLinks: true,
    enableKeyboardShortcuts: true
  },

  reportLinkEmail: "curator@example.com",

  // Hero banner: id of the movie to feature (falls back to the first movie)
  featuredId: "phantom-opera-1925",

  // LIVE ROWS: titles are fetched from the Internet Archive when the site opens.
  // Only items marked public domain / Creative Commons, or in the Archive's
  // silent_films and feature_films collections, are shown. Edit liveBaseFilter to change that.
  liveBaseFilter: "mediatype:movies AND (licenseurl:*publicdomain* OR licenseurl:*creativecommons* OR collection:(silent_films OR feature_films))",

  // Homepage Rows definition
  homeRows: [
    {
      id: "row-continue",
      title: "Continue Watching",
      type: "continueWatching",
      icon: "fa-play-circle"
    },
    {
      id: "row-mylist",
      title: "My Reading & Watch List",
      type: "myList",
      icon: "fa-bookmark"
    },
    {
      id: "row-hindi-classics",
      title: "Indian Classics & Hindi Literature",
      type: "filter",
      filterKey: "language",
      filterValue: "Hindi",
      icon: "fa-film"
    },
    {
      id: "row-mythology",
      title: "Hindu Mythology: Ramayana, Mahabharata and More",
      type: "filter",
      filterKey: "tags",
      filterValue: "Hindu Mythology"
    },
    {
      id: "row-live-mythology",
      title: "More Mythology and Epics from the Archive",
      type: "live",
      query: 'title:(ramayana OR ramayan OR mahabharata OR mahabharat OR krishna OR hanuman OR "raja harishchandra" OR "lanka dahan" OR savitri OR "bhakta prahlad" OR "shri krishna" OR ganesh OR shiva OR "sita" OR "draupadi" OR "arjun")',
      language: "Hindi", author: "Indian Epics", genre: ["Mythology"], limit: 30
    },
    {
      id: "row-live-shakespeare",
      title: "Shakespeare on Screen",
      type: "live",
      query: 'title:(hamlet OR macbeth OR othello OR "romeo and juliet" OR "midsummer night" OR "taming of the shrew" OR "julius caesar" OR "richard iii")',
      author: "William Shakespeare", genre: ["Drama"], limit: 20
    },
    {
      id: "row-live-dickens",
      title: "Dickens and Victorian Novels",
      type: "live",
      query: 'title:("oliver twist" OR "david copperfield" OR "christmas carol" OR "great expectations" OR "tale of two cities" OR "jane eyre" OR "wuthering heights")',
      genre: ["Drama"], limit: 20
    },
    {
      id: "row-live-classics",
      title: "Classic Novels, Adapted",
      type: "live",
      query: 'title:("treasure island" OR "three musketeers" OR "monte cristo" OR "les miserables" OR "moby dick" OR "pride and prejudice" OR "little women" OR "tom sawyer" OR "robin hood" OR "ben-hur" OR "anna karenina")',
      genre: ["Adventure"], limit: 20
    },
    {
      id: "row-live-gothic",
      title: "Gothic Tales and Poe",
      type: "live",
      query: 'title:(dracula OR frankenstein OR "fall of the house of usher" OR "the raven" OR "invisible man" OR "phantom of the opera" OR "hunchback")',
      genre: ["Horror"], limit: 20
    },
    {
      id: "row-live-hindi",
      title: "Hindi and Indian Literature on Film",
      type: "live",
      query: 'language:(Hindi OR hin OR Urdu) AND (subject:(novel OR literature OR tagore OR premchand OR devdas OR ramayana OR mahabharata) OR title:(devdas OR godaan OR gaban OR ramayana OR mahabharat OR kabuliwala))',
      language: "Hindi", genre: ["Drama"], limit: 20
    },
    {
      id: "row-live-english-more",
      title: "More English Literary Films",
      type: "live",
      query: 'subject:(novel OR literature OR "based on the novel" OR "based on the book")',
      genre: ["Drama"], limit: 60
    },
    {
      id: "row-live-holmes",
      title: "Sherlock Holmes and Detective Fiction",
      type: "live",
      query: "title:(\"sherlock holmes\" OR \"hound of the baskervilles\" OR \"adventures of sherlock\" OR \"arsene lupin\" OR \"charlie chan\")",
      genre: ["Mystery"], limit: 60, author: "Sir Arthur Conan Doyle"
    },
    {
      id: "row-live-austen",
      title: "Austen, Bronte and Romance Classics",
      type: "live",
      query: "title:(\"pride and prejudice\" OR \"sense and sensibility\" OR emma OR \"jane eyre\" OR \"wuthering heights\" OR \"northanger abbey\" OR \"persuasion\" OR \"mansfield park\")",
      genre: ["Romance"], limit: 30
    },
    {
      id: "row-live-american",
      title: "American Classics: Twain, Hawthorne, London",
      type: "live",
      query: "title:(\"tom sawyer\" OR \"huckleberry finn\" OR \"connecticut yankee\" OR \"prince and the pauper\" OR \"last of the mohicans\" OR \"scarlet letter\" OR \"call of the wild\" OR \"sea wolf\" OR \"little women\" OR \"moby dick\")",
      genre: ["Adventure"], limit: 40
    },
    {
      id: "row-live-scifi",
      title: "Verne, Wells and Early Science Fiction",
      type: "live",
      query: "title:(\"20000 leagues\" OR \"twenty thousand leagues\" OR \"around the world in 80 days\" OR \"journey to the center\" OR \"time machine\" OR \"war of the worlds\" OR \"island of dr. moreau\" OR \"invisible man\" OR \"first men in the moon\" OR \"lost world\")",
      genre: ["Sci-Fi"], limit: 40
    },
    {
      id: "row-live-russian",
      title: "Russian Classics: Tolstoy, Dostoevsky, Chekhov",
      type: "live",
      query: "title:(\"anna karenina\" OR \"war and peace\" OR resurrection OR \"crime and punishment\" OR \"brothers karamazov\" OR \"the idiot\" OR \"dead souls\" OR \"cherry orchard\" OR \"the seagull\" OR \"uncle vanya\")",
      genre: ["Drama"], limit: 30
    },
    {
      id: "row-live-french",
      title: "French Literature: Hugo, Dumas, Rostand",
      type: "live",
      query: "title:(\"les miserables\" OR \"monte cristo\" OR \"three musketeers\" OR \"man in the iron mask\" OR \"madame bovary\" OR \"notre dame\" OR cyrano OR \"camille\" OR \"toilers of the sea\")",
      genre: ["Adventure"], limit: 40
    },
    {
      id: "row-live-wilde",
      title: "Wilde, Hardy, Stevenson and Kipling",
      type: "live",
      query: "title:(\"dorian gray\" OR \"importance of being earnest\" OR \"tess of the d'urbervilles\" OR \"kidnapped\" OR \"jungle book\" OR \"treasure island\" OR \"jekyll\" OR \"far from the madding crowd\" OR \"lady windermere\")",
      genre: ["Drama"], limit: 30
    },
    {
      id: "row-live-poe",
      title: "Edgar Allan Poe and Dark Tales",
      type: "live",
      query: "title:(\"masque of the red death\" OR \"tell-tale heart\" OR \"black cat\" OR \"pit and the pendulum\" OR \"rue morgue\" OR \"fall of the house of usher\" OR \"the raven\" OR \"premature burial\")",
      genre: ["Horror"], limit: 30, author: "Edgar Allan Poe"
    },
    {
      id: "row-live-family",
      title: "Fairy Tales and Children's Classics",
      type: "live",
      query: "title:(\"alice in wonderland\" OR \"peter pan\" OR \"wizard of oz\" OR \"pinocchio\" OR \"cinderella\" OR \"snow white\" OR \"heidi\" OR \"black beauty\" OR \"arabian nights\" OR \"aladdin\" OR \"robin hood\" OR \"sleeping beauty\")",
      genre: ["Family"], limit: 40
    },
    {
      id: "row-live-indian",
      title: "Tagore, Premchand and Indian Authors",
      type: "live",
      query: "title:(tagore OR premchand OR devdas OR kabuliwala OR godaan OR \"pather panchali\" OR charulata OR gitanjali OR \"home and the world\" OR sharatchandra)",
      genre: ["Drama"], limit: 30, language: "Indian Cinema"
    },
    {
      id: "row-live-epics",
      title: "Greek and Roman Epics",
      type: "live",
      query: "title:(odyssey OR iliad OR \"helen of troy\" OR ulysses OR hercules OR \"quo vadis\" OR \"ben-hur\" OR \"last days of pompeii\" OR spartacus OR antigone OR oedipus)",
      genre: ["Epic"], limit: 30
    },
    {
      id: "row-live-noir",
      title: "Crime Novels and Film Noir",
      type: "live",
      query: "title:(\"maltese falcon\" OR \"big sleep\" OR \"double indemnity\" OR \"postman always rings twice\" OR \"farewell my lovely\" OR \"murder my sweet\" OR scarface OR \"kiss me deadly\" OR \"detour\")",
      genre: ["Crime"], limit: 40
    },
    {
      id: "row-live-westerns",
      title: "Western and Adventure Novels",
      type: "live",
      query: "title:(\"virginian\" OR \"riders of the purple sage\" OR \"deerslayer\" OR \"robinson crusoe\" OR \"king solomon\" OR \"prisoner of zenda\" OR \"scaramouche\" OR \"captain blood\" OR \"sea hawk\")",
      genre: ["Adventure"], limit: 40
    },
    {
      id: "row-live-plays",
      title: "Plays on Screen",
      type: "live",
      query: "title:(pygmalion OR \"doll's house\" OR faust OR \"peer gynt\" OR \"arms and the man\" OR \"major barbara\" OR \"candida\" OR \"private lives\")",
      genre: ["Drama"], limit: 30
    },
    {
      id: "row-live-docs",
      title: "Authors and Literature Documentaries",
      type: "live",
      query: "(title:(author OR poet OR novelist OR poetry OR literature OR \"life of\") AND subject:(documentary OR biography OR education OR literature))",
      genre: ["Documentary"], limit: 40
    },
    {
      id: "row-live-silent",
      title: "Silent-Era Literary Films",
      type: "live",
      query: "collection:silent_films AND subject:(novel OR story OR literature OR \"based on\")",
      genre: ["Drama"], limit: 60
    },
    {
      id: "row-trending",
      title: "Trending Adaptations",
      type: "sort",
      sortBy: "year",
      order: "desc",
      limit: 10
    },
    {
      id: "row-shakespeare",
      title: "The Bard on Screen: William Shakespeare",
      type: "filter",
      filterKey: "author",
      filterValue: "William Shakespeare"
    },
    {
      id: "row-dickens",
      title: "Victorian Masterpieces: Charles Dickens",
      type: "filter",
      filterKey: "author",
      filterValue: "Charles Dickens"
    },
    {
      id: "row-horror-gothic",
      title: "Gothic & Macabre Classics",
      type: "filter",
      filterKey: "genre",
      filterValue: "Horror"
    },
    {
      id: "row-holmes",
      title: "The Arthur Conan Doyle & Detective Vault",
      type: "filter",
      filterKey: "author",
      filterValue: "Sir Arthur Conan Doyle"
    },
    {
      id: "row-adventures",
      title: "Epic Quests & High Adventure",
      type: "filter",
      filterKey: "genre",
      filterValue: "Adventure"
    },
    {
      id: "row-silent-era",
      title: "Early Cinema & The Silent Age",
      type: "filter",
      filterKey: "era",
      filterValue: "Silent Era"
    },
    {
      id: "row-shorts",
      title: "Short Literature Adaptations",
      type: "filter",
      filterKey: "tags",
      filterValue: "Short Film"
    }
  ]
};
