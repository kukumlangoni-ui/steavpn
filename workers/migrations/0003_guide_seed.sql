INSERT INTO guide_devices
  (slug, name, app_name, download_label, download_url, intro, sort_order)
VALUES
(
  'ios',
  'iPhone / iPad',
  'Clash Lite',
  'App Store',
  'https://apps.apple.com/app/clash-lite/id6478274589',
  'Clash Lite is the recommended client for iPhone and iPad. It is available on the App Store and supports subscription links directly.',
  1
),
(
  'android',
  'Android',
  'FlClash',
  'Download APK',
  'https://clashapp.org/en-US/clash-download/flclash-download.html#downloads-android',
  'FlClash is a modern Clash client for Android. Download the APK directly and install it on your phone.',
  2
),
(
  'macos',
  'macOS',
  'Clash Verge Rev',
  'Download DMG',
  'https://clashapp.org/en-US/clash-download/clash-verge-rev-download.html#downloads-macos',
  'Clash Verge Rev is the desktop client for Mac. Choose the Apple Silicon (M-series) build for modern Macs, or Intel for older Macs.',
  3
);

-- iOS steps
INSERT INTO guide_steps (device_id, step_number, title, body, image_alt) VALUES
  ((SELECT id FROM guide_devices WHERE slug='ios'), 1, 'Open the App Store',
   'Open the App Store on your iPhone or iPad. Tap the search icon at the bottom and type "Clash Lite".', 'App Store search screen'),
  ((SELECT id FROM guide_devices WHERE slug='ios'), 2, 'Install Clash Lite',
   'Tap "Get" next to Clash Lite to download and install it. Wait for the install to finish.', 'Clash Lite on the App Store'),
  ((SELECT id FROM guide_devices WHERE slug='ios'), 3, 'Open Clash Lite',
   'Find Clash Lite on your home screen and tap to open it. You will see an empty profile list.', 'Clash Lite empty profile screen'),
  ((SELECT id FROM guide_devices WHERE slug='ios'), 4, 'Add your subscription',
   'Tap the "+" icon at the top right of the screen. Choose "Add from URL". Paste the subscription link we sent you and tap "Save".', 'Add profile screen'),
  ((SELECT id FROM guide_devices WHERE slug='ios'), 5, 'Activate the profile',
   'Your subscription now appears in the list. Tap it once to select it. The toggle at the top turns green when connected.', 'Profile list with active profile'),
  ((SELECT id FROM guide_devices WHERE slug='ios'), 6, 'Allow the VPN connection',
   'iOS will ask permission to add a VPN configuration. Tap "Allow" and enter your passcode if prompted. A VPN icon appears at the top of your screen.', 'iOS VPN permission dialog'),
  ((SELECT id FROM guide_devices WHERE slug='ios'), 7, 'You are connected',
   'Open Safari or any app. Your traffic is now going through STEA VPN. To disconnect, open Clash Lite and tap the toggle again.', 'Connected screen');

-- Android steps
INSERT INTO guide_steps (device_id, step_number, title, body, image_alt) VALUES
  ((SELECT id FROM guide_devices WHERE slug='android'), 1, 'Download FlClash',
   'Open the download link on your Android phone. The APK file will download to your Downloads folder.', 'Download page on Android'),
  ((SELECT id FROM guide_devices WHERE slug='android'), 2, 'Install the APK',
   'Tap the downloaded file. Android will warn that the file is from an unknown source — tap "Settings" and enable "Allow from this source", then go back and tap "Install".', 'Android install permission'),
  ((SELECT id FROM guide_devices WHERE slug='android'), 3, 'Open FlClash',
   'Find FlClash on your home screen or app drawer and tap to open it. You will see the dashboard screen.', 'FlClash dashboard'),
  ((SELECT id FROM guide_devices WHERE slug='android'), 4, 'Add your subscription',
   'Tap the "+" icon in the bottom right. Choose "Import from URL". Paste the subscription link we sent you and tap "Confirm".', 'Add profile screen'),
  ((SELECT id FROM guide_devices WHERE slug='android'), 5, 'Activate the profile',
   'The subscription appears in the Profiles list. Tap it to select it as the active profile.', 'Profile list'),
  ((SELECT id FROM guide_devices WHERE slug='android'), 6, 'Connect',
   'Return to the dashboard. Tap the large power button in the middle. Android will ask to allow VPN — tap "OK".', 'Android VPN permission'),
  ((SELECT id FROM guide_devices WHERE slug='android'), 7, 'You are connected',
   'The power button turns green and a key icon appears in your status bar. Your traffic is now going through STEA VPN.', 'Connected dashboard');

-- macOS steps
INSERT INTO guide_steps (device_id, step_number, title, body, image_alt) VALUES
  ((SELECT id FROM guide_devices WHERE slug='macos'), 1, 'Download Clash Verge Rev',
   'Open the download page. Choose "Apple Silicon" if your Mac has an M-series chip, or "Intel" if it is an older Mac. Check About This Mac if unsure.', 'Download page'),
  ((SELECT id FROM guide_devices WHERE slug='macos'), 2, 'Install the app',
   'Open the downloaded .dmg file and drag Clash Verge Rev into your Applications folder. Eject the disk image afterwards.', 'DMG install'),
  ((SELECT id FROM guide_devices WHERE slug='macos'), 3, 'Open Clash Verge Rev',
   'Open Launchpad or Finder → Applications, and click Clash Verge Rev. If macOS warns that the app is from an unidentified developer, right-click the app and choose "Open".', 'Open app warning'),
  ((SELECT id FROM guide_devices WHERE slug='macos'), 4, 'Go to Profiles',
   'In the left sidebar, click "Profiles". This is where your subscription will appear.', 'Profiles tab'),
  ((SELECT id FROM guide_devices WHERE slug='macos'), 5, 'Add your subscription',
   'Click "New" at the top right. Choose "Import from URL". Paste the subscription link we sent you and click "Import".', 'Import dialog'),
  ((SELECT id FROM guide_devices WHERE slug='macos'), 6, 'Activate the profile',
   'Click on your new profile in the list to activate it. The card highlights when active.', 'Active profile'),
  ((SELECT id FROM guide_devices WHERE slug='macos'), 7, 'Turn on the proxy',
   'Go back to "Home" in the sidebar. Click the "Tun Mode" toggle to turn on system-wide VPN. macOS will ask for your password — enter it.', 'Tun mode toggle'),
  ((SELECT id FROM guide_devices WHERE slug='macos'), 8, 'You are connected',
   'The toggle turns green and shows "Connected". All your Mac traffic is now going through STEA VPN.', 'Connected state');
