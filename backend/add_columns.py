from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    # Add total_hours column
    try:
        conn.execute(text('ALTER TABLE attendance ADD COLUMN total_hours FLOAT'))
        print('Added total_hours column')
    except Exception as e:
        print(f'total_hours column already exists or error: {e}')
    
    # Add overtime_hours column
    try:
        conn.execute(text('ALTER TABLE attendance ADD COLUMN overtime_hours FLOAT'))
        print('Added overtime_hours column')
    except Exception as e:
        print(f'overtime_hours column already exists or error: {e}')
    
    conn.commit()

# Verify the columns
with engine.connect() as conn:
    result = conn.execute(text('DESCRIBE attendance'))
    print('\nUpdated table structure:')
    for row in result:
        print(dict(row._mapping))
