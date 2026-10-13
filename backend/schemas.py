from pydantic import BaseModel
from typing import Optional, Dict, Any

# --- Category Schemas ---

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
