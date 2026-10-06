INSERT INTO guide_devices
  (slug, name, app_name, download_label, download_url, intro, sort_order)
VALUES
(
  'windows',
  'Windows',
  'Clash Verge Rev',
  'Download EXE',
  'https://clashapp.org/en-US/clash-download/clash-verge-rev-download.html',
  'Clash Verge Rev is the desktop client for Windows. Download the x64 installer for most PCs, or ARM64 if you have a Windows on ARM device.',
  4
);

INSERT INTO guide_steps (device_id, step_number, title, body, image_alt) VALUES
  ((SELECT id FROM guide_devices WHERE slug='windows'), 1, 'Download Clash Verge Rev',
   'Open the download page. Choose the "x64" installer if you have a standard Windows PC, or "ARM64" if you are not sure check Settings → System → About → System type.', 'Download page'),
  ((SELECT id FROM guide_devices WHERE slug='windows'), 2, 'Run the installer',
   'Find the downloaded .exe file in your Downloads folder and double-click it. Windows may show a warning — click "More info", then "Run anyway".', 'Windows SmartScreen warning'),
  ((SELECT id FROM guide_devices WHERE slug='windows'), 3, 'Install the app',
   'Follow the installer prompts. Choose the default install location and click "Install". The app will launch when finished.', 'Installer progress'),
  ((SELECT id FROM guide_devices WHERE slug='windows'), 4, 'Go to Profiles',
   'In the left sidebar, click "Profiles". This is where your subscription will appear.', 'Profiles tab'),
  ((SELECT id FROM guide_devices WHERE slug='windows'), 5, 'Add your subscription',
   'Click "New" at the top right. Choose "Import from URL". Paste the subscription link we sent you and click "Import".', 'Import dialog'),
  ((SELECT id FROM guide_devices WHERE slug='windows'), 6, 'Activate the profile',
   'Click on your new profile in the list to activate it. The card highlights when active.', 'Active profile'),
  ((SELECT id FROM guide_devices WHERE slug='windows'), 7, 'Turn on the proxy',
   'Go back to "Home" in the sidebar. Click the "Tun Mode" toggle to turn on system-wide VPN. Windows will ask for permission — click "Yes".', 'Tun mode toggle'),
  ((SELECT id FROM guide_devices WHERE slug='windows'), 8, 'You are connected',
   'The toggle turns green and shows "Connected". All your PC traffic is now going through STEA VPN.', 'Connected state');
