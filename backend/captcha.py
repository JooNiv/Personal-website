# app/captcha.py
from fastapi import APIRouter
from httpx import AsyncClient
from .schemas import CaptchaRequest
from dotenv import load_dotenv
import os

load_dotenv()

SITE_SECRET = os.getenv("SITE_SECRET")
captcha_router = APIRouter()

@captcha_router.post("/api/verify")
async def verify_captcha(captcha_request: CaptchaRequest):
    async with AsyncClient() as client:
        response = await client.post(
            "https://www.google.com/recaptcha/api/siteverify",
            params={"secret": SITE_SECRET, "response": captcha_request.captchaValue},
        )
    return response.json()
