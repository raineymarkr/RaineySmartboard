# Path to the Python script
$scriptPath = "C:\Users\mark.rainey\smartboard\calendar_parser.py"

# Check if the script file exists
if (Test-Path $scriptPath) {
    try {
        # Running the Python script
        & py $scriptPath
    } catch {
        Write-Error "An error occurred while running the script: $_"
    }
} else {
    Write-Error "Script file not found at path: $scriptPath"
}
