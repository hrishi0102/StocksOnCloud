from pydantic import BaseModel
import json 
from pydantic.json import pydantic_encoder


class UserModel(BaseModel):
    _id: str 
    name: str 
    email: str 
    password: str 
    def json(self, **kwargs):
        dict_data = self.dict()
        return json.dumps(dict_data, default=pydantic_encoder, **kwargs)

class StockModel(BaseModel): 
    Name: str 
    Current_price: int
    quantity: int
    action: str 
    timestamp: str
    user: UserModel
