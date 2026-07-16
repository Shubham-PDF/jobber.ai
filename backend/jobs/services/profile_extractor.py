import json
import re
from datetime import datetime
from dateutil import parser as date_parser
from dateutil.relativedelta import relativedelta
from django.conf import settings
from openai import OpenAI


def extract_profile(resume_text: str) -> dict:
    """
    Uses Perplexity AI (via OpenAI-compatible API) to extract skills,
    experience, and education from raw resume text in JSON format.
    Then calculates real work experience from dates.
    """
    api_key = getattr(settings, "PERPLEXITY_API_KEY", "")
    if not api_key:
        # Fallback for testing/missing key
        return {
            "name": "Unknown Candidate",
            "skills": ["Python", "Django", "React"],
            "experience": [],
            "total_years_of_experience": 0,
            "experience_level": "fresher",
            "preferred_roles": ["Software Developer"],
            "search_queries": ["Software Developer", "Python Developer", "Django Developer"],
            "education": []
        }

    client = OpenAI(
        api_key=api_key,
        base_url="https://api.perplexity.ai"
    )

    prompt = f"""
    Analyze the following raw resume text and extract the candidate's professional profile.
    
    You MUST respond with a valid JSON object ONLY. Do not include any introduction, formatting, or explanation text.
    
    The JSON object MUST follow this schema:
    {{
        "name": "Candidate's full name",
        "skills": ["List of technical/soft skills"],
        "experience": [
            {{
                "title": "Job Title",
                "company": "Company Name",
                "start_date": "Month Year (e.g. Sep 2025, January 2024, or just 2023)",
                "end_date": "Month Year or 'present' if currently working there",
                "highlights": ["Major accomplishment 1", "Major accomplishment 2"]
            }}
        ],
        "preferred_roles": ["List of job titles they are qualified for"],
        "search_queries": ["Exactly 3 highly targeted search queries for job boards based on candidate's top skills and strongest roles (e.g. 'Python Django Developer', 'React Frontend Developer'). Maximum 3 queries only."],
        "education": ["List of degrees and certifications"]
    }}
    
    Important rules:
    - For search_queries, generate EXACTLY 3 queries. Pick the 3 best-matching keyword combinations for this candidate.
    - For experience, extract the actual start_date and end_date from the resume text. Use 'present' if they are currently working there.
    - If no dates are found for an experience entry, estimate based on context.
    
    Resume Text:
    {resume_text}
    """

    response = client.chat.completions.create(
        model="sonar",
        messages=[
            {"role": "system", "content": "You are a professional resume parsing assistant. You only output valid JSON matching the requested schema. Never output markdown formatting or conversational text."},
            {"role": "user", "content": prompt}
        ]
    )

    content = response.choices[0].message.content.strip()

    # Clean code fences if the model included them
    if content.startswith("```json"):
        content = content[7:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()

    try:
        profile = json.loads(content)
    except json.JSONDecodeError:
        # Fallback regex search if JSON parsing failed
        json_match = re.search(r"\{.*\}", content, re.DOTALL)
        if json_match:
            try:
                profile = json.loads(json_match.group(0))
            except Exception:
                profile = _get_fallback_profile()
                return profile
        else:
            profile = _get_fallback_profile()
            return profile

    # Enforce max 3 search queries
    if "search_queries" in profile:
        profile["search_queries"] = profile["search_queries"][:3]
    else:
        profile["search_queries"] = ["Software Developer", "Python Developer", "Web Developer"]

    # Calculate real experience from dates
    experience_list = profile.get("experience", [])
    total_years = _calculate_experience_years(experience_list)
    profile["total_years_of_experience"] = total_years
    profile["experience_level"] = _get_experience_level(total_years)

    print(f"[ProfileExtractor] Name: {profile.get('name')}")
    print(f"[ProfileExtractor] Search queries (max 3): {profile.get('search_queries')}")
    print(f"[ProfileExtractor] Calculated experience: {total_years} years → {profile['experience_level']}")

    return profile


def _calculate_experience_years(experience_list: list) -> float:
    """
    Calculates total work experience in years from a list of experience entries
    with start_date and end_date fields.
    """
    if not experience_list:
        return 0.0

    total_months = 0
    today = datetime.now()

    for entry in experience_list:
        start_str = entry.get("start_date", "")
        end_str = entry.get("end_date", "")

        start_date = _parse_date(start_str)
        if not start_date:
            continue  # Skip entries without parseable start dates

        if not end_str or end_str.lower().strip() in ("present", "current", "now", "ongoing"):
            end_date = today
        else:
            end_date = _parse_date(end_str)
            if not end_date:
                end_date = today  # Default to today if end date is unparseable

        # Calculate months between start and end
        if end_date >= start_date:
            diff = relativedelta(end_date, start_date)
            months = diff.years * 12 + diff.months
            total_months += months

    # Convert to years, rounded to 1 decimal
    total_years = round(total_months / 12, 1)
    return total_years


def _parse_date(date_str: str) -> datetime | None:
    """
    Parses various date formats: 'Sep 2025', 'September 2025', '2023',
    'Jan 2024', '01/2024', etc.
    """
    if not date_str or not date_str.strip():
        return None

    date_str = date_str.strip()

    # Handle bare year like "2023"
    if re.match(r"^\d{4}$", date_str):
        return datetime(int(date_str), 1, 1)

    try:
        return date_parser.parse(date_str, dayfirst=False, default=datetime(2000, 1, 1))
    except (ValueError, TypeError):
        pass

    # Try Month Year patterns manually
    month_year_pattern = re.match(
        r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*(\d{4})",
        date_str.lower()
    )
    if month_year_pattern:
        try:
            return date_parser.parse(f"{month_year_pattern.group(1)} {month_year_pattern.group(2)}")
        except (ValueError, TypeError):
            pass

    return None


def _get_experience_level(years: float) -> str:
    """Maps years of experience to a level string."""
    if years < 1:
        return "fresher"
    elif years < 3:
        return "junior"
    elif years < 6:
        return "mid"
    else:
        return "senior"


def _get_fallback_profile() -> dict:
    return {
        "name": "Extracted Candidate",
        "skills": ["Python", "Django"],
        "experience": [],
        "total_years_of_experience": 0,
        "experience_level": "fresher",
        "preferred_roles": ["Software Developer"],
        "search_queries": ["Software Developer", "Python Developer", "Django Developer"],
        "education": []
    }
