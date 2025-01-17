import {
  Genre,
  Question,
  MoviesSeriesUserPreferences
} from "./moviesSeriesRecommendations-types";
import { NotificationState } from "../../types_common";
import { openAIKey } from "./moviesSeriesRecommendations-data";
import { genreOptions } from "../../data_common";
import {
  checkRecommendationExistsInWatchlist,
  showNotification
} from "../../helper_functions_common";

/**
 * Записва предпочитанията на потребителя в базата данни чрез POST заявка.
 * Ако не успее да запише предпочитанията, се хвърля грешка.
 *
 * @async
 * @function saveMoviesSeriesUserPreferences
 * @param {string} date - Датата на записа на предпочитанията.
 * @param {Object} moviesSeriesUserPreferences - Обект с предпочитанията на потребителя.
 * @param {string | null} token - Токенът на потребителя, използван за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но хвърля грешка при неуспех.
 * @throws {Error} - Хвърля грешка, ако заявката не е успешна.
 */
export const saveMoviesSeriesUserPreferences = async (
  date: string,
  moviesSeriesUserPreferences: {
    type: string;
    genres: { en: string; bg: string }[];
    moods: string[];
    timeAvailability: string;
    age: string;
    actors: string;
    directors: string;
    interests: string;
    countries: string;
    pacing: string;
    depth: string;
    targetGroup: string;
  },
  token: string | null
): Promise<void> => {
  try {
    const {
      type,
      genres,
      moods,
      timeAvailability,
      age,
      actors,
      directors,
      interests,
      countries,
      pacing,
      depth,
      targetGroup
    } = moviesSeriesUserPreferences;

    const preferredGenresEn =
      genres.length > 0 ? genres.map((g) => g.en).join(", ") : null;
    const preferredGenresBg =
      genres.length > 0 ? genres.map((g) => g.bg).join(", ") : null;

    console.log("preferences: ", {
      token: token,
      preferred_genres_en: preferredGenresEn,
      preferred_genres_bg: preferredGenresBg,
      mood: Array.isArray(moods) ? moods.join(", ") : null,
      timeAvailability,
      preferred_age: age,
      preferred_type: type,
      preferred_actors: actors,
      preferred_directors: directors,
      preferred_countries: countries,
      preferred_pacing: pacing,
      preferred_depth: depth,
      preferred_target_group: targetGroup,
      interests: interests || null,
      date: date
    });

    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/save-movies-series-user-preferences`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token,
          preferred_genres_en: preferredGenresEn,
          preferred_genres_bg: preferredGenresBg,
          mood: Array.isArray(moods) ? moods.join(", ") : null,
          timeAvailability,
          preferred_age: age,
          preferred_type: type,
          preferred_actors: actors,
          preferred_directors: directors,
          preferred_countries: countries,
          preferred_pacing: pacing,
          preferred_depth: depth,
          preferred_target_group: targetGroup,
          interests: interests || null,
          date: date
        })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save recommendation");
    }

    const result = await response.json();
    console.log("Recommendation saved successfully:", result);
  } catch (error) {
    console.error("Error saving recommendation:", error);
  }
};

/**
 * Извлича данни за филм от IMDb чрез няколко различни търсачки в случай на неуспех.
 * Ако не успее да извлече данни от всички търсачки, хвърля грешка.
 *
 * @async
 * @function fetchIMDbDataWithFailover
 * @param {string} movieName - Името на филма, за който се извличат данни.
 * @returns {Promise<Object>} - Връща обект с данни от IMDb за филма.
 * @throws {Error} - Хвърля грешка, ако не успее да извлече данни от всички търсачки.
 */
const fetchIMDbDataWithFailover = async (movieName: string) => {
  const engines = [
    { key: "AIzaSyAUOQzjNbBnGSBVvCZkWqHX7uebGZRY0lg", cx: "244222e4658f44b78" },
    { key: "AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA", cx: "27427e59e17b74763" },
    { key: "AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw", cx: "e59ceff412ebc4313" }
  ];

  for (let engine of engines) {
    try {
      const response = await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?key=${
          engine.key
        }&cx=${engine.cx}&q=${encodeURIComponent(movieName)}`
      );
      const data = await response.json();

      if (response.ok && !data.error && data.items) {
        console.log(
          `Fetched IMDb data successfully using engine: ${engine.cx}`
        );
        return data;
      } else {
        console.log(`Engine ${engine.cx} failed. Trying next...`);
      }
    } catch (error) {
      console.error(`Error fetching data with engine ${engine.cx}:`, error);
    }
  }
  throw new Error(
    `Failed to fetch IMDb data for "${movieName}" using all engines.`
  );
};

