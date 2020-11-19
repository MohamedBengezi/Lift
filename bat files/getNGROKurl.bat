curl http://127.0.0.1:4040/api/tunnels > ../src/property.json
if %errorlevel%==7 (echo {tunnels: [{public_url:"failed"}]} > ../src/property.json)
