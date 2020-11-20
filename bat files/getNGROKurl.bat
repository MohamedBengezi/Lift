curl http://127.0.0.1:4040/api/tunnels > ../FrontEnd/src/property.json
if %errorlevel%==7 (echo {tunnels: [{public_url:"failed"}]} > ../FrontEnd/src/property.json)
