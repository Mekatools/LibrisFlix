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
