from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db
from pydantic import BaseModel
import models
import schemas

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Lumiere Gown API!"}

# ==========================================
# CATEGORIES API
# ==========================================

# 1. Get all categories
@app.get("/categories/", response_model=list[schemas.CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Category).all()
    return categories

# 2. Get a category by ID
@app.get("/categories/{category_id}", response_model=schemas.CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# 3. Create a new category
@app.post("/categories/", response_model=schemas.CategoryResponse)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    new_category = models.Category(**category.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

# 4. Update category information
@app.put("/categories/{category_id}", response_model=schemas.CategoryResponse)
def update_category(category_id: int, category_data: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Update only the fields provided in the request
    update_data = category_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_category, key, value)
        
    db.commit()
    db.refresh(db_category)
    return db_category

# 5. Delete a category
@app.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
        
    db.delete(db_category)
    db.commit()
    return {"message": f"Category ID {category_id} has been deleted"}

# ==========================================
# PRODUCTS API
# ==========================================

# 1. Get all products
@app.get("/products/", response_model=list[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    return products

# 2. Get a product by ID
@app.get("/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# 3. Create a new product
@app.post("/products/", response_model=schemas.ProductResponse)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# 4. Update product information
@app.put("/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(product_id: int, product_data: schemas.ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Update only the fields provided in the request
    update_data = product_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return db_product

# 5. Delete a product
@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(db_product)
    db.commit()
    return {"message": f"Product ID {product_id} has been deleted"}

# ==========================================
# USERS API
# ==========================================

# 1. Get all users
@app.get("/users/", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

# 2. Get a specific user by ID
@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# 3. Create a new user
@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(models.User).filter(models.User.email_address == user.email_address).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # NOTE: In a production app, you should hash the password here before saving
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 4. Update user information
@app.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user_data: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.commit()
    db.refresh(db_user)
    return db_user

# 5. Delete a user
@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.delete(db_user)
    db.commit()
    return {"message": f"User ID {user_id} has been deleted"}

# ==========================================
# ADMINS API
# ==========================================

# 1. Get all admins
@app.get("/admins/", response_model=list[schemas.AdminResponse])
def get_admins(db: Session = Depends(get_db)):
    admins = db.query(models.Admin).all()
    return admins

# 2. Get a specific admin by ID
@app.get("/admins/{admin_id}", response_model=schemas.AdminResponse)
def get_admin(admin_id: int, db: Session = Depends(get_db)):
    admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin

# 3. Create a new admin
@app.post("/admins/", response_model=schemas.AdminResponse)
def create_admin(admin: schemas.AdminCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_admin = db.query(models.Admin).filter(models.Admin.email_address == admin.email_address).first()
    if existing_admin:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_admin = models.Admin(**admin.model_dump())
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

# 4. Update admin information
@app.put("/admins/{admin_id}", response_model=schemas.AdminResponse)
def update_admin(admin_id: int, admin_data: schemas.AdminUpdate, db: Session = Depends(get_db)):
    db_admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if not db_admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    update_data = admin_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_admin, key, value)
        
    db.commit()
    db.refresh(db_admin)
    return db_admin

# 5. Delete an admin
@app.delete("/admins/{admin_id}")
def delete_admin(admin_id: int, db: Session = Depends(get_db)):
    db_admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if not db_admin:
        raise HTTPException(status_code=404, detail="Admin not found")
        
    db.delete(db_admin)
    db.commit()
    return {"message": f"Admin ID {admin_id} has been deleted"}

# ==========================================
# SALES API
# ==========================================

# 1. Get all sales
@app.get("/sales/", response_model=list[schemas.SaleResponse])
def get_sales(db: Session = Depends(get_db)):
    sales = db.query(models.Sale).all()
    return sales

# 2. Get a specific sale by ID
@app.get("/sales/{sale_id}", response_model=schemas.SaleResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(models.Sale).filter(models.Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

# 3. Create a new sale transaction
@app.post("/sales/", response_model=schemas.SaleResponse)
def create_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db)):
    new_sale = models.Sale(**sale.model_dump())
    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)
    return new_sale

# 4. Update sale information (e.g. updating order status)
@app.put("/sales/{sale_id}", response_model=schemas.SaleResponse)
def update_sale(sale_id: int, sale_data: schemas.SaleUpdate, db: Session = Depends(get_db)):
    db_sale = db.query(models.Sale).filter(models.Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    
    update_data = sale_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_sale, key, value)
        
    db.commit()
    db.refresh(db_sale)
    return db_sale

# 5. Delete a sale record
@app.delete("/sales/{sale_id}")
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    db_sale = db.query(models.Sale).filter(models.Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Sale not found")
        
    db.delete(db_sale)
    db.commit()
    return {"message": f"Sale ID {sale_id} has been deleted"}


class LoginRequest(BaseModel):
    email_address: str
    password: str

@app.post("/login/")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # 1. เช็กว่าเป็น Admin ไหม
    admin = db.query(models.Admin).filter(models.Admin.email_address == req.email_address, models.Admin.password == req.password).first()
    if admin:
        return {"role": "admin", "id": admin.id}
    
    # 2. เช็กว่าเป็น User ปกติไหม
    user = db.query(models.User).filter(models.User.email_address == req.email_address, models.User.password == req.password).first()
    if user:
        return {"role": "user", "id": user.id}
    
    # 3. ถ้าไม่เจอทั้งคู่
    raise HTTPException(status_code=400, detail="Invalid email address or password")