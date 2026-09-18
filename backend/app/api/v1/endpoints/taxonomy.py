from fastapi import APIRouter

from ....schemas.common import ApiResponse

router = APIRouter()


@router.get("/tree", response_model=ApiResponse[list])
async def get_taxonomy_tree():
    tree = [
        {
            "sector_id": 3,
            "name_en": "Automotive & Electric Vehicles",
            "name_mr": "ऑटोमोटिव्ह आणि ईव्ही",
            "sscs": [
                {
                    "ssc_id": 5,
                    "name": "Automotive Skills Development Council (ASDC)",
                    "job_roles": [
                        {
                            "id": "a3b89012-4819-412b-8910-128938192019",
                            "qp_code": "ASC/Q1402",
                            "title_en": "Automotive EV Battery Technician",
                            "nsqf_level": 4,
                        }
                    ],
                }
            ],
        }
    ]
    return ApiResponse(success=True, data=tree)
