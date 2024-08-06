import redis 
import json
from fpdf import FPDF
from main import model
from datetime import datetime
import re 
from main import uri
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import asyncio

r = redis.Redis(host='localhost', port=6379, db=0)
client = MongoClient(uri, server_api=ServerApi('1'))
userCollection = client.stocks.users
print("Started..")


async def getReport(email: str, USER_TRANSACTIONS: list):
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

while True:
    task_data_json = r.lpop('generateReport')
    if task_data_json:
        task_data = json.loads(task_data_json.decode('utf-8'))
        resp = asyncio.run(getReport(task_data["email"], task_data["data"]))
        # loop = asyncio.get_event_loop()
        # loop.run_until_complete(getReport)
        # loop.close()
        print(resp)


