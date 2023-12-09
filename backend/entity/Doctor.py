from typing import List
import bcrypt
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import BaseModel ,EmailStr

##
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from pydantic import BaseModel

class Doctor(BaseModel):
    username: str
    password: str
    email: EmailStr
    pending_patient: List[str] = []  # Include the pending_patient field with a default empty list of usernames
    patients: List[str] = []  # Include the patients field with a default empty list of usernames

    def __init__(self, **data):
        super().__init__(**data)
        self.password = self.hash_password(self.password)

    def get_username(self): 
        return self.username

    def get_password(self):
        return self.password

    def get_email(self):
        return self.email

    @staticmethod
    def hash_password(password: str):
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')

    def update_password(self, new_password: str):
        # Hash the new password and update the password property
        self.password = self.hash_pass(new_password)