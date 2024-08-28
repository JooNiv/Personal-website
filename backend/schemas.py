# app/schemas.py
from pydantic import BaseModel

class CommentCreate(BaseModel):
    comment: str
    name: str
    captchaValue: str

class CaptchaRequest(BaseModel):
    captchaValue: str
