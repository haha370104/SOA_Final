from flask_restful import Resource
from model.bank_product import bank_product
from tools import ICBC, comm, ccb, bank_abc


class product_list(Resource):
    def get(self, bank_id, page_num, page_size):
        dic = {1: '中国工商银行', 2: '中国农业银行', 3: '中国建设银行', 4: '交通银行'}
        products = bank_product.query.filter(bank_product.bank_name == dic[bank_id]).offset(page_num * 14 - 14).limit(
            page_size)
        ajax = []
        for product in products:
            ajax.append(product.to_brief_json())
        return ajax


class product_detail(Resource):
    def get(self, ID):
        product = bank_product.query.get(ID)
        if product != None:
            return product.to_json()
        else:
            return {'Error': '404'}


class check_product(Resource):
    def get(self, bank_id):
        dic = {1: '中国工商银行', 2: '中国农业银行', 3: '中国建设银行', 4: '交通银行'}
        count = bank_product.query.filter(bank_product.bank_name == dic[bank_id]).count()
        return {'count': count}

    def put(self, bank_id):
        dic = [ICBC, bank_abc, ccb, comm]
        ob = dic[bank_id]
        return ob.update()
