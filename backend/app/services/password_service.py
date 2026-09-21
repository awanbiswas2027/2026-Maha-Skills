from passlib.context import CryptContext

# Argon2id via passlib
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# A dummy hash for timing-equalisation when email is not found
# Using a fixed valid argon2 hash of "dummy"
DUMMY_HASH = "$argon2id$v=19$m=65536,t=3,p=4$qH5B4c9t1yB6u/yK8hK1gA$hHqjZ7n4X0x1uG9jP2vB8rT3nF6wK5sN7xU6rA9sJ5M"


def hash_password(password: str) -> str:
    """Hash a password using Argon2id."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against an Argon2id hash."""
    return pwd_context.verify(plain_password, hashed_password)
