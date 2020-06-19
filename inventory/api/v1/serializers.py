from rest_framework import serializers

from core.models import Company, Product, PurchaseOrder


class CompanySerializer(serializers.ModelSerializer):

    def validate(self, data):
        is_already_exists = Company.objects.filter(name=data['name']).exists()
        if is_already_exists:
            raise serializers.ValidationError('Company with same name already exists')
        return data

    class Meta:
        model = Company
        fields = '__all__'


class ProductListSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'name', 'company', 'price')


class ProductSerializer(serializers.ModelSerializer):

    def validate(self, data):
        is_already_exists = Product.objects.filter(name=data['name'], company=data['company']).exists()
        if is_already_exists:
            raise serializers.ValidationError('Product with same name already exists')
        return data

    class Meta:
        model = Product
        fields = '__all__'


class POSerializer(serializers.ModelSerializer):

    class Meta:
        model = PurchaseOrder
        exclude = ('order_number',)


class PurchaseOrderSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    product = ProductSerializer()

    class Meta:
        model = PurchaseOrder
        fields = '__all__'
