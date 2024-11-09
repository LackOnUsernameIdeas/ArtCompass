// home-types.ts

export interface CommonData {
  avg_imdb_rating: number;
  total_box_office: string;
  total_recommendations: number;
  total_wins: number;
  total_nominations: number;
  prosperityScore: number;
}

export interface DirectorData extends CommonData {
  director: string;
  movie_count: number;
}

export interface ActorData extends CommonData {
  actor: string;
  movie_count: number;
}

export interface WriterData extends CommonData {
  writer: string;
  movie_count: number;
}

export type UsersCountData = {
  user_count: number;
};

export type DataType = {
  usersCount: UsersCountData[];
  topRecommendations: any[];
  topGenres: any[];
  genrePopularityOverTime: Record<string, any>;
  topActors: any[];
  topDirectors: any[];
  topWriters: any[];
  oscarsByMovie: any[];
  totalAwardsByMovieOrSeries: any[];
  totalAwards: any[];
  sortedDirectorsByProsperity: any[];
  sortedActorsByProsperity: any[];
  sortedWritersByProsperity: any[];
  sortedMoviesByProsperity: any[];
  sortedMoviesAndSeriesByMetascore: any[];
  sortedMoviesAndSeriesByIMDbRating: any[];
  averageBoxOfficeAndScores: any[];
  topCountries: any[];
};

export interface MovieData {
  title: string;
  boxOffice: number | string;
  imdbRating: number;
  metascore: number;
  type?: "movie" | "series";
  title_bg: string;
}

export interface AverageBoxOfficeAndScores {
  average_box_office: string;
  average_metascore: string;
  average_imdb_rating: string;
  average_rotten_tomatoes: string;
}

export interface CountryData {
  country: string;
  count: number;
}

export type FilteredTableData = (DirectorData | ActorData | WriterData)[];

// Define the structure of the genre popularity data for each year
export interface GenrePopularityData {
  [year: string]: {
    [genre: string]: {
      genre_en: string;
      genre_bg: string;
      genre_count: number;
    };
  };
}

export interface MovieProsperityData {
  imdbID: string;
  title_en: string;
  title_bg: string;
  type: string;
  imdbRating: string;
  metascore: string;
  total_box_office: string;
  rotten_tomatoes: string;
  total_recommendations: number;
  total_wins: string;
  total_nominations: string;
  prosperityScore: number;
}

// Define the structure for each series data (for each genre)
export interface GenreSeriesData {
  name: string; // Genre name (e.g., Crime, Drama)
  data: { x: string; y: number }[]; // Data points: year (x) and genre count (y)
}

// Define the final chart data format (an array of genres and their respective data)
export type HeatmapData = GenreSeriesData[];
