from fastapi import FastAPI, Request, UploadFile
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import uvicorn
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import BackgroundTasks

from model import UserModel, StockModel
from pydantic import BaseModel
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from typing import List
from pathlib import Path
import random

# import redis
# from fastapi.responses import JSONResponse, FileResponse
# import pandas as pd
# from pandasai import Agent  

import requests
import google.generativeai as genai
import json 
import re
import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from hashlib import sha256 
from datetime import datetime
import random
from fpdf import FPDF

load_dotenv()

class Query(BaseModel):
    query: str

INTENTS = {}
USER_OTP = {}
API_KEY = ""
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
# os.environ["PANDASAI_API_KEY"] = os.environ.get("PANDAS_AI_KEY")
USER_TRANSACTIONS = {}

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')
COMPANY_NAME = {"apple": "aapl", "infosys": "infy", "ibm": "ibm", "tata": "tcs", "tcs": "tcs"}

uri = "mongodb+srv://soc:root@stockscluster.ffmfprp.mongodb.net/"
# redis_conn = redis.Redis(host='localhost', port=6379, db=0)

client = None
useruserCollection = None
stockCollection = None
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost:3000",
    "http://localhost:5173",
]
echios_symbols = ["ibm", "msft", "tsla", "race"]
echiosapiKey= 'GRP18XR0CK3T7'
echios_url = "https://echios.tech/price/" 
previous_echios_mock = None
EMAIL = ""

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    # pre process before the server starts
    global INTENTS 
    with open("intent.json") as file:
        data = json.load(file)
    INTENTS = data 
    global API_KEY
    API_KEY = os.environ.get("ALPHA_VANTAGE_API_KEY")
    global client
    client = MongoClient(uri, server_api=ServerApi('1'))
    global userCollection 
    userCollection = client.stocks.users
    global stockCollection
    stockCollection = client.stocks.stocks
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
    yield
    # Clean up the ML models and release the resources
    # post process after the server ends

conf = ConnectionConfig(
    MAIL_USERNAME = "dhananjay2002pai@gmail.com",
    MAIL_PASSWORD = "mxfzvwcytedlfewf",
    MAIL_FROM = "dhananjay2002pai@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    MAIL_FROM_NAME = "stocksOnCloud"
)


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_context(text: str):
    clean_txt = re.sub(r"\n", " ", text)
    clean_txt = re.sub(r"\s+", " ", clean_txt)
    clean_txt = clean_txt.strip()
    return clean_txt

@app.get("/test")
async def home():
    with open("intent.json") as f:
        data = json.load(f)
    data = userCollection.find()
    for user in data:
        print(user["name"], str(user["_id"]))
    # return data

@app.post("/register")
async def regsiter(request: Request):
    body = await request.json()
    password = body["password"]
    email = body["email"]
    user = userCollection.find_one({"email": email, "name": body["name"]})
    if user and user.get("email", "") == email: 
        return False
    hash = sha256(password.encode()).hexdigest()
    body["password"] = hash
    data = userCollection.insert_one(body)
    return str(data.inserted_id)

@app.post("/login")
async def login(request: Request):
    body = await request.json()
    email = body["email"]
    password = body["password"]
    data = userCollection.find_one({"email": email})
    hashed_pass = sha256(password.encode()).hexdigest()
    if hashed_pass == data["password"]:
        otp = ""
        for i in range(4):
            otp += str(random.randint(0,9))
        hashed_otp = sha256(otp.encode()).hexdigest()
        USER_OTP[email] = hashed_otp
        await sendmail(email, otp)
        print("Mail sent")
        return True
    return False


async def sendmail(email: str, otp: str):
    if not USER_OTP.get(email, ""): return "User not found"
    html = f"""<p>Hi \n
                Your OTP is : {otp} \n
                \n\n
                Thanks and Regards,
                DJ
            </p> """
    message = MessageSchema(
        subject="Verify OTP - stocksOnCloud",
        recipients=[email],
        body=html,
        subtype=MessageType.html)

    fm = FastMail(conf)
    await fm.send_message(message)
    return True


