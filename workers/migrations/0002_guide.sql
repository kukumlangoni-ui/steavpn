CREATE TABLE IF NOT EXISTS guide_devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  app_name TEXT NOT NULL,
  download_label TEXT NOT NULL,
  download_url TEXT NOT NULL,
  intro TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS guide_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id INTEGER NOT NULL,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  image_key TEXT,
  image_alt TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (device_id) REFERENCES guide_devices(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_guide_steps_device
  ON guide_steps(device_id, step_number);

CREATE INDEX IF NOT EXISTS ix_guide_devices_order
  ON guide_devices(sort_order);
