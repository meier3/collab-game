# collab-game

This game is meant to be played by two players on separate tablets.

Until the server is hosted, it can be run locally between dual web pages.

To run locally:
- clone repo locally
- cd into new repo directory
- open two terminals
- in the first:
  - cd into .\server
  - run >npm install
  - run >npm start
- in the second:
  - run >npm install (or use package manager of choice)
  - run >npm start (or >expo start)
  - wait for expo to load (or until a QR code appears in the terminal)
  - press 'w' to launch in web browser
- once webapp opens, open another page with the same URL
- if all has gone well, the server (in-terminal) should show that player 1 and player 2 are connected. You are now ready to play the game!
