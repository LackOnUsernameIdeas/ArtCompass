import { FC, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Genre, QuizQuestionProps } from "../booksRecommendations-types";
import {
  handleAnswerClick,
  handleInputChange,
  handleBack,
  handleNext,
  isGenreOption,
  handleSubmit,
  getMarginClass
} from "../helper_functions";
import {
  ageOptions,
  moodOptions,
  timeAvailabilityOptions,
  pacingOptions,
  depthOptions,
  targetGroupOptions
} from "../../movies_series/moviesSeriesRecommendations-data";
import { genreOptions } from "../../../data_common";
import { ConfirmationModal } from "./ConfirmationModal";
import { ViewRecommendations } from "./ViewRecommendations";
import Notification from "../../../../components/common/notification/Notification";

export const QuizQuestions: FC<QuizQuestionProps> = ({
  setLoading,
  setSubmitted,
  showViewRecommendations,
  alreadyHasRecommendations,
  setRecommendationList,
  setBookmarkedMovies
}) => {
  const [type, setType] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [timeAvailability, setTimeAvailability] = useState("");
  const [age, setAge] = useState("");
  const [actors, setActors] = useState("");
  const [directors, setDirectors] = useState("");
  const [interests, setInterests] = useState("");
  const [countries, setCountries] = useState("");
  const [pacing, setPacing] = useState("");
  const [depth, setDepth] = useState("");
  const [targetGroup, setTargetGroup] = useState("");

  const [submitCount, setSubmitCount] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string[] | null>(null);
  const typeOptions = ["Филм", "Сериал"];
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const questions = [
    {
      question: "Какво търсите - филм или сериал?",
      options: typeOptions,
      value: type,
      setter: setType
    },
    {
      question: "Кои жанрове Ви се гледат в момента?",
      options: genreOptions,
      isMultipleChoice: true,
      value: genres,
      setter: setGenres
    },
    {
      question: "Как се чувствате в момента?",
      options: moodOptions,
      isMultipleChoice: true,
      value: moods,
      setter: setMoods
    },
    {
      question: "С какво време за гледане разполагате?",
      options: timeAvailabilityOptions,
      value: timeAvailability,
      setter: setTimeAvailability
    },
    {
      question: "Изберете приблизително време на създаване на филма/сериала?",
      options: ageOptions,
      value: age,
      setter: setAge
    },
    {
      question: "Кои са вашите любими актьори?",
      isInput: true,
      value: actors,
      setter: setActors,
      placeholder: "Пример: Брад Пит, Леонардо ди Каприо, Ема Уотсън"
    },
    {
      question: "Кои филмови режисьори предпочитате?",
      isInput: true,
      value: directors,
      setter: setDirectors,
      placeholder: "Пример: Дъфър брадърс, Стивън Спилбърг, Джеки Чан"
    },
    {
      question: "От кои страни предпочитате да е филмът/сериалът?",
      isInput: true,
      value: countries,
      setter: setCountries,
      placeholder: "Пример: България, САЩ"
    },
    {
      question:
        "Филми/Сериали с каква бързина на развитие на сюжетното действие предпочитате?",
      options: pacingOptions,
      value: pacing,
      setter: setPacing
    },
    {
      question: "Филми/Сериали с какво ниво на задълбочаване харесвате?",
      options: depthOptions,
      value: depth,
      setter: setDepth
    },
    {
      question: "Каква е вашата целева група?",
      options: targetGroupOptions,
      value: targetGroup,
      setter: setTargetGroup
    },
    {
      question: "Какви теми ви интересуват?",
      isInput: true,
      value: interests,
      setter: setInterests,
      placeholder: "Опишете темите, които ви интересуват",
      description:
        "Предпочитате филм/сериал, който засяга определена историческа епоха, държава или дори представя история по действителен случай? Интересуват ви филми, в които се разследва мистерия или социален проблем, или такива, в които животни играят важна роля? А какво ще кажете за филми, свързани с пътешествия и изследване на света, или пък разкази за въображаеми светове? Дайте описание. Можете също така да споделите примери за филми/сериали, които предпочитате."
    }
  ];
  const totalQuestions = questions.length;
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  const moviesSeriesUserPreferences = {
    type,
    genres,
    moods: moods?.map((mood) => mood.split(" ")[0]),
    timeAvailability,
    age,
    actors,
    directors,
    interests,
    countries,
    pacing,
    depth,
    targetGroup
  };

  const isBackDisabled = currentQuestionIndex === 0;
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (currentQuestion.isInput && currentQuestion.setter === setInterests) {
      currentQuestion.value = interests;
    }
  }, [currentQuestion, interests]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleClick = () => {
    if (
      !(
        (selectedAnswer && selectedAnswer.length > 0) ||
        (currentQuestion.isInput &&
          typeof currentQuestion.value === "string" &&
          currentQuestion.value.trim() !== "")
      )
    ) {
      return;
    }

    if (currentQuestionIndex === totalQuestions - 1) {
      if (alreadyHasRecommendations) {
        handleOpenModal();
      } else {
        handleSubmit(
          setNotification,
          setLoading,
          setSubmitted,
          setSubmitCount,
          setRecommendationList,
          setBookmarkedMovies,
          moviesSeriesUserPreferences,
          token,
          submitCount
        );
      }
    } else {
      handleNext(
        setSelectedAnswer,
        setShowQuestion,
        setCurrentQuestionIndex,
        questions
      );
    }
  };

  useEffect(() => {
    if (currentQuestion?.value) {
      if (
        Array.isArray(currentQuestion.options) &&
        currentQuestion.options.every(isGenreOption)
      ) {
        const genreBgValues = Array.isArray(currentQuestion.value)
          ? currentQuestion.value
              .filter(
                (value): value is { en: string; bg: string } =>
                  typeof value === "object" && "bg" in value && "en" in value
              )
              .map((value) => value.bg)
          : [
              currentQuestion.value,
              currentQuestion.options.find(
                (option: { en: string; bg: string }) =>
                  option.en === currentQuestion.value
              )?.bg || currentQuestion.value
            ];

        if (JSON.stringify(genreBgValues) !== JSON.stringify(selectedAnswer)) {
          console.log("genreBgValues: ", genreBgValues);
          setSelectedAnswer(genreBgValues);
        }
      } else {
        // Уверяваме се, че стойността винаги е масив от string
        const newValue = Array.isArray(currentQuestion.value)
          ? currentQuestion.value.filter(
              (item): item is string => typeof item === "string"
            )
          : [currentQuestion.value].filter(
              (item): item is string => typeof item === "string"
            );

        // Сравняваме текущия отговор със стария, за да избегнем ненужни обновявания
        if (JSON.stringify(newValue) !== JSON.stringify(selectedAnswer)) {
          setSelectedAnswer(newValue); // Актуализираме отговора само при нужда
        }
      }
    }
  }, [currentQuestion, selectedAnswer]);
  console.log("kalata test useEffect: ", moviesSeriesUserPreferences);

  return (
    <div>
      {showViewRecommendations && (
        <ViewRecommendations
          setShowQuestion={setShowQuestion}
          setLoading={setLoading}
          setSubmitted={setSubmitted}
        />
      )}
      {notification?.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => {
            console.log("Notification closed!");
            setNotification(null);
          }}
        />
      )}
      <CSSTransition
        in={showQuestion}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div
          className={`w-full max-w-4xl py-8 px-4 ${
            window.innerWidth >= 640 ? getMarginClass(currentQuestion) : ""
          }`}
        >
          <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
            <h2 className="text-xl font-semibold break-words">
              {currentQuestion.question}
            </h2>
            {currentQuestion.description && (
              <p className="text-sm text-gray-500 mt-2">
                {currentQuestion.description}
              </p>
            )}
          </div>
          <div className={isBackDisabled ? "my-8" : "mb-2"}>
            {!isBackDisabled && (
              <div className="flex justify-start ">
                <button
                  onClick={() =>
                    handleBack(
                      setSelectedAnswer,
                      setShowQuestion,
                      setCurrentQuestionIndex,
                      questions
                    )
                  }
                  className="back-button text-secondary dark:text-white hover:opacity-70 text-3xl transition-all duration-300 "
                >
                  &#8592;
                </button>
              </div>
            )}
          </div>
          {currentQuestion.isInput ? (
            <div className="mb-4">
              {currentQuestion.setter === setInterests ? (
                <div>
                  <textarea
                    className="form-control bg-opacity-70 border-2 rounded-lg p-4 mb-4 text-white glow-effect transition-all duration-300 hover:text-secondary"
                    placeholder={currentQuestion.placeholder}
                    value={interests}
                    onChange={(e) => {
                      handleInputChange(currentQuestion.setter, e.target.value);

                      if (e.target.value.trim() === "") {
                        setSelectedAnswer([]);
                      } else {
                        setSelectedAnswer([e.target.value]);
                      }
                    }}
                    rows={4}
                    maxLength={200}
                  />
                  <div className="flex justify-between mx-2">
                    <label className="flex items-center cursor-pointer hover:text-secondary">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={
                          currentQuestion.value === "Нямам предпочитания"
                        }
                        onChange={() => {
                          const newValue =
                            currentQuestion.value === "Нямам предпочитания"
                              ? ""
                              : "Нямам предпочитания";
                          currentQuestion.setter(newValue);
                          setSelectedAnswer(newValue === "" ? [] : [newValue]);
                        }}
                      />
                      <span>Нямам предпочитания</span>
                    </label>
                    <div className="text-right mt-2">
                      <small>{`${interests.length} / 200`}</small>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    className="input-field form-control bg-opacity-70 border-2 rounded-lg p-4 mb-4 text-white glow-effect transition-all duration-300 hover:text-secondary"
                    placeholder={currentQuestion.placeholder}
                    value={currentQuestion.value}
                    onChange={(e) => {
                      handleInputChange(currentQuestion.setter, e.target.value);
                      if (e.target.value.trim() === "") {
                        setSelectedAnswer([]);
                      } else {
                        setSelectedAnswer([e.target.value]);
                      }
                    }}
                    required
                  />
                  <div className="flex items-center text-white">
                    <label className="flex items-center ml-2 cursor-pointer text-secondary dark:text-white hover:text-secondary">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={
                          currentQuestion.value === "Нямам предпочитания"
                        }
                        onChange={() => {
                          const newValue =
                            currentQuestion.value === "Нямам предпочитания"
                              ? ""
                              : "Нямам предпочитания";
                          currentQuestion.setter(newValue);
                          setSelectedAnswer(newValue === "" ? [] : [newValue]);
                        }}
                      />
                      <span className="ml-2">Нямам предпочитания</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                (currentQuestion.options?.length ?? 0) > 6
                  ? "grid-cols-2 md:grid-cols-5"
                  : "grid-cols-1"
              }`}
            >
              {currentQuestion.options?.map((option: any, index: number) => {
                if (
                  Array.isArray(currentQuestion.options) &&
                  currentQuestion.options.every(isGenreOption)
                ) {
                  return (
                    <div
                      key={index}
                      onClick={() =>
                        handleAnswerClick(
                          currentQuestion.setter,
                          option.bg,
                          setGenres,
                          currentQuestion,
                          selectedAnswer,
                          setSelectedAnswer
                        )
                      }
                      className={`${
                        selectedAnswer && selectedAnswer.includes(option.bg)
                          ? "selected-answer transform scale-105"
                          : "question hover:bg-secondary hover:text-white"
                      } bg-opacity-70 p-6 text-white rounded-lg glow-effect transition-all duration-300 cursor-pointer flex justify-center items-center text-center`}
                    >
                      {option.bg}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      onClick={() =>
                        handleAnswerClick(
                          currentQuestion.setter,
                          option,
                          setGenres,
                          currentQuestion,
                          selectedAnswer,
                          setSelectedAnswer
                        )
                      }
                      className={`${
                        selectedAnswer && selectedAnswer.includes(option)
                          ? "selected-answer transform scale-105"
                          : "question hover:bg-secondary hover:text-white"
                      } bg-opacity-70 p-6 text-white rounded-lg glow-effect transition-all duration-300 cursor-pointer ${
                        currentQuestion.options === moodOptions
                          ? "flex flex-col"
                          : "flex"
                      } justify-center items-center text-center`}
                    >
                      {currentQuestion.options === moodOptions ? (
                        <>
                          <span>{option.split(" ")[0]}</span>
                          <span className="text-lg">
                            {option.split(" ").slice(-1)}
                          </span>{" "}
                        </>
                      ) : (
                        <>{option}</>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          )}

          <div
            onClick={handleClick}
            className={`next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-4 flex justify-center items-center transition-all duration-200 ${
              (selectedAnswer && selectedAnswer.length > 0) ||
              (currentQuestion.isInput &&
                typeof currentQuestion.value === "string" &&
                currentQuestion.value.trim() !== "")
                ? "opacity-100 pointer-events-auto cursor-pointer"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {currentQuestionIndex === totalQuestions - 1
              ? "Изпрати"
              : "Следващ въпрос"}

            {isModalOpen && alreadyHasRecommendations && (
              <ConfirmationModal
                setNotification={setNotification}
                setIsModalOpen={setIsModalOpen}
                setLoading={setLoading}
                setSubmitted={setSubmitted}
                handleSubmit={handleSubmit}
                setRecommendationList={setRecommendationList}
                setBookmarkedMovies={setBookmarkedMovies}
                setSubmitCount={setSubmitCount}
                moviesSeriesUserPreferences={moviesSeriesUserPreferences}
                token={token}
                submitCount={submitCount}
              />
            )}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};
