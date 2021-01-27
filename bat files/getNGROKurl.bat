timeout 7
curl http://127.0.0.1:4040/api/tunnels > ../FrontEnd/src/emulator_link.json
if %errorlevel%==7 (echo {tunnels: [{public_url:"failed"}]} > ../FrontEnd/src/emulator_link.json)
exit