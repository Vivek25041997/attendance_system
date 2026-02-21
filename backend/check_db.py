from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text('DESCRIBE attendance'))
    for row in result:
        print(dict(row._mapping))
