from django.urls import path
from .views import RequestCreditsView, CreditHistoryView

urlpatterns = [
    path("request/", RequestCreditsView.as_view(), name="request-credits"),
    path("history/", CreditHistoryView.as_view(), name="credit-history"),
]
