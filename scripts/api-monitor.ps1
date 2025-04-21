# API Monitor PowerShell Script
$ErrorActionPreference = "Stop"

# Function to get API keys from various sources
function Get-ApiKeys {
    # Try to get from environment variables first
    $groqKey = $env:GROQ_API_KEY
    $pixabayKey = $env:PIXABAY_API_KEY

    # If not in environment variables, try to read from env.js
    if (-not $groqKey -or -not $pixabayKey) {
        $envPath = Join-Path $PSScriptRoot ".." "env.js"
        if (Test-Path $envPath) {
            Write-Host "Reading API keys from env.js..."
            $envContent = Get-Content $envPath -Raw
            $envMatch = [regex]::Match($envContent, 'window\.env\s*=\s*({[\s\S]*?});')
            if ($envMatch.Success) {
                $env = $envMatch.Groups[1].Value -replace "'", '"' | ConvertFrom-Json
                $groqKey = $env.GROQ_API_KEY
                $pixabayKey = $env.PIXABAY_API_KEY
            }
        }
    }

    # If still not found, try to read from Azure Function App settings
    if (-not $groqKey -or -not $pixabayKey) {
        $localSettingsPath = Join-Path $PSScriptRoot ".." "local.settings.json"
        if (Test-Path $localSettingsPath) {
            Write-Host "Reading API keys from local.settings.json..."
            try {
                $azureSettings = Get-Content $localSettingsPath -Raw | ConvertFrom-Json
                $groqKey = $azureSettings.Values.GROQ_API_KEY
                $pixabayKey = $azureSettings.Values.PIXABAY_API_KEY
            }
            catch {
                Write-Host "Note: local.settings.json exists but could not be read. This is normal if you're not using Azure Functions." -ForegroundColor Yellow
            }
        }
    }

    # If still not found, prompt user
    if (-not $groqKey) {
        Write-Host "`nGROQ API key not found in any configuration files." -ForegroundColor Yellow
        Write-Host "You can set it permanently by:" -ForegroundColor Yellow
        Write-Host "1. Adding to env.js" -ForegroundColor Yellow
        Write-Host "2. Setting environment variable: `$env:GROQ_API_KEY" -ForegroundColor Yellow
        Write-Host "3. Creating local.settings.json for Azure Functions" -ForegroundColor Yellow
        $groqKey = Read-Host "Please enter your GROQ API key (or press Enter to skip)"
    }
    if (-not $pixabayKey) {
        Write-Host "`nPixabay API key not found in any configuration files." -ForegroundColor Yellow
        Write-Host "You can set it permanently by:" -ForegroundColor Yellow
        Write-Host "1. Adding to env.js" -ForegroundColor Yellow
        Write-Host "2. Setting environment variable: `$env:PIXABAY_API_KEY" -ForegroundColor Yellow
        Write-Host "3. Creating local.settings.json for Azure Functions" -ForegroundColor Yellow
        $pixabayKey = Read-Host "Please enter your Pixabay API key (or press Enter to skip)"
    }

    if (-not $groqKey -or -not $pixabayKey) {
        Write-Host "`nWarning: Some API keys are missing. Tests for those APIs will fail." -ForegroundColor Red
    }

    return @{
        GroqKey = $groqKey
        PixabayKey = $pixabayKey
    }
}

