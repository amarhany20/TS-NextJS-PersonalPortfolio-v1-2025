# Create User PowerShell Script
# Usage: .\create-user.ps1 -Email user@example.com -Password userpassword [-FirstName John] [-LastName Doe] [-Role USER|ADMIN|SUPER_ADMIN]

param (
    [Parameter(Mandatory=$true)]
    [string]$Email,

    [Parameter(Mandatory=$true)]
    [string]$Password,

    [string]$FirstName = "",

    [string]$LastName = "",

    [ValidateSet("USER", "ADMIN", "SUPER_ADMIN")]
    [string]$Role = "USER"
)

# Run the script with Node
npx tsx scripts/create-user-simple.ts $Email $Password $FirstName $LastName $Role
