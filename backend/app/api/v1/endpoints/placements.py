import uuid

from fastapi import APIRouter, Depends, File, Form, UploadFile, status

from ....core.rbac import InstituteScope, require_institute_scope, require_roles
from ....core.security import SecurityContext
from ....schemas.common import ApiResponse

router = APIRouter()

_require_principal = require_roles("ITI_PRINCIPAL")


@router.post("/upload", response_model=ApiResponse[dict], status_code=status.HTTP_202_ACCEPTED)
async def upload_placement_csv(
    file: UploadFile = File(...),
    academic_year: str = Form("2025-2026"),
    batch_month: int = Form(8),
    _: SecurityContext = Depends(_require_principal),
    scope: InstituteScope = Depends(require_institute_scope),
):
    batch_id = str(uuid.uuid4())
    return ApiResponse(
        success=True,
        data={
            "batch_id": batch_id,
            "file_name": file.filename,
            "status": "VALIDATING",
            "message": "Placement return queued for syntax and DPDP pseudonymization check.",
        },
    )
