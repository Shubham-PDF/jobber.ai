from django.urls import path
from .views import SearchJobsView, DownloadFileView, SearchHistoryView

urlpatterns = [
    path("search/", SearchJobsView.as_view(), name="search-jobs"),
    path("download/<str:file_type>/<uuid:search_id>/", DownloadFileView.as_view(), name="download-file"),
    path("history/", SearchHistoryView.as_view(), name="search-history"),
]
