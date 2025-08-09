from app.schemas.contact_schema import ContactForm
from app.db.database import db
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

@router.post("/post")
async def send_contact_email(contact: ContactForm):
    try:
        # Email configuration
        smtp_server = "smtp.gmail.com"
        port = 587  
        sender_email = os.getenv("EMAIL_ADDRESS")
        password = os.getenv("EMAIL_PASSWORD")  

        # Create message
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = sender_email  
        msg["Subject"] = f"Portfolio Contact from {contact.first_name} {contact.last_name}"

        body = f"""
        New contact form submission:
        
        Name: {contact.first_name} {contact.last_name}
        Email: {contact.email}
        
        Message:
        {contact.message}
        """

        msg.attach(MIMEText(body, "plain"))

        # Create secure SSL/TLS connection
        server = smtplib.SMTP(smtp_server, port)
        server.starttls()
        
        # Login and send email
        server.login(sender_email, password)
        server.send_message(msg)
        server.quit()

        return {"message": "Email sent successfully"}
    except Exception as e:
           raise HTTPException(status_code=500, detail="Failed to send email")