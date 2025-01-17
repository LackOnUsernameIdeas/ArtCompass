import { moviesSeriesGenreOptions } from "./data_common";
import {
  ActorData,
  DirectorData,
  NotificationState,
  NotificationType,
  WriterData
} from "./types_common";

// ==============================
// Type Guards
// ==============================

/**
 * Проверява дали даден обект е от тип DirectorData.
 *
 * @param {any} item - Обектът за проверка.
 * @returns {boolean} - Вярно, ако обектът е DirectorData.
 */
export const isDirector = (item: any): item is DirectorData =>
  item && "director_bg" in item;

/**
 * Проверява дали даден обект е от тип ActorData.
 *
 * @param {any} item - Обектът за проверка.
 * @returns {boolean} - Вярно, ако обектът е ActorData.
 */
export const isActor = (item: any): item is ActorData =>
  item && "actor_bg" in item;

/**
 * Проверява дали даден обект е от тип WriterData.
 *
 * @param {any} item - Обектът за проверка.
 * @returns {boolean} - Вярно, ако обектът е WriterData.
 */
export const isWriter = (item: any): item is WriterData =>
  item && "writer_bg" in item;

// ==============================
// Функции за работа с данни
// ==============================

/**
 * Изпраща уведомление със съобщение и тип към състоянието на уведомления.
 * Използва се за показване на различни уведомления (например: успех, грешка и т.н.).
 *
 * @function showNotification
 * @param {React.Dispatch<React.SetStateAction<NotificationState | null>>} setNotification - Функция за задаване на състоянието на уведомлението.
 * @param {string} message - Съобщението, което ще бъде показано в уведомлението.
 * @param {NotificationType} type - Типът на уведомлението, например: 'успех', 'грешка', 'информация' и т.н.
 * @returns {void} - Функцията не връща стойност, а само актуализира състоянието на уведомлението.
 */
export const showNotification = (
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationState | null>
  >,
  message: string,
  type: NotificationType
) => {
  // Актуализира състоянието на уведомлението със съобщение и тип
  setNotification({ message, type });
};

/**
 * Превежда текста от английски на български, като използва Google Translate API.
 * Ако заявката за превод е неуспешна, се връща оригиналният текст.
 *
 * @async
 * @function translate
 * @param {string} entry - Текстът, който трябва да бъде преведен.
 * @returns {Promise<string>} - Преведеният текст на български език.
 * @throws {Error} - Хвърля грешка, ако не успее да преведе текста.
 */
export async function translate(entry: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bg&dt=t&q=${encodeURIComponent(
    entry
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const flattenedTranslation = data[0]
      .map((item: [string]) => item[0])
      .join(" ");

    const mergedTranslation = flattenedTranslation.replace(/\s+/g, " ").trim();
    return mergedTranslation;
  } catch (error) {
    console.error(`Error translating entry: ${entry}`, error);
    return entry;
  }
}

/**
 * Превежда текст от чужд език на български, използвайки Google Translate API.
 * Детектира входния език.
 * Ако заявката за превод е неуспешна, се връща оригиналният текст.
 *
 * @async
 * @function translateWithDetection
 * @param {string} entry - Текстът, който трябва да бъде преведен.
 * @returns {Promise<string>} - Преведеният текст на български език, или оригиналният текст, ако не е на английски или при грешка.
 * @throws {Error} - Хвърля грешка, ако не успее да преведе текста.
 */
export async function translateWithDetection(entry: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=bg&dt=t&q=${encodeURIComponent(
    entry
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const flattenedTranslation = data[0]
      .map((item: [string]) => item[0])
      .join(" ");

    const mergedTranslation = flattenedTranslation.replace(/\s+/g, " ").trim();
    return mergedTranslation;
  } catch (error) {
    console.error(`Error translating entry: ${entry}`, error);
    return entry;
  }
}

/**
 * Проверява дали препоръката вече съществува в списъка за гледане на потребителя.
 *
 * @async
 * @function checkRecommendationExistsInWatchlist
 * @param {string} imdbID - IMDb ID на препоръката.
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<boolean>} - Връща true, ако препоръката вече съществува.
 * @throws {Error} - Хвърля грешка, ако проверката не може да бъде извършена.
 */
export const checkRecommendationExistsInWatchlist = async (
  imdbID: string,
  token: string | null
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/check-for-recommendation-in-list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          imdbID,
          recommendationType: "movies_series"
        })
      }
    );

    if (response.status === 404) {
      throw new Error("Грешка при проверка на списъка за гледане.");
    }

    const result = await response.json();
    console.log("result: ", result.exists, imdbID);

    return result.exists || false;
  } catch (error) {
    console.error("Грешка при проверката:", error);
    return false;
  }
};

/**
 * Проверява дали препоръката вече съществува в списъка за четене на потребителя.
 *
 * @async
 * @function checkRecommendationExistsInWatchlist
 * @param {string} google_books_id - google_books_id на препоръката.
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<boolean>} - Връща true, ако препоръката вече съществува.
 * @throws {Error} - Хвърля грешка, ако проверката не може да бъде извършена.
 */
