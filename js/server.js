const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'standart-clean-secret-key';
const DB_PATH = path.join(__dirname, 'auth.db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.message);
    process.exit(1);
  }
  console.log('Подключено к SQLite DB');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Токен не найден' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Неверный или просроченный токен' });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Auth API работает' });
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedName = String(name).trim();

  if (!normalizedEmail || !normalizedName) {
    return res.status(400).json({ message: 'Некорректные данные' });
  }

  try {
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [normalizedEmail], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userId = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [normalizedName, normalizedEmail, passwordHash],
        function (err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });

    const token = jwt.sign(
      { id: userId, name: normalizedName, email: normalizedEmail },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Регистрация успешна',
      token,
      user: {
        id: userId,
        name: normalizedName,
        email: normalizedEmail
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [normalizedEmail], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Вход выполнен успешно',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    return res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
});

app.get('/api/me', authMiddleware, (req, res) => {
  db.get('SELECT id, name, email FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка получения профиля' });
    }

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    return res.json({ user });
  });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint не найден' });
  }
  next();
});

app.get('/*', (req, res) => {
  const filePath = path.join(__dirname, req.path.replace(/^\//, ''));
  if (filePath.endsWith('/') || filePath === __dirname) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  if (!require('fs').existsSync(filePath)) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  return res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
