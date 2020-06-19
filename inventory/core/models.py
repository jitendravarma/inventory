from django.db import models

# Create your models here.


class Company(models.Model):
    """
    model to store company attrs
    """
    name = models.CharField(max_length=50, blank=False, null=False)
    gst_no = models.CharField(max_length=50, blank=False, null=False)

    def __str__(self):
        return f"{self.name}, {self.gst_no}"


class Product(models.Model):
    """
    model to store products attrs
    """
    name = models.CharField(max_length=50, blank=False, null=False)
    price = models.FloatField(max_length=50, blank=False, null=False)
    company = models.OneToOneField("Company", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name}, {self.gst_no}"


class PurchaseOrder(models.Model):
    """
    model to store purchase order for a given quantity and auto generates 
    order number as PO/2020/n
    """

    order_number = models.CharField(max_length=50, blank=False, null=False)
    company = models.ForeignKey("Company", on_delete=models.CASCADE)
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    quantity = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.product.name}, {self.quantity}"
