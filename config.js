/* ====================================================================
   LIBRISFLIX CONFIGURATION (config.js)
   Edit this file to customize site branding, rows, and feature flags.
   ==================================================================== */

const SITE_CONFIG = {
  // Brand & Identity
  siteName: "LibrisFlix",
  tagline: "The Great Works of World & Indian Literature, Adapted for the Screen",
  logoText: "LIBRISFLIX",
  logoImage: "assets/logo.png",
  showLogoImage: false,

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
      genre: ["Drama"], limit: 30
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
