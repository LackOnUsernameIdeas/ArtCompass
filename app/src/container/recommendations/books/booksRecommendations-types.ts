import { Dispatch, SetStateAction } from "react";

// Вида на уведомлението.
export type NotificationType = "success" | "error" | "warning";

// Интерфейс за уведомление, което съдържа съобщение и тип на уведомлението.
export interface NotificationState {
  message: string;
  type: NotificationType;
}

// Интерфейс за жанр с английско и българско име.
export interface Genre {
  en: string; // Английско име на жанра
  bg: string; // Българско име на жанра
}

// Интерфейс за рейтинг на филм с източник и стойност.
export interface Rating {
  Source: string; // Източник на рейтинга
  Value: string; // Стойност на рейтинга
}

// Интерфейс за въпрос с възможности и стойности.
export interface Question {
  question: string; // Текст на въпроса
  options?: string[] | { en: string; bg: string }[]; // Падащо меню или множествен избор
  isMultipleChoice?: boolean; // Флаг за множествен избор
  isInput?: boolean; // Флаг за въпрос, изискващ текстов вход
  value: any; // Стойност на отговора
  setter: Dispatch<SetStateAction<any>>; // Сетър за стойността на отговора
  placeholder?: string; // Плейсхолдър за въпроси с текстов вход
  description?: string; // Допълнително описание на въпроса
}

// Интерфейс за филм с всички основни данни за филма.
export interface Movie {
  id: string; // ID на филма
  user_id: string; // ID на потребителя, свързан с филма
  imdbID: string; // IMDb идентификатор
  title: string; // Английско заглавие на филма
  bgName: string; // Българско заглавие на филма
  genre: string; // Жанрове на английски
  reason: string; // Причина за препоръката на филма
  description: string; // Описание на филма
  year: string; // Година на издаване
  rated: string; // Възрастова оценка
  released: string; // Дата на излизане
  runtime: string; // Времетраене в минути
  director: string; // Име на режисьора
  writer: string; // Име на сценариста
  actors: string; // Списък с актьори
  plot: string; // Сюжет на филма
  language: string; // Езици на филма
  country: string; // Страни, участващи в производството
  awards: string; // Награди, спечелени от филма
  poster: string; // URL на постера
  ratings: { Source: string; Value: string }[]; // Масив с рейтингови източници и стойности
  metascore: string; // Метаскор стойност
  imdbRating: string; // IMDb рейтинг
  imdbVotes: string; // Брой IMDb гласове
  type: string; // Вид (например, филм)
  DVD: string; // Информация за DVD издание (ако е налично)
  boxOffice: string; // Приходи от бокс офиса
  production: string; // Продуцентско студио (ако е налично)
  website: string; // Официален уебсайт (ако е наличен)
  totalSeasons: string | null; // Общо сезони (за сериали)
  date: string; // Дата на въвеждане на данните
}

// Интерфейс за предпочитания на потребителя.
export interface MoviesSeriesUserPreferences {
  type: string; // Вид на предпочитанията
  genres: { en: string; bg: string }[]; // Жанрове на английски и български
  moods: string[]; // Настроения
  timeAvailability: string; // Наличност на време
  age: string; // Възраст
  actors: string; // Любими актьори
  directors: string; // Любими режисьори
  interests: string; // Интереси
  countries: string; // Предпочитани държави
  pacing: string; // Пейсинг
  depth: string; // Дълбочина на историята
  targetGroup: string; // Целева група
}

// Пропс за компонентата Quiz, свързана с маркирането на филми.
export interface QuizProps {
  handleBookmarkClick: (movie: Movie) => void; // Функция за маркиране на филм
  bookmarkedMovies: { [key: string]: Movie }; // Списък с маркирани филми
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >; // Функция за актуализиране на маркираните филми
}

// Пропс за компонентата Recommendations, отговорна за показване на препоръки.
export interface RecommendationsProps {
  recommendationList: Movie[]; // Списък с препоръчани филми
  handleBookmarkClick: (movie: Movie) => void; // Функция за маркиране на филм
  bookmarkedMovies: { [key: string]: Movie }; // Списък с маркирани филми
}

// Пропс за компонентата RecommendationCard, която показва информация за филм.
export interface RecommendationCardProps {
  recommendationList: Movie[]; // Списък с препоръчани филми
  currentIndex: number; // Текущ индекс на филма
  isExpanded: boolean; // Флаг дали картата е разширена
  openModal: () => void; // Функция за отваряне на модала
  handleBookmarkClick: (movie: Movie) => void; // Функция за маркиране на филм
  bookmarkedMovies: { [key: string]: Movie }; // Списък с маркирани филми
}

// Пропс за компонентата PlotModal, показваща сюжетната линия на филма.
export interface PlotModalProps {
  recommendationList: Movie[]; // Списък с препоръчани филми
  currentIndex: number; // Текущ индекс на филма
  closeModal: () => void; // Функция за затваряне на модала
}

// Пропс за компонентата QuizQuestion, която съдържа въпросите и опции.
export interface QuizQuestionProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за зареждане
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за изпращане
  showViewRecommendations: boolean; // Флаг за показване на препоръките
  alreadyHasRecommendations: boolean; // Флаг за проверка дали вече има препоръки
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>; // Функция за задаване на списък с препоръки
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >; // Функция за актуализиране на маркираните филми
}

// Пропс за компонентата ViewRecommendations, която показва резултатите от препоръките.
export interface ViewRecommendationsProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за зареждане
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за изпращане
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на показване на въпрос
}

// Интерфейс за пропсите на модала за потвърждение
export interface ConfirmationModalProps {
  // Функция за задаване на уведомления с тип и съобщение
  setNotification: React.Dispatch<
    React.SetStateAction<{
      message: string;
      type: "success" | "error" | "warning";
    } | null>
  >;

  // Функция за задаване на състоянието за зареждане
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  // Функция за задаване на състоянието за изпращане
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;

  // Функция за задаване на състоянието за отваряне на модала
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Функция за обработка на изпращането на заявка
  handleSubmit: (
    setNotification: React.Dispatch<
      React.SetStateAction<{
        message: string;
        type: "success" | "error" | "warning";
      } | null>
    >,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
    setSubmitCount: React.Dispatch<React.SetStateAction<number>>,
    setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
    setBookmarkedMovies: React.Dispatch<
      React.SetStateAction<{
        [key: string]: any;
      }>
    >,
    moviesSeriesUserPreferences: MoviesSeriesUserPreferences,
    token: string | null,
    submitCount: number
  ) => Promise<void>;

  // Функция за задаване на броя на изпратените заявки
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>;

  // Функция за задаване на списък с препоръки
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>;

  // Функция за задаване на списък с любими филми
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >;

  // Предпочитания на потребителя
  moviesSeriesUserPreferences: MoviesSeriesUserPreferences;

  // Токен за автентикация на потребителя
  token: string | null;

  // Броят на изпратените заявки
  submitCount: number;
}
