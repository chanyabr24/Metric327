from sqlalchemy import Column, Integer, String, Text, Numeric, Enum, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base

# --- Enum ---
class CategoryStatus(str, enum.Enum):
    SHOW = "SHOW"
    HIDE = "HIDE"

class CustomerType(str, enum.Enum):
    REGULAR = "REGULAR"
    VIP = "VIP"

class SaleStatus(str, enum.Enum):
    COMPLETED = "COMPLETED"
    PENDING = "PENDING"
    CANCELLED = "CANCELLED"
    PROCESSING = "PROCESSING"

# --- Admins Table ---
class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email_address = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone_number = Column(String(20))
    employee_id = Column(String(50))
    created_at = Column(DateTime, server_default=func.now())

# --- Users Table ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255))
    email_address = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone = Column(String(20))
    created_at = Column(DateTime, server_default=func.now())
    
    sales = relationship("Sale", back_populates="user")

# --- Categories Table---
class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(Enum(CategoryStatus), default=CategoryStatus.SHOW)
    image_url = Column(String(255))

    products = relationship("Product", back_populates="category")

# --- Products Table ---
class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String(255))
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"))
    attribute = Column(JSON)

    category = relationship("Category", back_populates="products")

# --- Sales Table ---
class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(100), nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_type = Column(Enum(CustomerType), default=CustomerType.REGULAR)
    amount = Column(Numeric(12, 2), nullable=False)
    status = Column(Enum(SaleStatus), default=SaleStatus.PROCESSING)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="sales")