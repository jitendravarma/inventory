import os

from django.conf import settings
from django.template.loader import render_to_string

from weasyprint import HTML


def generate_invoice_pdf(data):
    file_path = os.path.join(settings.MEDIA_ROOT, 'static', 'invoice')
    html_string = render_to_string('invoice_pdf.html', data)
    html = HTML(string=html_string)
    file_path = f'{file_path}/invoice.pdf'
    html.write_pdf(target=file_path)
    print(file_path)
    return file_path
