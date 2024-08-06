import os 
import pandas as pd 
from pandasai import Agent

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from pandasai import SmartDataframe

uri = "mongodb+srv://soc:root@stockscluster.ffmfprp.mongodb.net/"
client = MongoClient(uri, server_api=ServerApi('1'))
stockCollection = client.stocks.stocks
userCollection = client.stocks.users
os.environ["PANDASAI_API_KEY"] = os.environ.get("PANDAS_AI_KEY")
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost:3000",
    "http://localhost:5173",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
EMAIL = "hrishi0102business@gmail.com"

@app.post("/plotdata")
async def plotdata(request: Request):
    print(request)
    query = await request.json()
    query = json.loads(query)
    prompt = query['query']
    email = query['email']
    if not email:
        email = EMAIL
    # print(prompt)
    # print(email)
    user = userCollection.find_one({"email": email})
    stocks = stockCollection.find({"user": user})
    # data = {}
    # for stock in stocks:
    #     stock["_id"] = str(stock["_id"])
    #     del stock["user"]
    #     if stock["action"] == 'BUY':
    #         data["BUY"] = stock
    #     else:
    #         data["SELL"] = stock
    data = [{"id": str(stock["_id"]), "name": stock["name"], "current_price": stock["current_price"], "quantity": stock["quantity"], "action": stock["action"], "time": str(stock["timestamp"])} for stock in stocks]
    # data = {"data": data}
    print(data)
    
    sdf = SmartDataframe(data, config={
    "save_charts": True,
    "save_charts_path": 'exports/charts/pandasimage.png',
    })
    # agent = Agent(data)
    resp = sdf.chat(prompt)
    print(resp)
    return resp
    image = agent.chat(prompt)
    return image

if __name__ == "__main__":
    uvicorn.run("pandastest:app", port=5001, log_level="info", reload=True)