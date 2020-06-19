from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView, View

from .models import PurchaseOrder

from .utils import generate_invoice_pdf

# Create your views here.


class CompanyView(TemplateView):
    """
    this view renders company detail page
    """
    template_name = 'frontend/company.html'

    def get_context_data(self, **kwargs):
        context = super(CompanyView, self).get_context_data(**kwargs)
        context['company_page'] = "active"
        return context


class PurchaseView(TemplateView):
    """
    this view renders company detail page
    """
    template_name = 'frontend/purchase.html'

    def get_context_data(self, **kwargs):
        context = super(PurchaseView, self).get_context_data(**kwargs)
        context['purchase_page'] = "active"
        return context


class ProductView(TemplateView):
    """
    this view renders company detail page
    """
    template_name = 'frontend/product.html'

    def get_context_data(self, **kwargs):
        context = super(ProductView, self).get_context_data(**kwargs)
        context['product_page'] = "active"
        return context


class DownloadInvoiceView(View):
    """
    this view renders company detail page
    """

    def get(self, request, pk):
        # po = get_object_or_404(PurchaseOrder, id=self.kwargs['pk'])
        po = PurchaseOrder.objects.first()
        data = {'name': po.product.name, 'company': po.company.name,
                'no': po.order_number, 'quantity': po.quantity, 'price': po.product.price}
        print(data)
        invoice_path = generate_invoice_pdf(data)
        pdf_file = open(invoice_path, 'rb')
        response = FileResponse(pdf_file, content_type="application/pdf")
        response["Content-Disposition"] = "attachment; filename=invoice.pdf"
        return response
