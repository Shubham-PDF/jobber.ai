import json
import re
from django.conf import settings
from openai import OpenAI

def match_jobs(profile: dict, raw_jobs: list) -> list:
    """
    Scores ALL raw jobs against the candidate profile using Perplexity AI.
    Returns all jobs sorted by score descending (no filtering, no cap).
    """
    if not raw_jobs:
        return []

    api_key = getattr(settings, "PERPLEXITY_API_KEY", "")
    if not api_key:
        # Local development fallback: score them dummy-style
        return _get_fallback_matches(profile, raw_jobs)

    client = OpenAI(
        api_key=api_key,
        base_url="https://api.perplexity.ai"
    )

    print(f"[JobMatcher] Starting matching process for {len(raw_jobs)} raw jobs...")
    matched_jobs = []
    batch_size = 50

    # Process jobs in chunks of 50
    for i in range(0, len(raw_jobs), batch_size):
        chunk = raw_jobs[i:i + batch_size]
        print(f"[JobMatcher] Evaluating batch starting at index {i} (batch size: {len(chunk)})")
        
        # Prepare the list of jobs for the prompt (index matched to actual list)
        jobs_input = []
        for idx, job in enumerate(chunk):
            jobs_input.append({
                "index": idx,
                "title": job["title"],
                "company": job["company"],
                "location": job["location"],
                "salary": job["salary"]
            })

        experience_level = profile.get("experience_level", "unknown")
        total_years = profile.get("total_years_of_experience", "N/A")

        prompt = f"""
        You are an expert technical recruiter matching candidates to job listings.
        
        Candidate Profile:
        - Skills: {", ".join(profile.get("skills", []))}
        - Total Years of Experience: {total_years} ({experience_level} level)
        - Preferred Roles: {", ".join(profile.get("preferred_roles", []))}
        - Experience Details: {json.dumps(profile.get("experience", []))}
        
        Evaluate ALL {len(chunk)} job listings below and score EACH ONE from 1 to 10 based on how well they fit the candidate's skills and experience level.
        
        You MUST respond with a valid JSON object ONLY. Do not include any introduction, formatting, or explanation text.
        
        The JSON object schema MUST be:
        {{
            "matches": [
                {{
                    "index": 0,
                    "score": 8,
                    "reason": "Brief 1-2 sentence explanation of why it fits or doesn't fit."
                }}
            ]
        }}
        
        IMPORTANT: Include ALL jobs in the response. Score every single job, even if the score is low. Do NOT skip any job.
        
        Job Listings to Evaluate:
        {json.dumps(jobs_input)}
        """

        try:
            response = client.chat.completions.create(
                model="sonar",
                messages=[
                    {"role": "system", "content": "You are a job matching assistant. You only output valid JSON. Do not write explanations outside the JSON object."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            content = response.choices[0].message.content.strip()
            
            # Clean markdown code block if present
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()
            
            matches_data = json.loads(content)
            matches_list = matches_data.get("matches", [])
            
            # Track which indices the AI scored
            scored_indices = set()
            
            for match in matches_list:
                idx = match.get("index")
                if idx is not None and 0 <= idx < len(chunk):
                    scored_indices.add(idx)
                    orig_job = chunk[idx]
                    matched_job = {
                        "title": orig_job["title"],
                        "company": orig_job["company"],
                        "location": orig_job["location"],
                        "salary": orig_job["salary"],
                        "url": orig_job["url"],
                        "source": orig_job["source"],
                        "score": match.get("score", 5),
                        "reason": match.get("reason", "Evaluated by AI matcher.")
                    }
                    matched_jobs.append(matched_job)
            
            # Add any jobs the AI missed with a default score of 5
            for idx, job in enumerate(chunk):
                if idx not in scored_indices:
                    matched_jobs.append({
                        "title": job["title"],
                        "company": job["company"],
                        "location": job["location"],
                        "salary": job["salary"],
                        "url": job["url"],
                        "source": job["source"],
                        "score": 5,
                        "reason": "Not individually evaluated — default score assigned."
                    })
            
            print(f"[JobMatcher] Scored {len(scored_indices)}/{len(chunk)} jobs in this batch")
                    
        except Exception as e:
            print(f"[JobMatcher] Error matching batch starting at index {i}: {str(e)}")
            # On error, add all jobs from this batch with default score
            for job in chunk:
                matched_jobs.append({
                    "title": job["title"],
                    "company": job["company"],
                    "location": job["location"],
                    "salary": job["salary"],
                    "url": job["url"],
                    "source": job["source"],
                    "score": 5,
                    "reason": "Scoring failed — default score assigned."
                })
            
    # Sort ALL jobs by score descending
    matched_jobs.sort(key=lambda x: x["score"], reverse=True)
    
    print(f"[JobMatcher] Completed matching. Total scored: {len(matched_jobs)} (all jobs, no filtering)")
    return matched_jobs

def _get_fallback_matches(profile: dict, raw_jobs: list) -> list:
    """Basic local heuristic matching for fallback — scores ALL jobs, no filtering."""
    skills_lower = [s.lower() for s in profile.get("skills", [])]
    matched = []
    
    for job in raw_jobs:
        title_lower = job["title"].lower()
        score = 5  # Default score
        reason = "General development role."
        
        # Simple match scoring
        matched_skills = [s for s in skills_lower if s in title_lower or s in job.get("company", "").lower()]
        if matched_skills:
            score = 8
            reason = f"Matches skills: {', '.join(matched_skills[:3])}."
        elif "python" in title_lower or "django" in title_lower or "backend" in title_lower:
            score = 9
            reason = "Direct match for Python/Django developer skills in your profile."
        elif "developer" in title_lower or "engineer" in title_lower:
            score = 6
            reason = "General developer/engineer role — may fit your background."
            
        matched.append({
            "title": job["title"],
            "company": job["company"],
            "location": job["location"],
            "salary": job["salary"],
            "url": job["url"],
            "source": job["source"],
            "score": score,
            "reason": reason
        })
            
    return sorted(matched, key=lambda x: x["score"], reverse=True)
