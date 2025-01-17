const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("./database");
const hf = require("./helper_functions");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
require("dotenv").config();

const whitelist = [
  "http://localhost:5174",
  "http://localhost:5175",
  "https://artcompass.noit.eu"
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

let verificationCodes = {};

const SECRET_KEY = "1a2b3c4d5e6f7g8h9i0jklmnopqrstuvwxyz123456";
const EMAIL_USER = "no-reply@artcompass-api.noit.eu";
const EMAIL_PASS = "Noit_2025";

// Създаване на транспортерен обект с използване на SMTP транспорт
const transporter = nodemailer.createTransport({
  host: "artcompass-api.noit.eu", // Заменете с вашия cPanel mail сървър
  port: 587, // Използвайте 465 за SSL или 587 за TLS
  secure: false, // true за SSL (порт 465), false за TLS (порт 587)
  auth: {
    user: EMAIL_USER, // Вашият имейл адрес
    pass: EMAIL_PASS // Вашата имейл парола
  },
  debug: true // По избор, логва SMTP комуникацията за откриване на проблеми
});

// Рут за регистрация
app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Проверка дали имейлът вече съществува в базата данни
  db.checkEmailExists(email, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Грешка при заявката към базата данни" });

    if (result.length > 0) {
      return res
        .status(400)
        .json({ error: "Профил с този имейл вече съществува." });
    }

    // Генериране на код за потвърждение
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Временно съхранение на кода
    verificationCodes[email] = {
      code: verificationCode,
      firstName,
      lastName,
      password, // Временно съхранение на паролата
      expiresAt: Date.now() + 15 * 60 * 1000 // Задаване на валидност от 15 минути
    };

    // Изпращане на кода за потвърждение по имейл
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Шестцифрен код за потвърждение от Кино Компас",
      html: `
        <div style="text-align: center; background-color: rgba(244, 211, 139, 0.5); margin: 2% 3%; padding: 3% 1%; border: 4px dotted rgb(178, 50, 0); border-radius: 20px">
          <h2>Благодарим Ви за регистрацията в Кино Компас!</h2>
          <hr style="border: 0.5px solid rgb(178, 50, 0); width: 18%; margin-top: 6%; margin-bottom: 4%"></hr>
          <p>Вашият шестцифрен код е <strong style="font-size: 20px; color: rgb(178, 50, 0)">${verificationCode}</strong>.</p>
        </div>
        <div>
          <p style="border-radius: 5px; background-color: rgba(178, 50, 0, 0.2); text-align: center; font-size: 13px; margin: 5% 25% 0% 25%">Не сте поискали код? Игнорирайте този имейл.</p>
        </div>`
    };

    console.log("Транспортиране");
    // Изпращане на имейла с кода за потвърждение
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("грешка: ", error);
        return res
          .status(500)
          .json({ error: "Не успяхме да изпратим имейл! :(" });
      }
      res.json({
        message: "Кодът за потвърждение е изпратен на вашия имейл!"
      });
    });
  });
});

const MAX_REQUESTS_PER_DAY = 20;
let userRequests = {};

app.post("/handle-submit", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Верификация и декодиране на токена
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.id; // Вземане на потребителско ID

    // Алгоритъм за отстраняване на спам от заявки
    hf.checkAndResetRequestsDaily(userRequests);

    // Ако потребителят все още няма данни, те се инициализират
    if (!userRequests[userId]) {
      userRequests[userId] = { count: 0, lastRequestTime: new Date() };
    }

    // Проверка дали потребителя е минал лимита си от заявки
    if (userRequests[userId].count >= MAX_REQUESTS_PER_DAY) {
      return res.status(400).json({
        error: "You have exceeded the maximum request limit for today!"
      });
    }

    // Следене на броя на заявки
    userRequests[userId].count += 1;
    userRequests[userId].lastRequestTime = new Date();

    console.log("userRequests: ", userRequests);
    res.json({ message: "Request handled successfully!" });
  });
});

