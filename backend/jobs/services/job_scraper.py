import json
import urllib.parse
import time
import requests
from django.conf import settings

def scrape_jobs(platforms: list, profile: dict) -> list:
    """
    Scrapes jobs from selected platforms based on the profile skills and preferred roles.
    Returns a combined list of raw jobs.
    """
    api_key = getattr(settings, "FIRECRAWL_API_KEY", "")
    if not api_key:
        # Return fallback dummy jobs for local development if key is missing
        return _get_fallback_jobs(platforms)

    # Use AI-generated search queries if available, fallback to preferred roles
    # Cap at 3 queries max to reduce redundant Firecrawl API calls
    queries = profile.get("search_queries", [])[:3]
    if not queries:
        queries = [profile.get("preferred_roles", ["Software Developer"])[0]]
        
    print(f"[JobScraper] Extracted queries for scraping (max 3): {queries} | Platforms: {platforms}")
    
    seen = set()
    deduped_jobs = []
    
    for query in queries:
        # Stop early if we have collected 50+ unique raw jobs
        if len(deduped_jobs) >= 50:
            print(f"[JobScraper] Early stopping: collected {len(deduped_jobs)} raw jobs (>= 50).")
            break
            
        print(f"[JobScraper] Searching for query: '{query}'")
        
        for platform in platforms:
            if len(deduped_jobs) >= 50:
                break
                
            platform = platform.lower()
            try:
                if platform == "simplyhired":
                    jobs = _scrape_simplyhired(api_key, query)
                elif platform == "indeed":
                    jobs = _scrape_indeed(api_key, query)
                elif platform == "dailyremote":
                    jobs = _scrape_dailyremote(api_key, query)
                else:
                    jobs = []
                
                # Add to deduped list
                added_count = 0
                for job in jobs:
                    key = (job["title"].lower(), job["company"].lower())
                    if key not in seen:
                        seen.add(key)
                        deduped_jobs.append(job)
                        added_count += 1
                
                print(f"[JobScraper] {platform.capitalize()} returned {len(jobs)} jobs ({added_count} new unique jobs added)")
            except Exception as e:
                # Log error and continue with other platforms
                print(f"[JobScraper] Error scraping {platform} for query '{query}': {str(e)}")
                
    print(f"[JobScraper] Total unique deduplicated jobs scraped: {len(deduped_jobs)}")
    
    # If live scraping returned nothing, fall back to sample jobs so the pipeline doesn't fail silently
    if not deduped_jobs:
        print(f"[JobScraper] WARNING: Live scraping returned 0 jobs. Using fallback sample jobs.")
        return _get_fallback_jobs(platforms)
    
    return deduped_jobs

def _scrape_platform(api_key: str, url: str, platform_name: str) -> list:
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "url": url,
        "formats": [
            {
                "type": "json",
                "schema": {
                    "type": "object",
                    "properties": {
                        "jobs": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "title": {"type": "string"},
                                    "company": {"type": "string"},
                                    "location": {"type": "string"},
                                    "salary": {"type": "string"},
                                    "url": {"type": "string"}
                                },
                                "required": ["title", "company"]
                            }
                        }
                    },
                    "required": ["jobs"]
                },
                "prompt": "Extract all visible job listings with job title, company name, location, salary if shown, and the job detail URL. Do not include template listings or promotional jobs."
            }
        ],
        "waitFor": 3000
    }
    
    max_retries = 2
    for attempt in range(max_retries + 1):
        try:
            print(f"[Firecrawl] Scraping {platform_name} (Attempt {attempt+1}/{max_retries+1}): {url}")
            response = requests.post(
                "https://api.firecrawl.dev/v2/scrape", 
                json=payload, 
                headers=headers, 
                timeout=120  # Set timeout to 120 seconds
            )
            if response.status_code == 200:
                res_data = response.json()
                json_data = res_data.get("data", {}).get("json", {}) or {}
                jobs = json_data.get("jobs", [])
                print(f"[Firecrawl] {platform_name}: extracted {len(jobs)} job listings")
                # Normalize and add source
                normalized_jobs = []
                for job in jobs:
                    normalized_jobs.append({
                        "title": job.get("title", "").strip(),
                        "company": job.get("company", "").strip(),
                        "location": job.get("location", "Remote").strip(),
                        "salary": job.get("salary", "").strip(),
                        "url": job.get("url", "").strip(),
                        "source": platform_name
                    })
                return normalized_jobs
            else:
                print(f"[Firecrawl] API error for {platform_name} (status {response.status_code}): {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"[Firecrawl] Network error/timeout for {platform_name}: {str(e)}")
            
        # Exponential backoff before retrying
        if attempt < max_retries:
            sleep_time = 5 * (2 ** attempt)
            print(f"[Firecrawl] Retrying in {sleep_time} seconds...")
            time.sleep(sleep_time)
            
    return []

def _scrape_simplyhired(api_key: str, query: str) -> list:
    encoded_query = urllib.parse.quote_plus(query)
    url = f"https://www.simplyhired.com/search?q={encoded_query}&l=remote"
    return _scrape_platform(api_key, url, "SimplyHired")

def _scrape_indeed(api_key: str, query: str) -> list:
    encoded_query = urllib.parse.quote_plus(query)
    url = f"https://www.indeed.com/jobs?q={encoded_query}&l=Remote&sc=0kf%3Aattr%28DS7PT%29%3B"
    return _scrape_platform(api_key, url, "Indeed")

def _scrape_dailyremote(api_key: str, query: str) -> list:
    # DailyRemote has category specific pages
    # Check if query maps to software, design, etc.
    q_lower = query.lower()
    category = "software-development"
    if "design" in q_lower or "ux" in q_lower or "ui" in q_lower:
        category = "design"
    elif "marketing" in q_lower or "seo" in q_lower:
        category = "marketing"
    elif "sales" in q_lower:
        category = "sales"
    elif "writing" in q_lower or "content" in q_lower:
        category = "writing"
        
    url = f"https://dailyremote.com/remote-{category}-jobs"
    return _scrape_platform(api_key, url, "DailyRemote")

def _get_fallback_jobs(platforms: list) -> list:
    fallback = []
    if "simplyhired" in platforms:
        fallback.extend([
            {"title": "Remote Python Engineer", "company": "SimplyCorp", "location": "Remote, USA", "salary": "$90,000 - $110,000", "url": "https://www.simplyhired.com", "source": "SimplyHired"},
            {"title": "Backend Django Developer", "company": "WebSoft", "location": "Remote", "salary": "", "url": "https://www.simplyhired.com", "source": "SimplyHired"}
        ])
    if "dailyremote" in platforms:
        fallback.extend([
            {"title": "Full Stack React/Python Developer", "company": "DailySystems", "location": "Worldwide", "salary": "$80k - $100k", "url": "https://dailyremote.com", "source": "DailyRemote"},
            {"title": "Junior Python Developer", "company": "PyStart", "location": "Remote", "salary": "", "url": "https://dailyremote.com", "source": "DailyRemote"}
        ])
    if "indeed" in platforms:
        fallback.extend([
            {"title": "Senior Backend Developer (Django/FastAPI)", "company": "IndeedScale", "location": "Remote, Canada", "salary": "$120,000", "url": "https://www.indeed.com", "source": "Indeed"},
            {"title": "Software Engineer II - Python", "company": "FintechInc", "location": "Remote", "salary": "$130k - $150k", "url": "https://www.indeed.com", "source": "Indeed"}
        ])
    return fallback