export const checkRecommendationExistsInReadlist = async (
  book_id: string,
  token: string | null
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/check-for-recommendation-in-list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          source: import.meta.env.VITE_BOOKS_SOURCE,
          book_id,
          recommendationType: "books"
        })
      }
    );

    if (response.status === 404) {
      throw new Error("Грешка при проверка на списъка за четене.");
    }

    const result = await response.json();
    console.log(
      "result: ",
      result.exists,
      book_id,
      "source: ",
      import.meta.env.VITE_BOOKS_SOURCE
    );

    return result.exists || false;
  } catch (error) {
    console.error("Грешка при проверката:", error);
    return false;
  }
};

/**
 * Записва препоръка за филм или сериал в списъка за гледане на потребителя.
 * Препоръката съдържа подробности като заглавие, жанр, рейтинг и други.
 * След успешното записване, данните се изпращат до сървъра чрез съответния API маршрут.
 *
 * @async
 * @function saveToWatchlist
 * @param {any} recommendation - Обект с данни за препоръката (филм или сериал).
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<void>} - Няма върнат резултат, но изпраща заявка към сървъра.
 * @throws {Error} - Хвърля грешка, ако данните не могат да бъдат записани.
 */
export const saveToWatchlist = async (
  recommendation: any,
  token: string | null
): Promise<void> => {
  try {
    if (!recommendation || typeof recommendation !== "object") {
      console.warn("Няма валидни данни за препоръката.");
      return;
    }

    // Проверка дали съществува в списъка за гледане
    const exists = await checkRecommendationExistsInWatchlist(
      recommendation.imdbID,
      token
    );

    if (exists) {
      console.log("Препоръката вече е добавена в списъка за гледане.");
      return;
    }

    const title_en = recommendation.title_en || recommendation.title || null;
    const title_bg = recommendation.title_bg || recommendation.bgName || null;
    const genresEn = recommendation.genre_en || recommendation.genre || null;

    const genresEnArray = recommendation.genre
      ? recommendation.genre.split(", ")
      : null;

    const genresBg =
      recommendation.genre_bg ||
      genresEnArray
        .map((genre: string) => {
          const matchedGenre = moviesSeriesGenreOptions.find(
            (option) => option.en.trim() === genre.trim()
          );
          return matchedGenre ? matchedGenre.bg : null;
        })
        .join(", ") ||
      null;

    const runtime = recommendation.runtimeGoogle || recommendation.runtime;
    const imdbRating =
      recommendation.imdbRatingGoogle || recommendation.imdbRating;

    const formattedRecommendation = {
      token,
      imdbID: recommendation.imdbID || null,
      title_en: title_en,
      title_bg: title_bg,
      genre_en: genresEn,
      genre_bg: genresBg,
      reason: recommendation.reason || null,
      description: recommendation.description || null,
      year: recommendation.year || null,
      rated: recommendation.rated || null,
      released: recommendation.released || null,
      runtime: runtime || null,
      director: recommendation.director || null,
      writer: recommendation.writer || null,
      actors: recommendation.actors || null,
      plot: recommendation.plot || null,
      language: recommendation.language || null,
      country: recommendation.country || null,
      awards: recommendation.awards || null,
      poster: recommendation.poster || null,
      ratings: recommendation.ratings || [],
      metascore: recommendation.metascore || null,
      imdbRating: imdbRating || null,
      imdbVotes: recommendation.imdbVotes || null,
      type: recommendation.type || null,
      DVD: recommendation.DVD || null,
      boxOffice: recommendation.boxOffice || null,
      production: recommendation.production || null,
      website: recommendation.website || null,
      totalSeasons: recommendation.totalSeasons || null
    };

    console.log("formattedRecommendation: ", formattedRecommendation);
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/save-to-list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recommendationType: "movies_series",
          recommendation: formattedRecommendation
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        "Неуспешно записване на препоръката в списъка за гледане."
      );
    }

    const result = await response.json();
    console.log("Препоръката е успешно добавена:", result);
  } catch (error) {
    console.error("Грешка при записването в списъка за гледане:", error);
  }
};

/**
 * Записва препоръка за книга в списъка за четене на потребителя.
 * Препоръката съдържа подробности като заглавие, жанр, рейтинг и други.
 * След успешното записване, данните се изпращат до сървъра чрез съответния API маршрут.
 *
 * @async
 * @function saveToReadlist
 * @param {any} recommendation - Обект с данни за препоръката (книга).
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<void>} - Няма върнат резултат, но изпраща заявка към сървъра.
 * @throws {Error} - Хвърля грешка, ако данните не могат да бъдат записани.
 */