// Препращане на код, ако не е получен такъв
app.post("/resend", (req, res) => {
  const { email } = req.body;

  // Генерира код за потвърждение
  const verificationCode = crypto.randomInt(100000, 999999).toString();

  // Съхранява кода временно
  verificationCodes[email] = {
    ...verificationCodes[email],
    code: verificationCode,
    expiresAt: Date.now() + 15 * 60 * 1000 // Задава 15 минути валидност
  };

  // Изпраща нов код за потвърждение по имейл
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Нов шестцифрен код за потвърждение от Кино Компас",
    html: `
      <div style="text-align: center; background-color: rgba(244, 211, 139, 0.5); margin: 2% 3%; padding: 3% 1%; border: 4px dotted rgb(178, 50, 0); border-radius: 20px">
        <p>Вашият шестцифрен код е <strong style="font-size: 20px; color: rgb(178, 50, 0)">${verificationCode}</strong>.</p>
      </div>
      <div>
        <p style="border-radius: 5px; background-color: rgba(178, 50, 0, 0.2); text-align: center; font-size: 13px; margin: 5% 25% 0% 25%">Не сте поискали код? Игнорирайте този имейл.</p>
      </div>`
  };

  console.log(verificationCodes[email]);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error)
      return res
        .status(500)
        .json({ error: "Не успяхме да изпратим имейл! :(" });
    res.json({ message: "Кодът за потвърждение е изпратен на вашия имейл!" });
  });
});

// Верификация на имейл
app.post("/verify-email", (req, res) => {
  const { email, verificationCode } = req.body;

  const storedData = verificationCodes[email];
  if (!storedData) {
    return res
      .status(400)
      .json({ error: "Не е намерен код за потвърждение за този имейл." });
  }

  if (Date.now() > storedData.expiresAt) {
    delete verificationCodes[email];
    return res.status(400).json({ error: "Кодът за потвърждение е изтекъл." });
  }

  if (storedData.code !== verificationCode) {
    return res.status(400).json({ error: "Невалиден код за потвърждение." });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(storedData.password, salt);

  db.createUser(
    storedData.firstName,
    storedData.lastName,
    email,
    hashedPassword,
    (err, result) => {
      if (err) return res.status(400).json({ error: err.message });

      // Изтрива кода след регистрация
      delete verificationCodes[email];
      res.json({ message: "Успешно регистриран профил!" });
    }
  );
});

// Влизане в профил
app.post("/signin", (req, res) => {
  const { email, password, rememberMe } = req.body;

  db.findUserByEmail(email, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    if (result.length === 0)
      return res
        .status(400)
        .json({ error: "Не съществува потребител с този имейл адрес!" });

    const user = result[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ error: "Въведената парола е грешна или непълна!" });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: rememberMe ? "7d" : "2h"
    });
    res.json({ message: "Успешно влизане!", token });
  });
});

