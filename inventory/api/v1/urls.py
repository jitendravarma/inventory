from django.conf.urls import url, include

from .views import (CompanyAPIView, ProductAPIView, PurchaseAPIView,
                    GetProductsAPIView)

app_name = "v1"
urlpatterns = [
    url(r'^company/$', CompanyAPIView.as_view(), name="company-api"),
    url(r'^product/$', ProductAPIView.as_view(), name="product-api"),
    url(r'^purchase/$', PurchaseAPIView.as_view(), name="purchase-api"),
    url(r'product/(?P<pk>[\w-]+)/$',
        GetProductsAPIView.as_view(), name="company-product"),
]
