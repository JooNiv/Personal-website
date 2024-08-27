from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

POSTGRES_URL = os.getenv("POSTGRES_URL_SQL_ALCHEMY")

engine = create_engine(
    POSTGRES_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)
    comment = Column(String)
    username = Column(String)

ADMIN_USERNAME = os.getenv('ADMIN_USERNAME')
ADMIN_PASSWORD_HASH = os.getenv('ADMIN_PASSWORD_HASH')
SITE_SECRET = os.getenv("SITE_SECRET")
SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception()
        token_data = {"username": username}
        return token_data
    except JWTError:
        raise credentials_exception()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CaptchaRequest(BaseModel):
    captchaValue: str

class CommentCreate(BaseModel):
    comment: str
    name: str

comments = []


@app.post("/api/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username == ADMIN_USERNAME and verify_password(form_data.password, ADMIN_PASSWORD_HASH):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": form_data.username}, expires_delta=access_token_expires)
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/api/verify")
async def verify_captcha(captcha_request: CaptchaRequest):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://www.google.com/recaptcha/api/siteverify",
            params={"secret": SITE_SECRET, "response": captcha_request.captchaValue},
        )
    return response.json()

@app.delete("/api/delete-comment/{index}")
async def delete_comment(index: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == index).first()
    db.delete(comment)
    db.commit()

@app.post("/api/post-comment")
async def post_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    all_comments = db.query(Comment).order_by(Comment.id).all()

    if len(all_comments) > 10:
        db.delete(all_comments[-1])
        db.commit()
    print(comment)
    db_comment = Comment(comment=comment.comment, username=comment.name)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@app.get("/api/get-comments")
async def get_comments(db: Session = Depends(get_db)):
    comments = db.query(Comment).order_by(Comment.id).all()
    for comment in comments:
        print(f"ID: {comment.id}, Comment: {comment.comment}, Username: {comment.username}")

    return comments
@app.get("/index.html")
async def block_direct_index():
    # Return a 404 Not Found response when trying to access /index.html
    raise HTTPException(status_code=404, detail="Not found")

# Serve the React static files, with the assumption that "static" contains the built React app
app.mount("/", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static"), html=True), name="static")

# Serve the React app's entry point
@app.get("/")
async def serve_react_app():
    return FileResponse(os.path.join(os.path.dirname(__file__), "static", "index.html"))
