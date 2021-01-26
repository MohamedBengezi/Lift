start /B startNGROK.bat
start /B getNGROKurl.bat
call buildFirebase.bat
call firebase emulators:start
pause