# PowerShell Script to Run Python Script

# Path to the Python executable
# Update the path if your Python executable is located elsewhere
$pythonExe = "C:\Users\mark.rainey\AppData\Local\Programs\Python\Python311\python.exe"

# Path to the Python script
$scriptPath = "C:\Users\mark.rainey\smartboard\calendar_parser.py"

# Running the Python script
& $pythonExe $scriptPath
