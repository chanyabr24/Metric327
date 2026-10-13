from pydantic import BaseModel
from typing import Optional

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