/**
 * Генерира препоръки за филми или сериали, базирани на предпочитанията на потребителя,
 * като използва OpenAI API за създаване на списък с препоръки.
 * Връща списък с препоръки в JSON формат.
 *
 * @async
 * @function generateMovieRecommendations
 * @param {string} date - Датата на генерирането на препоръките.
 * @param {MoviesSeriesUserPreferences} moviesSeriesUserPreferences - Преференциите на потребителя за филми/сериали.
 * @param {React.Dispatch<React.SetStateAction<any[]>>} setRecommendationList - Функция за задаване на препоръките в компонент.
 * @param {string | null} token - Токенът на потребителя, използван за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но актуализира препоръките.
 * @throws {Error} - Хвърля грешка, ако заявката за препоръки е неуспешна.
 */
export const generateMovieRecommendations = async (
  date: string,
  moviesSeriesUserPreferences: MoviesSeriesUserPreferences,
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >,
  token: string | null
) => {
  const {
    type,
    genres,
    moods,
    timeAvailability,
    age,
    actors,
    directors,
    interests,
    countries,
    pacing,
    depth,
    targetGroup
  } = moviesSeriesUserPreferences;
  try {
    const typeText = type === "Филм" ? "филма" : "сериала";
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: `You are an AI that recommends movies and series based on user preferences. Provide a list of movies and series, based on what the user has chosen to watch (movie or series), that match the user's taste and preferences, formatted in Bulgarian, with detailed justifications. Return the result in JSON format as instructed.`
          },
          {
            role: "user",
            content: `Препоръчай ми 5 ${typeText} за гледане, които ЗАДЪЛЖИТЕЛНО да съвпадат с моите вкусове и предпочитания, а именно:
                  Любими жанрове: ${genres.map((genre) => genre.bg)}.
                  Емоционално състояние в този момент: ${moods}.
                  Разполагаемо свободно време за гледане: ${timeAvailability}.
                  Възрастта на ${typeText} задължително да бъде: ${age}
                  Любими актьори: ${actors}.
                  Любими филмови режисьори: ${directors}.
                  Теми, които ме интересуват: ${interests}.
                  Филмите/сериалите могат да бъдат от следните страни: ${countries}.
                  Темпото (бързината) на филмите/сериалите предпочитам да бъде: ${pacing}.
                  Предпочитам филмите/сериалите да са: ${depth}.
                  Целевата група е: ${targetGroup}.
                  Дай информация за всеки отделен филм/сериал по отделно защо той е подходящ за мен.
                  Задължително искам имената на филмите/сериалите да бъдат абсолютно точно както са официално на български език – така, както са известни сред публиката в България.
                  Не се допуска буквален превод на заглавията от английски, ако официалното българско заглавие се различава от буквалния превод.
                  Не препоръчвай 18+ филми/сериали.
                  Форматирай своя response във валиден JSON формат по този начин:
                  {
                    'Официално име на ${typeText} на английски, както е прието да бъде': {
                      'bgName': 'Официално име на ${typeText} на български, както е прието да бъде, а не буквален превод',
                      'description': 'Описание на ${typeText}',
                      'reason': 'Защо този филм/сериал е подходящ за мен?'
                    },
                    'Официално име на ${typeText} на английски, както е прието да бъде': {
                      'bgName': 'Официално име на ${typeText} на български, както е прието да бъде, а не буквален превод',
                      'description': 'Описание на ${typeText}',
                      'reason': 'Защо този филм/сериал е подходящ за мен?'
                    },
                    // ...additional movies
                  }. Не добавяй излишни думи или скоби. Избягвай вложени двойни или единични кавички(кавички от един тип едно в друго, които да дават грешки на JSON.parse функцията). Увери се, че всички данни са правилно "escape-нати", за да не предизвикат грешки в JSON формата. 
                  JSON формата трябва да е валиден за JavaScript JSON.parse() функцията.`
          }
        ]
      })
    });

    const responseData = await response.json();
    const responseJson = responseData.choices[0].message.content;
    const unescapedData = responseJson
      .replace(/^```json([\s\S]*?)```$/, "$1")
      .replace(/^```JSON([\s\S]*?)```$/, "$1")
      .replace(/^```([\s\S]*?)```$/, "$1")
      .replace(/^'|'$/g, "")
      .trim();
    console.log("unescapedData: ", unescapedData);
    const decodedData = decodeURIComponent(unescapedData);
    console.log("decodedData: ", decodedData);
    const recommendations = JSON.parse(decodedData);
    console.log("recommendations: ", recommendations);

    for (const movieTitle in recommendations) {
      const movieName = movieTitle;

      const imdbData = await fetchIMDbDataWithFailover(movieName);

      if (Array.isArray(imdbData.items)) {
        const imdbItem = imdbData.items.find((item: { link: string }) =>
          item.link.includes("imdb.com/title/")
        );

        if (imdbItem) {
          const imdbUrl = imdbItem.link;
          const imdbId = imdbUrl.match(/title\/(tt\d+)\//)?.[1];

          const imdbRating = imdbItem.pagemap.metatags
            ? imdbItem.pagemap.metatags[0]["twitter:title"]?.match(
                /⭐ ([\d.]+)/
              )?.[1]
            : null;
          const runtime = imdbItem.pagemap.metatags
            ? imdbItem.pagemap.metatags[0]["og:description"]?.match(
                /(\d{1,2}h \d{1,2}m|\d{1,2}h|\d{1,3}m)/
              )?.[1]
            : null;

          const translatedRuntime = runtime
            ? runtime.replace(/h/g, "ч").replace(/m/g, "м").replace(/s/g, "с")
            : null;

          if (imdbId) {
            const omdbResponse = await fetch(
              `https://www.omdbapi.com/?apikey=89cbf31c&i=${imdbId}&plot=full`
            );
            const omdbData = await omdbResponse.json();

            console.log(
              `OMDb data for ${movieName}: ${JSON.stringify(omdbData, null, 2)}`
            );

            const recommendationData = {
              title: omdbData.Title,
              bgName: recommendations[movieTitle].bgName,
              description: recommendations[movieTitle].description,
              reason: recommendations[movieTitle].reason,
              year: omdbData.Year,
              rated: omdbData.Rated,
              released: omdbData.Released,
              runtime: omdbData.Runtime,
              runtimeGoogle: translatedRuntime,
              genre: omdbData.Genre,
              director: omdbData.Director,
              writer: omdbData.Writer,
              actors: omdbData.Actors,
              plot: omdbData.Plot,
              language: omdbData.Language,
              country: omdbData.Country,
              awards: omdbData.Awards,
              poster: omdbData.Poster,
              ratings: omdbData.Ratings,
              metascore: omdbData.Metascore,
              imdbRating: omdbData.imdbRating,
              imdbRatingGoogle: imdbRating,
              imdbVotes: omdbData.imdbVotes,
              imdbID: omdbData.imdbID,
              type: omdbData.Type,
              DVD: omdbData.DVD,
              boxOffice: omdbData.BoxOffice,
              production: omdbData.Production,
              website: omdbData.Website,
              totalSeasons: omdbData.totalSeasons
            };

            // Първо, задаваме списъка с препоръки
            setRecommendationList((prevRecommendations) => [
              ...prevRecommendations,
              recommendationData
            ]);

            // След това изпълняваме проверката и записа паралелно, използвайки
            const checkAndSaveMoviesSeriesRecommendation = async () => {
              // Проверяваме дали филмът съществува в таблицата за watchlist
              const existsInWatchlist =
                await checkRecommendationExistsInWatchlist(imdbId, token);

              // Ако филмът не съществува в watchlist, добавяме го към "bookmarkedMovies" с информация за ID и статус
              if (existsInWatchlist) {
                setBookmarkedMovies((prevMovies) => {
                  return {
                    ...prevMovies,
                    [recommendationData.imdbID]: recommendationData
                  };
                });
              }
              // Записваме препоръката в базата данни
              await saveMoviesSeriesRecommendation(
                recommendationData,
                date,
                token
              );
            };

            // Извикваме функцията, за да изпълним и двете операции
            checkAndSaveMoviesSeriesRecommendation();
          } else {
            console.log(`IMDb ID not found for ${movieName}`);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
  }
};

/**
 * Записва препоръка за филм или сериал в базата данни.
 * Препоръката съдържа подробности за филма/сериала като заглавие, жанр, рейтинг и други.
 * След успешното записване, препоръката се изпраща в сървъра.
 *
 * @async
 * @function saveMoviesSeriesRecommendation
 * @param {any} recommendation - Обект, съдържащ данни за препоръчания филм или сериал.
 * @param {string} date - Дата на генерирането на препоръката.
 * @param {string | null} token - Токенът на потребителя за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но извършва записване на препоръката.
 * @throws {Error} - Хвърля грешка, ако не може да се запази препоръката в базата данни.
 */
export const saveMoviesSeriesRecommendation = async (
  recommendation: any,
  date: string,
  token: string | null
) => {
  try {
    if (!recommendation || typeof recommendation !== "object") {
      console.warn("No valid recommendation data found.");
      return;
    }

    const genresEn = recommendation.genre
      ? recommendation.genre.split(", ")
      : null;

    const genresBg = genresEn.map((genre: string) => {
      const matchedGenre = genreOptions.find(
        (option) => option.en.trim() === genre.trim()
      );
      return matchedGenre ? matchedGenre.bg : null;
    });

    const runtime = recommendation.runtimeGoogle || recommendation.runtime;
    const imdbRating =
      recommendation.imdbRatingGoogle || recommendation.imdbRating;

    const formattedRecommendation = {
      token,
      imdbID: recommendation.imdbID || null,
      title_en: recommendation.title || null,
      title_bg: recommendation.bgName || null,
      genre_en: genresEn.join(", "),
      genre_bg: genresBg.join(", "),
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
      totalSeasons: recommendation.totalSeasons || null,
      date: date
    };

    console.log("Formatted Recommendation:", formattedRecommendation);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/save-movies-series-recommendation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedRecommendation)
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save recommendation");
    }

    const result = await response.json();
    console.log("Recommendation saved successfully:", result);
  } catch (error) {
    console.error("Error saving recommendation:", error);
  }
};

/**
 * Обработва изпращането на потребителски данни за генериране на препоръки.
 * Извършва валидация на полетата, изпраща заявка до сървъра и обновява списъка с препоръки.
 *
 * @async
 * @function handleSubmit
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Функция за задаване на статус на зареждане.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSubmitted - Функция за задаване на статус за подадена заявка.
 * @param {React.Dispatch<React.SetStateAction<number>>} setSubmitCount - Функция за актуализиране на броя на подадените заявки.
 * @param {React.Dispatch<React.SetStateAction<any[]>>} setRecommendationList - Функция за актуализиране на списъка с препоръки.
 * @param {MoviesSeriesUserPreferences} moviesSeriesUserPreferences - Преференции на потребителя за филми/сериали.
 * @param {string | null} token - Токенът за аутентификация на потребителя.
 * @param {number} submitCount - Броят на подадените заявки.
 * @returns {Promise<void>} - Няма връщан резултат, но актуализира препоръките и записва данни.
 * @throws {Error} - Хвърля грешка, ако не може да се обработи заявката.
 */
export const handleSubmit = async (
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationState | null>
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
): Promise<void> => {
  if (submitCount >= 20) {
    showNotification(
      setNotification,
      "Достигнахте максималния брой предложения! Максималният брой опити е 20 за днес. Можете да опитате отново утре!",
      "error"
    );
    return;
  }

  const {
    moods,
    timeAvailability,
    actors,
    directors,
    countries,
    pacing,
    depth,
    targetGroup
  } = moviesSeriesUserPreferences;

  if (
    !moods ||
    !timeAvailability ||
    !actors ||
    !directors ||
    !countries ||
    !pacing ||
    !depth ||
    !targetGroup
  ) {
    showNotification(
      setNotification,
      "Моля, попълнете всички задължителни полета!",
      "warning"
    );
    return;
  }

  setLoading(true);
  setSubmitted(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/handle-submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    const date = new Date().toISOString();

    if (response.status === 200) {
      setRecommendationList([]);
      await saveMoviesSeriesUserPreferences(
        date,
        moviesSeriesUserPreferences,
        token
      );
      await generateMovieRecommendations(
        date,
        moviesSeriesUserPreferences,
        setRecommendationList,
        setBookmarkedMovies,
        token
      );
      setSubmitCount((prevCount) => prevCount + 1);
    } else {
      showNotification(
        setNotification,
        data.error || "Възникна проблем.",
        "error"
      );
    }
  } catch (error) {
    console.error("Error submitting the request:", error);
    showNotification(
      setNotification,
      "Възникна проблем при изпращането на заявката.",
      "error"
    );
  } finally {
    setLoading(false);
  }
};

/**
 * Превключва състоянието на жанр в списъка на избраните жанрове.
 * Ако жанрът е вече в списъка, го премахва; ако не е, го добавя.
 *
 * @function toggleGenre
 * @param {Genre} genre - Жанрът, който трябва да бъде добавен или премахнат.
 * @param {React.Dispatch<React.SetStateAction<Genre[]>>} setGenres - Функцията за актуализиране на списъка с избрани жанрове.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на жанровете.
 */
export const toggleGenre = (
  genre: Genre,
  setGenres: React.Dispatch<React.SetStateAction<Genre[]>>
): void => {
  setGenres((prevGenres) =>
    prevGenres.find((g) => g.en === genre.en)
      ? prevGenres.filter((g) => g.en !== genre.en)
      : [...prevGenres, genre]
  );
};

/**
 * Проверява дали дадена опция е жанр, базирайки се на наличието на определени свойства в обекта.
 * Връща `true`, ако обектът има свойства `en` и `bg` със стойности от тип "string".
 *
 * @function isGenreOption
 * @param {any} option - Опцията, която трябва да бъде проверена.
 * @returns {boolean} - Връща `true`, ако опцията е жанр, в противен случай `false`.
 */
export function isGenreOption(option: any): option is Genre {
  return (
    option && typeof option.en === "string" && typeof option.bg === "string"
  );
}

/**
 * Обработва избора на отговор от потребителя в зависимост от типа на въпроса (множество или един отговор).
 * Актуализира състоянието на отговорите и жанровете в компонента.
 *
 * @async
 * @function handleAnswerClick
 * @param {React.Dispatch<React.SetStateAction<any>>} setter - Функцията за актуализиране на отговорите в компонента.
 * @param {string} answer - Избраният отговор от потребителя.
 * @param {React.Dispatch<React.SetStateAction<Genre[]>>} setGenres - Функцията за актуализиране на избраните жанрове.
 * @param {Question} currentQuestion - Текущият въпрос, с неговите свойства.
 * @param {string[] | null} selectedAnswer - Съществуващият избран отговор.
 * @param {React.Dispatch<React.SetStateAction<string[] | null>>} setSelectedAnswer - Функцията за актуализиране на състоянието на избраните отговори.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието.
 */
export const handleAnswerClick = (
  setter: React.Dispatch<React.SetStateAction<any>>,
  answer: string,
  setGenres: React.Dispatch<React.SetStateAction<Genre[]>>,
  currentQuestion: Question,
  selectedAnswer: string[] | null,
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string[] | null>>
) => {
  if (currentQuestion.isMultipleChoice) {
    if (currentQuestion.setter === setGenres) {
      const selectedGenre = genreOptions.find((genre) => genre.bg === answer);

      if (selectedGenre) {
        toggleGenre(selectedGenre, setGenres);

        return selectedAnswer;
      }

      return selectedAnswer;
    } else {
      setSelectedAnswer((prev) => {
        const updatedAnswers = prev
          ? prev.includes(answer)
            ? prev.filter((item) => item !== answer)
            : [...prev, answer]
          : [answer];
        setter(updatedAnswers);
        return updatedAnswers;
      });
    }
  } else {
    setter(answer);
    setSelectedAnswer([answer]);
  }
};

/**
 * Връща CSS клас, който задава марж в зависимост от броя на опциите за текущия въпрос.
 *
 * @function getMarginClass
 * @param {Question} question - Текущият въпрос, съдържащ информация за опциите.
 * @returns {string} - Строка с CSS клас, който определя маржа за въпроса.
 */
export const getMarginClass = (question: Question): string => {
  if (question.isInput) {
    return question.description ? "mt-[5rem]" : "mt-[9rem]";
  }

  const length = question.options?.length || 0;

  switch (true) {
    case length > 20:
      return "mt-[1rem]";
    case length > 15:
      return "mt-[2rem]";
    case length > 10:
      return "mt-[1rem]";
    case length >= 6:
      return "mt-0"; // Zero margin remains unchanged
    case length >= 4:
      return "mt-[1.5rem]";
    case length >= 3:
      return "mt-[3rem]";
    default:
      return "mt-[9rem]";
  }
};

/**
 * Обработва промяната на стойността в текстовото поле.
 * Актуализира състоянието на полето с новата стойност.
 *
 * @function handleInputChange
 * @param {React.Dispatch<React.SetStateAction<any>>} setter - Функцията за актуализиране на състоянието на стойността.
 * @param {string} value - Новата стойност, въведена в полето.
 * @returns {void} - Няма връщан резултат, но актуализира стойността в състоянието.
 */
export const handleInputChange = (
  setter: React.Dispatch<React.SetStateAction<any>>,
  value: string
): void => {
  setter(value);
};

/**
 * Обработва показването на препоръки, като скрива въпроса и показва индикатор за зареждане.
 * След време показва резултата от подадените отговори.
 *
 * @function handleViewRecommendations
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setShowQuestion - Функцията за скриване на въпроса.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Функцията за показване на индикатора за зареждане.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSubmitted - Функцията за показване на резултата.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на компонента.
 */
export const handleViewRecommendations = (
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setShowQuestion(false);
  setLoading(true);

  setTimeout(() => {
    setSubmitted(true);
    setLoading(false);
  }, 500);
};

/**
 * Обработва преминаването към следващия въпрос в анкета/въпросник.
 * Актуализира индекса на текущия въпрос и показва новия въпрос.
 *
 * @function handleNext
 * @param {React.Dispatch<React.SetStateAction<string[] | null>>} setSelectedAnswer - Функцията за изчистване на избраните отговори.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setShowQuestion - Функцията за показване на следващия въпрос.
 * @param {React.Dispatch<React.SetStateAction<number>>} setCurrentQuestionIndex - Функцията за актуализиране на индекса на текущия въпрос.
 * @param {any[]} questions - Массив от въпроси за анкета.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на въпросите.
 */
export const handleNext = (
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string[] | null>>,
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  questions: any[]
): void => {
  setSelectedAnswer(null);
  setShowQuestion(false);
  setTimeout(() => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setShowQuestion(true);
  }, 300);
};

