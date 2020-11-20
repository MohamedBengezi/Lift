cd ../server/poc
del package-lock.json
call npm install
cd ../../FrontEnd/
del package-lock.json
call npm install
cd ../
npm install -g ngrok
pause