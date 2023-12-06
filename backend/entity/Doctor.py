from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import BaseModel ,EmailStr


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from pydantic import BaseModel

class Doctor(BaseModel):
    username: str
    password: str
    email: EmailStr
    role: str

    def __init__(self, **data):
        super().__init__(**data)
        self.password = self.hash_pass(self.password)

    def get_username(self): 
        return self.username

    def get_password(self):
        return self.password

    def get_email(self):
        return self.email

    @staticmethod
    def hash_pass(password: str):
        return pwd_context.hash(password)

    def update_password(self, new_password: str):
        # Hash the new password and update the password property
        self.password = self.hash_pass(new_password)