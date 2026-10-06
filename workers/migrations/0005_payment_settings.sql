CREATE TABLE IF NOT EXISTS payment_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wechat_id TEXT NOT NULL DEFAULT '+8619715852043',
  whatsapp TEXT NOT NULL DEFAULT '+8619715852043',
  email TEXT NOT NULL DEFAULT 'isayamasika100@gmail.com',
  alipay_id TEXT,
  bank_name TEXT NOT NULL DEFAULT 'Selcom Microfinance Bank Tanzania Limited',
  bank_account_name TEXT NOT NULL DEFAULT 'Isaya Hance Masika',
  bank_account_number TEXT NOT NULL DEFAULT '5525106819163',
  wechat_qr_key TEXT,
  alipay_qr_key TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO payment_settings (id) SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM payment_settings WHERE id = 1);
