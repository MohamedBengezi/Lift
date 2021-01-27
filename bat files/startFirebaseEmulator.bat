Rem start /B startNGROK.bat
Rem start /B getNGROKurl.bat
call buildFirebase.bat
call firebase emulators:start
pause