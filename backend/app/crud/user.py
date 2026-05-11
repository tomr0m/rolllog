import uuid

from sqlalchemy.orm import Session

from app.models.user import User


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, email: str, password_hash: str, name: str) -> User:
    user = User(email=email, password_hash=password_hash, name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_quick_start_user(db: Session, name: str) -> User:
    generated_email = f"fighter_{uuid.uuid4().hex}@rolllog.local"
    user = User(
        name=name,
        email=generated_email,
        password_hash=None,
        is_quick_start=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