# Test GROQ API
function Test-GroqAPI {
    param (
        [string]$ApiKey
    )
    if (-not $ApiKey) {
        return @{
            Status = "error"
            Error = "API key not provided"
            StatusCode = "N/A"
            ResponseTime = "N/A"
        }
    }

    try {
        $headers = @{
            "Authorization" = "Bearer $ApiKey"
            "Content-Type" = "application/json"
        }

        $body = @{
            model = "llama-3.3-70b-versatile"
            messages = @(@{ role = "user"; content = "Hello" })
            temperature = 0.7
            max_tokens = 100
        } | ConvertTo-Json -Depth 10

        Write-Host "Sending request to GROQ API..." -ForegroundColor Gray
        Write-Host "Headers: $($headers | ConvertTo-Json)" -ForegroundColor Gray
        Write-Host "Body: $body" -ForegroundColor Gray

        $startTime = Get-Date
        $response = Invoke-RestMethod -Uri "https://api.groq.com/openai/v1/chat/completions" `
            -Method Post `
            -Headers $headers `
            -Body $body `
            -Verbose
        $responseTime = (Get-Date) - $startTime

        return @{
            Status = "success"
            ResponseTime = "$([math]::Round($responseTime.TotalMilliseconds))ms"
            StatusCode = 200
        }
    }
    catch {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        $errorMessage = if ($errorDetails) { $errorDetails.error.message } else { $_.Exception.Message }

        Write-Host "Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        Write-Host "Exception: $($_.Exception)" -ForegroundColor Red

        return @{
            Status = "error"
            Error = $errorMessage
            StatusCode = $_.Exception.Response.StatusCode.value__ ?? "N/A"
            ResponseTime = "N/A"
        }
    }
}

# Test Pixabay API
function Test-PixabayAPI {
    param (
        [string]$ApiKey
    )
    if (-not $ApiKey) {
        return @{
            Status = "error"
            Error = "API key not provided"
            StatusCode = "N/A"
            ResponseTime = "N/A"
        }
    }

    try {
        # Updated parameters according to Pixabay API documentation
        $uri = "https://pixabay.com/api/?key=$ApiKey&q=test&image_type=photo&per_page=3"
        Write-Host "Sending request to Pixabay API..." -ForegroundColor Gray
        Write-Host "URI: $uri" -ForegroundColor Gray

        $startTime = Get-Date
        $response = Invoke-WebRequest -Uri $uri -Verbose
        $responseTime = (Get-Date) - $startTime

        # Check if the response contains valid data
        if ($response.StatusCode -eq 200) {
            $content = $response.Content | ConvertFrom-Json
            if ($content.totalHits -ge 0) {
                return @{
                    Status = "success"
                    ResponseTime = "$([math]::Round($responseTime.TotalMilliseconds))ms"
                    StatusCode = $response.StatusCode
                }
            } else {
                return @{
                    Status = "error"
                    Error = "No results found"
                    StatusCode = $response.StatusCode
                    ResponseTime = "$([math]::Round($responseTime.TotalMilliseconds))ms"
                }
            }
        } else {
            return @{
                Status = "error"
                Error = "HTTP Error: $($response.StatusCode)"
                StatusCode = $response.StatusCode
                ResponseTime = "$([math]::Round($responseTime.TotalMilliseconds))ms"
            }
        }
    }
    catch {
        Write-Host "Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        Write-Host "Exception: $($_.Exception)" -ForegroundColor Red

        return @{
            Status = "error"
            Error = $_.Exception.Message
            StatusCode = $_.Exception.Response.StatusCode.value__ ?? "N/A"
            ResponseTime = "N/A"
        }
    }
}

# Main script execution
try {
    Write-Host "Starting API monitoring tests...`n"

    # Get API keys
    $apiKeys = Get-ApiKeys

    Write-Host "Testing GROQ API..."
    $groqResult = Test-GroqAPI -ApiKey $apiKeys.GroqKey
    Write-Host "GROQ API Status: $($groqResult.Status)"
    Write-Host "Response Time: $($groqResult.ResponseTime)"
    Write-Host "Status Code: $($groqResult.StatusCode)"
    if ($groqResult.Error) { Write-Host "Error: $($groqResult.Error)" }
    Write-Host "`n"

    Write-Host "Testing Pixabay API..."
    $pixabayResult = Test-PixabayAPI -ApiKey $apiKeys.PixabayKey
    Write-Host "Pixabay API Status: $($pixabayResult.Status)"
    Write-Host "Response Time: $($pixabayResult.ResponseTime)"
    Write-Host "Status Code: $($pixabayResult.StatusCode)"
    if ($pixabayResult.Error) { Write-Host "Error: $($pixabayResult.Error)" }
}
catch {
    Write-Error "An error occurred: $_"
    exit 1
}