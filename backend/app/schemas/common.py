from typing import Generic, TypeVar, Optional, Any, List
from pydantic import BaseModel

T = TypeVar("T")

class PaginationMeta(BaseModel):
    page: int = 1
    limit: int = 20
    total_count: int = 0
    total_pages: int = 0

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    meta: Optional[PaginationMeta] = None
    error: Optional[Any] = None
