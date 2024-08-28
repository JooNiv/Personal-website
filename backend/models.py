# app/models.py
from sqlalchemy import Column, Integer, String
from .database import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    comment = Column(String)
    username = Column(String)