// Страница за заявяване на смяна на паролата
app.post("/password-reset-request", (req, res) => {
  const { email } = req.body;

  db.findUserByEmail(email, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    if (result.length === 0)
      return res
        .status(400)
        .json({ error: "Не съществува потребител с този имейл адрес!" });

    const user = result[0];
    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: "15m"
    });

    // Create a reset link
    const resetLink = `https://artcompass.noit.eu/resetpassword/resetcover/${token}`;

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Промяна на паролата за Кино Компас",
      html: `<p>Натиснете <a href="${resetLink}">тук</a>, за да промените паролата си.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        return res
          .status(500)
          .json({ error: "Не успяхме да изпратим имейл :(" });
      res.json({
        message: "Заявката за промяна на паролата е изпратена на вашия имейл!"
      });
    });
  });
});

// Смяна на паролата
app.post("/password-reset", (req, res) => {
  const { token, newPassword } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(400).json({ error: "Invalid or expired token" });

    const userId = decoded.id;

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    db.updateUserPassword(userId, hashedPassword, (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Успешно нулиране на паролата!" });
    });
  });
});

// Валидация на JWT Token
app.post("/token-validation", (req, res) => {
  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.json({ valid: false });
    res.json({ valid: true });
  });
});

// Взимане на основна потребителска информация
app.get("/user-data", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Взимане на токен от authorization header-а

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });

    const userId = decoded.id;

    db.getUserById(userId, (err, result) => {
      if (err) return res.status(500).json({ error: "Database query error" });
      if (result.length === 0)
        return res
          .status(404)
          .json({ error: "Не съществува потребител с този имейл адрес!" });

      const user = result[0];
      res.json(user);
    });
  });
});

// Запазване на потребителските предпочитания
app.post("/save-movies-series-user-preferences", (req, res) => {
  const {
    token,
    preferred_genres_en,
    preferred_genres_bg,
    mood,
    timeAvailability,
    preferred_age,
    preferred_type,
    preferred_actors,
    preferred_directors,
    preferred_countries,
    preferred_pacing,
    preferred_depth,
    preferred_target_group,
    interests,
    date
  } = req.body;

  // Верификация на токена и вземане на потребителското ID
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.id;

    console.log(
      "data: ",
      userId,
      preferred_genres_en,
      preferred_genres_bg,
      mood,
      timeAvailability,
      preferred_age,
      preferred_type,
      preferred_actors,
      preferred_directors,
      preferred_countries,
      preferred_pacing,
      preferred_depth,
      preferred_target_group,
      interests,
      date
    );
    db.saveMoviesSeriesUserPreferences(
      userId,
      preferred_genres_en,
      preferred_genres_bg,
      mood,
      timeAvailability,
      preferred_age,
      preferred_type,
      preferred_actors,
      preferred_directors,
      preferred_countries,
      preferred_pacing,
      preferred_depth,
      preferred_target_group,
      interests,
      date,
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res
          .status(201)
          .json({ message: "User preferences saved successfully!" });
      }
    );
  });
});

// Запазване на препоръка
app.post("/save-movies-series-recommendation", (req, res) => {
  const {
    token,
    imdbID,
    title_en,
    title_bg,
    genre_en,
    genre_bg,
    reason,
    description,
    year,
    rated,
    released,
    runtime,
    director,
    writer,
    actors,
    plot,
    language,
    country,
    awards,
    poster,
    ratings,
    metascore,
    imdbRating,
    imdbVotes,
    type,
    DVD,
    boxOffice,
    production,
    website,
    totalSeasons,
    date
  } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.saveMoviesSeriesRecommendation(
      userId,
      imdbID,
      title_en,
      title_bg,
      genre_en,
      genre_bg,
      reason,
      description,
      year,
      rated,
      released,
      runtime,
      director,
      writer,
      actors,
      plot,
      language,
      country,
      awards,
      poster,
      ratings,
      metascore,
      imdbRating,
      imdbVotes,
      type,
      DVD,
      boxOffice,
      production,
      website,
      totalSeasons,
      date,
      (err, result) => {
        console.log(
          "title_en: \n" +
            title_en +
            "\n" +
            "title_bg: \n" +
            title_bg +
            "\n" +
            "genre_en: \n" +
            genre_en +
            "\n" +
            "genre_bg: \n" +
            genre_bg
        );
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Recommendation added successfully!" });
      }
    );
  });
});

// Запазване на препоръка в списък за гледане
app.post("/save-to-watchlist", (req, res) => {
  const {
    token,
    imdbID,
    title_en,
    title_bg,
    genre_en,
    genre_bg,
    reason,
    description,
    year,
    rated,
    released,
    runtime,
    director,
    writer,
    actors,
    plot,
    language,
    country,
    awards,
    poster,
    ratings,
    metascore,
    imdbRating,
    imdbVotes,
    type,
    DVD,
    boxOffice,
    production,
    website,
    totalSeasons
  } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.saveToWatchlist(
      userId,
      imdbID,
      title_en,
      title_bg,
      genre_en,
      genre_bg,
      reason,
      description,
      year,
      rated,
      released,
      runtime,
      director,
      writer,
      actors,
      plot,
      language,
      country,
      awards,
      poster,
      ratings,
      metascore,
      imdbRating,
      imdbVotes,
      type,
      DVD,
      boxOffice,
      production,
      website,
      totalSeasons,
      (err, result) => {
        console.log(
          "title_en: \n" +
            title_en +
            "\n" +
            "title_bg: \n" +
            title_bg +
            "\n" +
            "genre_en: \n" +
            genre_en +
            "\n" +
            "genre_bg: \n" +
            genre_bg
        );
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Recommendation added successfully!" });
      }
    );
  });
});

// Изтриване на препоръка от списъка за гледане
app.delete("/remove-from-watchlist", (req, res) => {
  const { token, imdbID } = req.body;

  if (!imdbID) {
    return res.status(400).json({ error: "IMDb ID is required" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;

    db.removeFromWatchlist(userId, imdbID, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Recommendation not found" });
      }
      res.status(200).json({ message: "Recommendation removed successfully!" });
    });
  });
});

// Изтриване на препоръка от списъка за гледане
app.post("/check-for-recommendation-in-watchlist", (req, res) => {
  const { token, imdbID } = req.body;

  if (!imdbID) {
    return res.status(400).json({ error: "IMDb ID is required" });
  }

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.id;

    db.checkRecommendationExistsInWatchlist(
      userId,
      imdbID,
      (error, results) => {
        if (error) {
          return res
            .status(500)
            .json({ error: "Database error", details: error });
        }

        // Always respond with 200 and include the 'exists' flag
        return res.status(200).json({ exists: results.length > 0 });
      }
    );
  });
});

// Вземане на данни за общ брой на потребители в платформата
app.get("/stats/platform/users-count", (req, res) => {
  db.getUsersCount((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users count" });
    }
    res.json(result);
  });
});

// Вземане на данни за средна печалба на филми/сериали от билети и мета/имdb оценки в платформата
app.get("/stats/platform/average-scores", (req, res) => {
  db.getAverageBoxOfficeAndScores((err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching average box office and ratings" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани филми/сериали в платформата
app.get("/stats/platform/top-recommendations", (req, res) => {
  db.getTopRecommendationsPlatform((err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching top recommendations" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани държави, които създават филми/сериали в платформата
app.get("/stats/platform/top-countries", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  db.getTopCountries(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top countries" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани жанрове в платформата
app.get("/stats/platform/top-genres", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  db.getTopGenres(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top genres" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-популярни жанрове във времето в платформата
app.get("/stats/platform/genre-popularity-over-time", async (req, res) => {
  db.getGenrePopularityOverTime((err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching genre popularity over time" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани актьори в платформата
app.get("/stats/platform/top-actors", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  db.getTopActors(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top actors" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани филмови режисьори в платформата
app.get("/stats/platform/top-directors", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  db.getTopDirectors(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top directors" });
    }
    res.json(result);
  });
});

// Вземане на данни за най-препоръчвани сценаристи в платформата
app.get("/stats/platform/top-writers", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  db.getTopWriters(limit, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top writers" });
    }
    res.json(result);
  });
});

// Вземане на данни за награди оскар за всеки филм/сериал в платформата
app.get("/stats/platform/oscars-by-movie", async (req, res) => {
  db.getOscarsByMovie((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching oscars" });
    }
    res.json(result);
  });
});

// Вземане на данни за всички награди за всеки филм/сериал в платформата
app.get("/stats/platform/total-awards-by-movie", async (req, res) => {
  db.getTotalAwardsByMovieOrSeries((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching total awards" });
    }
    res.json(result);
  });
});

// Вземане на данни за общ брой на награди в платформата
app.get("/stats/platform/total-awards", async (req, res) => {
  db.getTotalAwardsCount((err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching total awards count" });
    }
    res.json(result);
  });
});

// Вземане на данни за филмови режисьори в платформата, сортирани по успешност
app.get("/stats/platform/sorted-directors-by-prosperity", async (req, res) => {
  db.getSortedDirectorsByProsperity((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching sorted directors" });
    }
    res.json(result);
  });
});

// Вземане на данни за актьори в платформата, сортирани по успешност
app.get("/stats/platform/sorted-actors-by-prosperity", async (req, res) => {
  db.getSortedActorsByProsperity((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching sorted actors" });
    }
    res.json(result);
  });
});

// Вземане на данни за сценаристи в платформата, сортирани по успешност
app.get("/stats/platform/sorted-writers-by-prosperity", async (req, res) => {
  db.getSortedWritersByProsperity((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching sorted writers" });
    }
    res.json(result);
  });
});

// Вземане на данни за филми в платформата, сортирани по успешност
app.get("/stats/platform/sorted-movies-by-prosperity", async (req, res) => {
  db.getSortedMoviesByProsperity((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching sorted movies" });
    }
    res.json(result);
  });
});

// Вземане на данни за филми и сериали в платформата, сортирани по meta score
app.get(
  "/stats/platform/sorted-movies-and-series-by-metascore",
  async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    if (limit <= 0) {
      return res
        .status(400)
        .json({ error: "Лимитът трябва да е положително число." });
    }

    db.getTopMoviesAndSeriesByMetascore(limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching sorted movies by meta score" });
      }
      res.json(result);
    });
  }
);

// Вземане на данни за филми и сериали в платформата, сортирани по IMDb rating
app.get(
  "/stats/platform/sorted-movies-and-series-by-imdb-rating",
  async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    if (limit <= 0) {
      return res
        .status(400)
        .json({ error: "Лимитът трябва да е положително число." });
    }

    db.getTopMoviesAndSeriesByIMDbRating(limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching sorted movies by IMDb rating" });
      }
      res.json(result);
    });
  }
);

// Вземане на данни за филми и сериали в платформата, сортирани по rotten tomatoes rating
app.get(
  "/stats/platform/sorted-movies-and-series-by-rotten-tomatoes-rating",
  async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    if (limit <= 0) {
      return res
        .status(400)
        .json({ error: "Лимитът трябва да е положително число." });
    }

    db.getTopMoviesAndSeriesByRottenTomatoesRating(limit, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error fetching sorted movies by rotten tomatoes rating"
        });
      }
      res.json(result);
    });
  }
);

// Вземане на данни за най-препоръчвани филми/сериали на даден потребител
app.post("/stats/individual/top-recommendations", (req, res) => {
  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopRecommendations(userId, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching top recommendations" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за филми/сериали в списък за гледане на даден потребител
app.post("/stats/individual/watchlist", (req, res) => {
  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersWatchlist(userId, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching watchlist" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-препоръчвани жанрове на даден потребител
app.post("/stats/individual/top-genres", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopGenres(userId, limit, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching top genres" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-запазвани в списък за гледане жанрове на даден потребител
app.post("/stats/individual/watchlist-top-genres", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopGenresFromWatchlist(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching top genres from watchlist" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-препоръчвани актьори на даден потребител
app.post("/stats/individual/top-actors", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopActors(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching users top actors" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-запазвани в списък за гледане актьори на даден потребител
app.post("/stats/individual/watchlist-top-actors", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopActorsFromWatchlist(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching users watchlist top actors" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-препоръчвани режисьори на даден потребител
app.post("/stats/individual/top-directors", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopDirectors(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching users top directors" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-запазвани в списък за гледане режисьори на даден потребител
app.post("/stats/individual/watchlist-top-directors", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopDirectorsFromWatchlist(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching users watchlist top directors" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-препоръчвани сценаристи на даден потребител
app.post("/stats/individual/top-writers", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopWriters(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching users top writers" });
      }
      res.json(result);
    });
  });
});

// Вземане на данни за най-запазвани в списък за гледане сценаристи на даден потребител
app.post("/stats/individual/watchlist-top-writers", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (limit <= 0) {
    return res
      .status(400)
      .json({ error: "Лимитът трябва да е положително число." });
  }

  const { token } = req.body;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.getUsersTopWritersWatchlist(userId, limit, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching users watchlist top writers" });
      }
      res.json(result);
    });
  });
});

// Стартиране на сървъра
app.listen(5000, () => {
  console.log("Server started on port 5000.");
});
