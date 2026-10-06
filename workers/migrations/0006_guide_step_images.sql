CREATE TABLE IF NOT EXISTS guide_step_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  step_id INTEGER NOT NULL,
  image_key TEXT NOT NULL,
  image_alt TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (step_id) REFERENCES guide_steps(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_step_images_step
  ON guide_step_images(step_id, sort_order);

-- Backfill any existing single image_key into the new table
INSERT INTO guide_step_images (step_id, image_key, image_alt, sort_order)
SELECT id, image_key, image_alt, 0
FROM guide_steps
WHERE image_key IS NOT NULL AND image_key != '';

-- ═══════════════════════════════════════════════════════════════
-- Restore the macOS device and its 8 steps
-- ═══════════════════════════════════════════════════════════════

-- Insert the macOS device only if it doesn't exist
INSERT INTO guide_devices
  (slug, name, app_name, download_label, download_url, intro, sort_order)
SELECT
  'macos',
  'macOS',
  'Clash Verge Rev',
  'Download DMG',
  'https://clashapp.org/en-US/clash-download/clash-verge-rev-download.html#downloads-macos',
  'Clash Verge Rev is the desktop client for Mac. Choose the Apple Silicon (M-series) build for modern Macs, or Intel for older Macs.',
  3
WHERE NOT EXISTS (SELECT 1 FROM guide_devices WHERE slug = 'macos');

-- Insert the 8 macOS steps only if the device has zero steps
INSERT INTO guide_steps (device_id, step_number, title, body, image_alt)
SELECT * FROM (
  SELECT
    (SELECT id FROM guide_devices WHERE slug = 'macos') AS device_id,
    1 AS step_number,
    'Download Clash Verge Rev' AS title,
    'Open the download page. Choose "Apple Silicon" if your Mac has an M-series chip, or "Intel" if it is an older Mac. Check About This Mac if unsure.' AS body,
    'Download page' AS image_alt
)
WHERE (SELECT COUNT(*) FROM guide_steps
       WHERE device_id = (SELECT id FROM guide_devices WHERE slug = 'macos')) = 0
UNION ALL
SELECT (SELECT id FROM guide_devices WHERE slug = 'macos'), 2,
  'Install the app',
  'Open the downloaded .dmg file and drag Clash Verge Rev into your Applications folder. Eject the disk image afterwards.',
  'DMG install'
WHERE (SELECT COUNT(*) FROM guide_steps
       WHERE device_id = (SELECT id FROM guide_devices WHERE slug = 'macos')) = 0
UNION ALL
SELECT (SELECT id FROM guide_devices WHERE slug = 'macos'), 3,
  'Open Clash Verge Rev',
  'Open Launchpad or Finder → Applications, and click Clash Verge Rev. If macOS warns that the app is from an unidentified developer, right-click the app and choose "Open".',
  'Open app warning'
WHERE (SELECT COUNT(*) FROM guide_steps
       WHERE device_id = (SELECT id FROM guide_devices WHERE slug = 'macos')) = 0
UNION ALL
SELECT (SELECT id FROM guide_devices WHERE slug = 'macos'), 4,
  'Go to Profiles',
  'In the left sidebar, click "Profiles". This is where your subscription will appear.',
  'Profiles tab'
WHERE (SELECT COUNT(*) FROM guide_steps
       WHERE device_id = (SELECT id FROM guide_devices WHERE slug = 'macos')) = 0
UNION ALL
SELECT (SELECT id FROM guide_devices WHERE slug = 'macos'), 5,
  'Add your subscription',
  'Click "New" at the top right. Choose "Import from URL". Paste the subscription link we sent you and click "Import".',
  'Import dialog'
WHERE (SELECT COUNT(*) FROM guide_steps
       WHERE device_id = (SELECT id FROM guide_devices WHERE slug = 'macos')) = 0
UNION ALL
SELECT (SELECT id FROM guide_devices WHERE slug = 'macos'), 6,
  'Activate the profile',
  'Click on your new profile in the list to activate it. The card highlights when active.',
  'Active profile'
WHERE (SELECT COUNT(*) FROM guide_steps
       WHERE device_id = (SELECT id FROM guide_devices WHERE slug = 'macos')) = 0
UNION ALL
SELECT (SELECT id FROM guide_devices WHERE slug = 'macos'), 7,
  'Turn on the proxy',
  'Go back to "Home" in the sidebar. Click the "Tun Mode" toggle to turn on system-wide VPN. macOS will ask for your password — enter it.',
  'Tun mode toggle'
WHERE (SELECT COUNT(*) FROM guide_steps
       WHERE device_id = (SELECT id FROM guide_devices WHERE slug = 'macos')) = 0
UNION ALL
SELECT (SELECT id FROM guide_devices WHERE slug = 'macos'), 8,
  'You are connected',
  'The toggle turns green and shows "Connected". All your Mac traffic is now going through STEA VPN.',
  'Connected state'
WHERE (SELECT COUNT(*) FROM guide_steps
       WHERE device_id = (SELECT id FROM guide_devices WHERE slug = 'macos')) = 0;