export const saveToReadlist = async (
  recommendation: any,
  token: string | null
): Promise<void> => {
  try {
    if (!recommendation || typeof recommendation !== "object") {
      console.warn("Няма валидни данни за препоръката.");
      return;
    }

    // Проверка дали съществува в списъка за четене
    const exists = await checkRecommendationExistsInReadlist(
      recommendation.google_books_id || recommendation.goodreads_id,
      token
    );

    if (exists) {
      console.log("Препоръката вече е добавена в списъка за четене.");
      return;
    }

    const formattedRecommendation = {
      token,
      google_books_id: recommendation.google_books_id || null,
      goodreads_id: recommendation.goodreads_id || null,
      title_en: recommendation.title_en || null,
      original_title: recommendation.original_title || null,
      title_bg: recommendation.title_bg || null,
      real_edition_title: recommendation.real_edition_title || null,
      author: recommendation.author || null,
      genre_en: recommendation.genres_en || null,
      genre_bg: recommendation.genres_bg || null,
      description: recommendation.description || null,
      language: recommendation.language || null,
      origin: recommendation.origin || null,
      date_of_first_issue: recommendation.date_of_first_issue || null,
      date_of_issue: recommendation.date_of_issue || null,
      publisher: recommendation.publisher || null,
      goodreads_rating: recommendation.goodreads_rating || null,
      goodreads_ratings_count: recommendation.goodreads_ratings_count || null,
      goodreads_reviews_count: recommendation.goodreads_reviews_count || null,
      reason: recommendation.reason || null,
      adaptations: recommendation.adaptations || null,
      ISBN_10: recommendation.ISBN_10 || null,
      ISBN_13: recommendation.ISBN_13 || null,
      page_count: recommendation.page_count || null,
      book_format: recommendation.book_format || null,
      imageLink: recommendation.imageLink || null,
      literary_awards: recommendation.literary_awards || null,
      setting: recommendation.setting || null,
      characters: recommendation.characters || null,
      series: recommendation.series || null,
      source: recommendation.source || null
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/save-to-list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recommendationType: "books",
          recommendation: formattedRecommendation
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        "Неуспешно записване на препоръката в списъка за четене."
      );
    }

    const result = await response.json();
    console.log("Препоръката е успешно добавена:", result);
  } catch (error) {
    console.error("Грешка при записването в списъка за четене:", error);
  }
};

/**
 * Премахва филм или сериал от списъка за гледане на потребителя.
 *
 * @async
 * @function removeFromWatchlist
 * @param {string} imdbID - Уникален идентификатор на филма или сериала (IMDb ID).
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<void>} - Няма върнат резултат, но изпраща заявка към сървъра.
 * @throws {Error} - Хвърля грешка, ако данните не могат да бъдат премахнати.
 */
export const removeFromWatchlist = async (
  imdbID: string,
  token: string | null
): Promise<void> => {
  try {
    if (!imdbID) {
      console.warn("IMDb ID is required to remove a movie from the watchlist.");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/remove-from-list`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          imdbID,
          recommendationType: "movies_series"
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to remove the movie or series from the watchlist."
      );
    }

    const result = await response.json();
    console.log("Successfully removed from watchlist:", result);
  } catch (error) {
    console.error("Error removing from watchlist:", error);
  }
};

/**
 * Премахва книга от списъка за четене на потребителя.
 *
 * @async
 * @function removeFromReadlist
 * @param {string} google_books_id - Уникален идентификатор на книгата.
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<void>} - Няма върнат резултат, но изпраща заявка към сървъра.
 * @throws {Error} - Хвърля грешка, ако данните не могат да бъдат премахнати.
 */
export const removeFromReadlist = async (
  book_id: string,
  token: string | null
): Promise<void> => {
  try {
    if (!book_id) {
      console.warn("book_id is required to remove a book from the readlist.");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/remove-from-list`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          source: import.meta.env.VITE_BOOKS_SOURCE,
          book_id,
          recommendationType: "books"
        })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove the book from the readlist.");
    }

    const result = await response.json();
    console.log("Successfully removed from readlist:", result);
  } catch (error) {
    console.error("Error removing from readlist:", error);
  }
};

/**
 * Проверява дали токенът, съхранен в localStorage или sessionStorage, е валиден,
 * и връща URL за пренасочване, ако токенът не е валиден.
 *
 * @async
 * @function checkTokenValidity
 * @returns {Promise<string | null>} - Връща URL за пренасочване или null, ако токенът е валиден.
 * @throws {Error} - Хвърля грешка, ако заявката за проверка на токена е неуспешна.
 */
export const checkTokenValidity = async (): Promise<string | null> => {
  // Извличане на токена от localStorage или sessionStorage
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  if (!token) {
    // Ако няма намерен токен, връща URL за пренасочване
    return "/signin";
  }

  try {
    // Изпращане на заявка за валидиране на токена
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/token-validation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token }) // Предаване на токена в тялото на заявката
      }
    );

    const data = await response.json(); // Извличане на отговора като JSON

    if (!data.valid) {
      // Ако "valid" в отговора е false, връща URL за пренасочване
      console.warn("Token is invalid, redirecting to /signin...");
      return "/signin";
    }

    return null; // Токенът е валиден, няма нужда от пренасочване
  } catch (error) {
    // Обработка на грешки при валидирането на токена
    console.error("Error validating token:", error);
    return "/signin"; // Пренасочване към страницата за вход
  }
};