@app.post("/verifyOTP")
async def verify(request: Request):
    body = await request.json()
    email = body["email"]
    otp = body["otp"]
    hashed_otp = sha256(otp.encode()).hexdigest()
    if hashed_otp == USER_OTP.get(email, ""):
        global EMAIL
        EMAIL = email
        return True 
    return False


@app.post("/query")
async def query(request: Request):
    data = await request.json()
    context = data["query"].lower()
    clean_text = clean_context(context)
    tokens = clean_text.split()
    if "chart" in tokens or "plot" in tokens or "graph" in tokens:
        data["email"] = EMAIL
        json_data = json.dumps(data)
        resp = requests.post(f"http://localhost:5001/plotdata", json=json_data)
        return "Plotted"
    for token in tokens:
        if INTENTS.get(token):
            if INTENTS[token] == "fetch":
                company_name = None
                if "of" not in tokens:
                    list_stocks = list(COMPANY_NAME.keys())
                    for stock in list_stocks:
                        if stock in tokens:
                            company_name = stock
                            if COMPANY_NAME.get(company_name):
                                return await fetchData(COMPANY_NAME[company_name])
                if not company_name and "of" in tokens:
                    placeholder = tokens.index("of")
                    company_name = tokens[placeholder+1]
                    if COMPANY_NAME.get(company_name):
                        return await fetchData(COMPANY_NAME[company_name])
                if not company_name or "of" not in tokens:
                    new_query = data["query"] + ". Make sure the generated text is in plain string text is not formatted for prettification, I need the repsonse text in plain string. I want the answer in dictionary format so that I can parse the generated string as a dictionary in python. Example output: {'stock_name': ['stock_value', 'high', 'low', 'other data']}"
                    response = model.generate_content(new_query)
                    return response.text
                if company_name and COMPANY_NAME.get(company_name):
                    return await fetchData(COMPANY_NAME[company_name])
                
            # if INTENTS[token] == "buy":
            #     if "of" not in tokens:
            #         return "Stock name not detected"
            #     else:
            #         placeholder = tokens.index("of")
            #         company_name = tokens[placeholder+1]
            #         data = requests.post("http://localhost:5000/transaction", {"email": email, })

    new_query = data["query"] + ". The generated text should be exactly in this format without any newlines and text editor symbols. The text format should be : '1.) Strategy: A trading strategy in detail, 2.) Timeframe: 3.) Indicators: 4.)Real time stock price: AAPL: 100$, 5.) Entry Rules:, etc'"
    response = model.generate_content(new_query)
    lines = response.text.split('\n')
    res = ""
    for line in lines:
        chunks = line.split('**')
        res += ''.join(chunks)
        res += ' '
    print(res)
    return res

@app.post("/transaction")
async def transact(request: Request):
    body = await request.json()
    email = body["email"]
    user = userCollection.find_one({"email": email})
    if not user:
        return False
    else:
        userId = str(user["_id"])
        print(userId)
        time = datetime.now()
        stock_data = {"name": body["stock_name"], "current_price": body["price"], "quantity": body["quantity"], "action": body["action"], "timestamp": time.strftime("%d/%m/%Y %H:%M:%S"), "user": user}
        data = stockCollection.insert_one(stock_data)
        global EMAIL 
        EMAIL = email
        return str(data.inserted_id)
    
@app.get("/getOrderBook")
async def getOrderBook(email: str, background_tasks: BackgroundTasks):
    user = userCollection.find_one({"email": email})
    if not user:
        return {"success": False}
    stocks = stockCollection.find({"user": user})
    data = [{"id": str(stock["_id"]), "name": stock["name"], "current_price": stock["current_price"], "quantity": stock["quantity"], "action": stock["action"], "time": stock["timestamp"]} for stock in stocks]
    global USER_TRANSACTIONS
    # for txn in data:
    #     stock_name = txn["name"].lower()
    #     USER_TRANSACTIONS[stock_name] = USER_TRANSACTIONS.get(stock_name, []) + [txn]
    USER_TRANSACTIONS = data
    task_data = {"data": data, "email": email}
    json_data = json.dumps(task_data)
    global EMAIL 
    EMAIL = email
    # redis_conn.rpush("generateReport", json_data)
    background_tasks.add_task(getReport, email)
    return data

