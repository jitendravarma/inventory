from datetime import date
from collections import OrderedDict

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from django.shortcuts import get_object_or_404

from core.models import Company, Product, PurchaseOrder

from .serializers import (CompanySerializer, ProductSerializer,
                          PurchaseOrderSerializer, ProductListSerializer,
                          POSerializer)


# create apis here

def create_response(response_data):
    """
    method used to create response data in given format
    """
    response = OrderedDict()
    response["header"] = {"status": "1"}
    response["body"] = response_data
    return response


def create_serializer_error_response(errors):
    """
    method is used to create error response for serializer errors
    """
    error_list = []
    for k, v in errors.items():
        if isinstance(v, dict):
            _, v = v.popitem()
        d = {}
        d["field"] = k
        d["field_error"] = v[0]
        error_list.append(d)
    return OrderedDict({"header": {"status": "0"}, "errors": {
        "errorList": error_list}})


class CompanyAPIView(APIView):
    """
    Company API view create and update Company
    """

    serializer_class = CompanySerializer
    permission_classes = (AllowAny,)

    def get(self, request):
        source = CompanySerializer(Company.objects.all().order_by('-id'), many=True)
        return Response(create_response({"results": source.data}))

    def post(self, request, *args, **kwargs):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            source = CompanySerializer(Company.objects.all().order_by('-id'), many=True)
            return Response(create_response(
                {"msg": "Company created successfully", "data": source.data}))
        else:
            return Response(
                create_serializer_error_response(serializer.errors),
                status=403)


class GetProductsAPIView(APIView):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        company_id = self.kwargs['pk']
        company = get_object_or_404(Company, id=company_id)
        products = Product.objects.filter(company=company)
        source = ProductListSerializer(products, many=True)
        return Response(create_response({"results": source.data, }))


class ProductAPIView(APIView):
    """
    Product API view create and update Product order for a given
    company
    """

    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get(self, request):
        source = ProductListSerializer(Product.objects.all(), many=True)
        companies = CompanySerializer(Company.objects.all().order_by('-id'), many=True)
        return Response(create_response({
            "results": source.data, 'companies': companies.data
        }))

    def post(self, request, *args, **kwargs):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            products = ProductListSerializer(Product.objects.all(), many=True)
            return Response(create_response(
                {"msg": "Product created successfully",
                 "products": products.data}))
        else:
            return Response(
                create_serializer_error_response(serializer.errors),
                status=403)


class PurchaseAPIView(APIView):
    """
    purchase order API view create and update purchase order for a given
    company and a given product
    """

    serializer_class = PurchaseOrderSerializer
    permission_classes = (AllowAny,)

    def get(self, request):
        purchase = PurchaseOrderSerializer(PurchaseOrder.objects.all().order_by('-id'), many=True)
        companies = CompanySerializer(Company.objects.all().order_by('-id'), many=True)
        return Response(create_response({
            "purchases": purchase.data, 'products': [],
            'companies': companies.data, }))

    def post(self, request, *args, **kwargs):
        serializer = POSerializer(data=request.data)
        if serializer.is_valid():
            po = serializer.save()
            po.order_number = f'PO/{date.today().year}/{po.id}'
            po.save()
            purchases = PurchaseOrderSerializer(
                PurchaseOrder.objects.all().order_by('-id'), many=True)
            return Response(create_response(
                {"msg": "Purchase order created successfully",
                 "purchases": purchases.data, "id": po.id}))
        else:
            print(serializer.errors)
            return Response(
                create_serializer_error_response(serializer.errors),
                status=403)
