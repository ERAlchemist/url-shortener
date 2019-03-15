# API Project: URL Shortener Microservice
<hr>

### User Stories

1. I can POST a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":7C_sxAi5h}`
<br><br>
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`. 
<br><br>
3. When I visit the shortened URL, it will redirect me to my original link.
<br><br>

#### Creation Example:

POST [base_url]/api/shorturl/new/https://www.google.com

#### Usage:

[base_url]/7C_sxAi5h

#### Will redirect to:

https://www.google.com
