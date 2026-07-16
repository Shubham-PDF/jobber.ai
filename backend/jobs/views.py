import os
import uuid
from django.conf import settings
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from .models import SearchHistory
from .serializers import JobSearchSerializer, SearchHistorySerializer
from .services.resume_parser import parse_resume
from .services.profile_extractor import extract_profile
from .services.job_scraper import scrape_jobs
from .services.job_matcher import match_jobs
from .services.output_writer import write_results

class SearchJobsView(APIView):
    """
    Main job matching pipeline view.
    Accepts resume upload, extracts skills, scrapes jobs, matches them in batches,
    deducts credits accordingly, and outputs CSV/Excel.
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = JobSearchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        platforms = serializer.validated_data["platforms"]
        resume_file = serializer.validated_data["resume"]

        # Calculate credit cost
        cost = 0
        for platform in platforms:
            platform_lower = platform.lower()
            if platform_lower == "simplyhired":
                cost += 2
            elif platform_lower == "dailyremote":
                cost += 1
            elif platform_lower == "indeed":
                cost += 3

        # Check credits
        if user.credits < cost:
            return Response(
                {"error": f"Insufficient credits. This search costs {cost} credits, but you only have {user.credits}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create upload/output directories if they don't exist
        uploads_dir = getattr(settings, "UPLOADS_DIR", os.path.join(settings.BASE_DIR, "uploads"))
        os.makedirs(uploads_dir, exist_ok=True)

        # Save uploaded file
        search_id = str(uuid.uuid4())
        _, ext = os.path.splitext(resume_file.name)
        temp_filename = f"{search_id}{ext}"
        temp_path = os.path.join(uploads_dir, temp_filename)

        with open(temp_path, "wb+") as destination:
            for chunk in resume_file.chunks():
                destination.write(chunk)

        try:
            # 1. Parse Resume text
            resume_text = parse_resume(temp_path)
            
            # 2. Extract profile using Perplexity
            profile = extract_profile(resume_text)
            
            # 3. Scrape Jobs from selected platforms using Firecrawl
            raw_jobs = scrape_jobs(platforms, profile)
            
            # 4. Score and filter jobs using Perplexity (stop at 10)
            matched_jobs = match_jobs(profile, raw_jobs)
            
            # 5. Write CSV & Excel results
            csv_filename, excel_filename = write_results(search_id, matched_jobs)

            # Deduct credits upon successful completion of matching
            user.deduct_credits(cost)

            # Save Search History record
            history = SearchHistory.objects.create(
                id=uuid.UUID(search_id),
                user=user,
                resume_filename=resume_file.name,
                extracted_profile=profile,
                platforms_used=platforms,
                credits_used=cost,
                jobs_found=len(matched_jobs),
                matched_jobs=matched_jobs,
                csv_filename=csv_filename
            )

            # Clean up raw resume file after parsing
            if os.path.exists(temp_path):
                os.remove(temp_path)

            return Response({
                "message": "Search completed successfully.",
                "search_id": search_id,
                "credits_remaining": user.credits,
                "profile": profile,
                "matches": matched_jobs,
                "csv_download_url": f"/api/jobs/download/csv/{search_id}/",
                "excel_download_url": f"/api/jobs/download/excel/{search_id}/"
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # Clean up temp file on failure
            if os.path.exists(temp_path):
                os.remove(temp_path)
            print(f"Pipeline error: {str(e)}")
            return Response(
                {"error": f"An error occurred during the job scraping pipeline: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DownloadFileView(APIView):
    """
    Serves generated CSV or Excel files.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, file_type, search_id):
        history = get_object_or_404(SearchHistory, id=search_id, user=request.user)
        output_dir = getattr(settings, "OUTPUT_DIR", os.path.join(settings.BASE_DIR, "output"))
        
        filename = f"jobs_{search_id}.csv" if file_type == "csv" else f"jobs_{search_id}.xlsx"
        file_path = os.path.join(output_dir, filename)

        if not os.path.exists(file_path):
            raise Http404("Requested file does not exist.")

        content_type = "text/csv" if file_type == "csv" else "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        
        response = FileResponse(open(file_path, "rb"), content_type=content_type)
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response

class SearchHistoryView(APIView):
    """
    Returns the search history for the logged-in user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        history = SearchHistory.objects.filter(user=request.user)
        serializer = SearchHistorySerializer(history, many=True)
        return Response(serializer.data)
