from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


# ==========================================
# Category Schemas
# ==========================================

# Base structure for a Category
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

# Used when creating a new category
class CategoryCreate(CategoryBase):
    pass

# Used when receiving data to update a category
class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None

# Used when sending data back to the frontend (must include id)
class CategoryResponse(CategoryBase):
    id: int
    status: str

    class Config:
        from_attributes = True

# ==========================================
# PRODUCT SCHEMAS
# ==========================================

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category_id: Optional[int] = None
    attribute: Optional[Dict[str, Any]] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    category_id: Optional[int] = None
    attribute: Optional[Dict[str, Any]] = None

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

# ==========================================
# USER SCHEMAS
# ==========================================

# Base properties for User
class UserBase(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email_address: str
    phone: Optional[str] = None

# Properties required to create a new User (includes password)
class UserCreate(UserBase):
    password: str

# Properties for updating a User (all fields are optional)
class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email_address: Optional[str] = None
    password: Optional[str] = None
    phone: Optional[str] = None

# Properties to return to the client (excludes password for security)
class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
