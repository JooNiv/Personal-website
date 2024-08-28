# app/comments.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .models import Comment
from .schemas import CommentCreate
from .database import get_db
from .dependencies import get_current_user

comments_router = APIRouter()

@comments_router.post("/api/post-comment")
async def post_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    db_comment = Comment(comment=comment.comment, username=comment.name)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@comments_router.get("/api/get-comments")
async def get_comments(db: Session = Depends(get_db)):
    comments = db.query(Comment).order_by(Comment.id.desc()).all()
    return comments

@comments_router.delete("/api/delete-comment/{index}")
async def delete_comment(index: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == index).first()
    db.delete(comment)
    db.commit()
