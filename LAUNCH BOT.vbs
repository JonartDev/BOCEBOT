Set WshShell = CreateObject("WScript.Shell")
Dim chromePath
Dim url
Dim objShell : Set objShell = CreateObject("WScript.Shell")

' Set the path to the Chrome executable
chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
' Set the URL you want to open
url = "http://localhost:3000"
' Command to run in the background
command = "node socket"
' Open Chrome with the specified URL
objShell.Run """" & chromePath & """ """ & url & """", 1, False

' Clean up
' Run the command in the background
WshShell.Run "cmd /c " & command, 0, False
Set objShell = Nothing
