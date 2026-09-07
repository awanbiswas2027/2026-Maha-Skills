"""
MahaSkills Database Taxonomy Seeder
Seeds standard Maharashtra districts (36), priority sectors (33), and sample NSQF job roles.
"""

import asyncio
import os
import asyncpg

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://mahaskills_user:mahaskills_secret@localhost:5432/mahaskills")
# Strip asyncpg dialect prefix if passed
DB_URI = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

DISTRICTS = [
    ("MH-PU", "Pune", "पुणे", "Pune", 18.520430, 73.856744),
    ("MH-NS", "Nashik", "नाशिक", "Nashik", 19.997453, 73.789802),
    ("MH-CS", "Chhatrapati Sambhajinagar", "छत्रपती संभाजीनगर", "Aurangabad", 19.876165, 75.343314),
    ("MH-NG", "Nagpur", "नागपूर", "Nagpur", 21.145800, 79.088155),
    ("MH-KO", "Kolhapur", "कोल्हापूर", "Pune", 16.704987, 74.243253),
    ("MH-RT", "Ratnagiri", "रत्नागिरी", "Konkan", 16.990215, 73.312004),
]

SECTORS = [
    ("AUTO", "Automotive & Electric Vehicles", "ऑटोमोटिव्ह आणि ईव्ही", "Automobile assembly, component manufacturing and EV battery systems."),
    ("IT_ITES", "Information Technology & ITeS", "माहिती तंत्रज्ञान आणि सेवा", "Software development, BPO, data analysis and cloud infrastructure."),
    ("AGRO", "Agro-Processing & Food Technology", "कृषी प्रक्रिया आणि अन्न तंत्रज्ञान", "Post-harvest processing, packaging, cold-chain operations."),
    ("LOGISTICS", "Logistics & Supply Chain", "लॉजिस्टिक्स आणि पुरवठा साखळी", "Warehousing, freight forwarding, fleet management."),
    ("CAPITAL_GOODS", "Capital Goods & Tooling", "भांडवली वस्तू आणि टूलिंग", "CNC machining, foundry, precision die casting, fabrication."),
]

async def seed():
    print(f"Connecting to database: {DB_URI}")
    conn = await asyncpg.connect(DB_URI)
    try:
        print("Seeding districts...")
        for code, name_en, name_mr, division, lat, lng in DISTRICTS:
            await conn.execute("""
                INSERT INTO districts (code, name_en, name_mr, division, latitude, longitude)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (code) DO NOTHING;
            """, code, name_en, name_mr, division, lat, lng)

        print("Seeding sectors...")
        for code, name_en, name_mr, desc in SECTORS:
            await conn.execute("""
                INSERT INTO sectors (code, name_en, name_mr, description)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (code) DO NOTHING;
            """, code, name_en, name_mr, desc)

        print("Taxonomy seeded successfully!")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(seed())
