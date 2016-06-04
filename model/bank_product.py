from app_config import db
import json


class bank_product(db.Model):
    __tablename__ = 'bank_financial'

    product_ID = db.Column('product_ID', db.String(40), primary_key=True, nullable=False)
    product_name = db.Column('product_name', db.String(100), nullable=False)
    interest_rate = db.Column('interest_rate', db.DECIMAL(4, 3), nullable=False)
    currencies = db.Column('currencies', db.String(8), nullable=False, default='人民币')
    duration = db.Column('duration', db.Integer, nullable=False)
    duration_flag = db.Column('duration_flag', db.Boolean, default=True)
    type_flag = db.Column('type_flag', db.Integer)
    product_url = db.Column('product_url', db.String(400), nullable=False)
    start_amount = db.Column('start_amount', db.Integer, nullable=False)
    bank_name = db.Column('bank_name', db.String(8), nullable=False)

    def __init__(self, ID, name, rate, duration, duration_flag, type, url, start_amount, bank, currencies='人民币'):
        self.product_ID = ID
        self.product_name = name
        self.interest_rate = rate
        self.duration = duration
        self.duration_flag = duration_flag
        self.type_flag = type
        self.product_url = url
        self.start_amount = start_amount
        self.bank_name = bank
        self.currencies = currencies

    def to_json(self):
        dic = {}
        dic['product_name'] = self.product_name
        dic['interest_rate'] = str(float(self.interest_rate)) + '%'
        dic['currenices'] = self.currencies
        if self.duration_flag == False:
            if self.duration == 0:
                dic['duration'] = '不限制时间'
            else:
                dic['duration'] = '至少{0}天'.format(str(self.duration))
        else:
            dic['duration'] = '{0}天'.format(str(self.duration))
        if self.type_flag:
            dic['type'] = '保本'
        else:
            dic['type'] = '非保本'
        dic['url'] = self.product_url
        dic['start_amount'] = '{0}万元'.format(str(self.start_amount / 10000.0))
        return dic

    def to_brief_json(self):
        dic = {}
        dic['ID'] = self.product_ID
        dic['product_name'] = self.product_name
        dic['rate'] = str(float(self.interest_rate)) + '%'
        return dic