async def getReport(email: str):
    user = userCollection.find_one({"email": email})
    if not user:
        return {"success": False}
    time = datetime.now()
    todaydate = time.strftime("%d/%m/%Y %H:%M:%S")
    newquery = "I have this list of data consisting of stock_id, stock name, current price, quantity, action. Generate a report"
    newquery += " and provide a detailed analysis and give strategies and all this based on after comparing it current stocks data."
    newquery += " Provide the text in simple textual format with clean texts and no additional formatting."
    newquery += f" The data is: {str(USER_TRANSACTIONS)}. Make sure the generated text is in legal document format all data in a single line. Todays data: {todaydate}"
    answer = model.generate_content(newquery)
    text = answer.text
    print(text)
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    lines = text.split('\n')
    line_height = pdf.font_size * 2  # Adjust as needed
    for line in lines:
        if line.startswith("**"):
            pdf.set_font("Arial", size=12, style='B')  # Bold
            line = line[2:]
            line = re.sub(r'\*\*', '', line)
        elif line.startswith("*"):
            pdf.set_font("Arial", size=12, style='I')  # Italic
            line = line[1:]
            line = re.sub(r'\*\*', '', line)
        else:
            pdf.set_font("Arial", size=12)
            line = re.sub(r'\*\*', '', line)
        #pdf.cell(0, line_height, line, ln=1)
        pdf.multi_cell(0, line_height, line)
    pdf.output("media/reports.pdf")
    return True 

@app.get("/download-report")
async def download_report():
    file_path = "media/reports.pdf"  # Replace with the correct path
    return FileResponse(Path(os.getcwd(), file_path), media_type="application/pdf")


@app.get("/echios")
async def getData(symbol: str):
    api_url = echios_url+symbol+"?apikey="+echiosapiKey
    global previous_echios_mock 
    try:
        data = requests.get(api_url)
        res = data.json()
        if not res:
            return previous_echios_mock
        previous_echios_mock = res 
        return res
    except:
        try:
            price = previous_echios_mock["API_INFO"]["price"]
            curr_val = random.uniform(price-1.5, price+1.5)
            previous_echios_mock["API_INFO"]["price"] = curr_val
            return previous_echios_mock
        except:
            data = previous_echios_mock

# @app.post("/chatwithdata")
# async def chatData(request: Request):
#     query = await request.json()
#     query = query["query"]
#     data = USER_TRANSACTIONS
#     print(query, data)
#     agent = Agent(pd.DataFrame(data))
#     print(pd.DataFrame(data))
#     response = agent.chat(query)
#     return response


@app.get("/getStockPrices")
async def getData():
    context = """Generate the top 8 stocks. 8 stocks for top gainers, 8 stocks for top loser and 8 stocks for most actively traded. The output data should be in this format without any newlines and I can convert it directly to dictionary using json.loads() in python : {
    "metadata": "Top gainers, losers, and most actively traded US tickers",
    "last_updated": "2024-07-26 16:16:00 US/Eastern",
    "top_gainers": [
        {
            "ticker": "BNAIW",
            "price": "0.1899",
            "change_amount": "0.1299",
            "change_percentage": "216.5%",
            "volume": "403641"
        }], ,
    "top_losers": [
        {
            "ticker": "NBY",
            "price": "0.7149",
            "change_amount": "-1.2251",
            "change_percentage": "-63.1495%",
            "volume": "3997719"
        }]"most_actively_traded": [
        {
            "ticker": "SLNA",
            "price": "0.03",
            "change_amount": "-0.0076",
            "change_percentage": "-20.2128%",
            "volume": "383567435"
        }]
        }"""
    response = model.generate_content(context)
    return response.text
   

async def fetchData(symbol: str, interval = ""):
    if not interval:
        interval = "5min"
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval={interval}&apikey={API_KEY}'
    data = requests.get(url)
    return data.json()


            

if __name__ == "__main__":
    if os.environ.get("DEPLOYMENT") == "PROD":
        uvicorn.run("main:app", port=5000, log_level="info", reload=False, workers=4)
    else:
        uvicorn.run("main:app", port=5000, log_level="info", reload=True,  workers=4)