/**
 * Обработва връщането към предишния въпрос в анкета/въпросник.
 * Актуализира индекса на текущия въпрос и показва предишния въпрос.
 *
 * @function handleBack
 * @param {React.Dispatch<React.SetStateAction<string[] | null>>} setSelectedAnswer - Функцията за изчистване на избраните отговори.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setShowQuestion - Функцията за показване на предишния въпрос.
 * @param {React.Dispatch<React.SetStateAction<number>>} setCurrentQuestionIndex - Функцията за актуализиране на индекса на текущия въпрос.
 * @param {any[]} questions - Массив от въпроси за анкета.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на въпросите.
 */
export const handleBack = (
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string[] | null>>,
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  questions: any[]
): void => {
  setSelectedAnswer(null);
  setShowQuestion(false);
  setTimeout(() => {
    setCurrentQuestionIndex(
      (prev) => (prev - 1 + questions.length) % questions.length
    );
    setShowQuestion(true);
  }, 300);
};

/**
 * Обработва започването на нова анкета, като нулира състоянието на отговорите и резултатите.
 *
 * @function handleRetakeQuiz
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Функцията за показване на индикатора за зареждане.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSubmitted - Функцията за нулиране на състоянието на резултата.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на компонентите.
 */
export const handleRetakeQuiz = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setLoading(true);
  setTimeout(() => {
    setSubmitted(false);
    setLoading(false);
  }, 500);
};
