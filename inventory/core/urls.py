from django.conf.urls import url
from django.contrib.auth import logout

from .views import (CompanyView, ProductView, PurchaseView, DownloadInvoiceView)


urlpatterns = [
    # for user authentication
    url(r'^company/$', CompanyView.as_view(), name="company-view"),
    url(r'^product/$', ProductView.as_view(), name="product-view"),
    url(r'^purchase-order/$', PurchaseView.as_view(), name="purchase-view"),
    url(r'^download-invoice/(?P<pk>[\w-]+)/$',
        DownloadInvoiceView.as_view(), name="download-invoice-view"),
]
