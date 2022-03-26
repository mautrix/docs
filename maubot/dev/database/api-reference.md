# Database API reference

You can also view the Sphinx docs for the database at
<https://docs.mau.fi/python/latest/api/mautrix.util/async_db.html>,
but as of writing, they aren't ready yet.

## `Database`

`acquire` is an async context manager that returns a `Connection`:

```python
async with self.database.acquire() as conn:
    conn.execute(...)
```

The class also contains `execute`, `executemany`, `fetch`, `fetchrow`,
`fetchval` and `table_exists` as convenience methods, which simply acquire a
connection and run the single method using it (see reference below).

## `Connection`
Records returned by the fetch methods are either `asyncpg.Record or the stdlib's
`sqlite3.Row`. Both work mostly the same way (can access fields by both
column index and name).

* `execute(query: str, *args: Any) -> str` -
  Execute a query without reading the response:
  ```python
  await conn.execute("INSERT INTO foo (text) VALUES ($1)", "hello world")
  ```
* `executemany(query: str, *args: Any) -> str` -
  Execute a query multiple times:
  ```python
  await conn.execute(
    "INSERT INTO foo (text) VALUES ($1)",
    [("hello world 1",), ("hello world 2",), ("hello world 3",)],
  )
  ```
* `fetch(query: str, *args: Any) -> list[Row | Record]` -
  Execute a query and get a list of rows in response:
  ```python
  rows = await conn.fetch("SELECT text FROM foo")
  for row in rows:
    print(row["text"])
  ```
* `fetchrow(query: str, *args: Any) -> Row | Record | None` -
  Execute a query and get the first rows (or `None`, if there are no rows):
  ```python
  row = await conn.fetchrow("SELECT text FROM foo WHERE test=1")
  if row:
    print("Found", row["text"])
  else:
    print("Row not found :(")
  ```
* `fetchval(query: str, *args: Any, column: int = 0) -> Any` -
  Execute a query and get a single column from the first row (or `None` if there are no rows):
  ```python
  text = await conn.fetchval("SELECT text FROM foo WHERE test=1")
  print(text)
  ```
* `table_exists(name: str) -> bool` - Check if a table exists in the database.
* Postgres only: `copy_records_to_table(table_name: str, *, records: list[tuple[Any, ...]], columns: tuple[str, ...]) -> None` -
  Efficiently insert multiple rows into the database:
  ```python
  await conn.copy_records_to_table(
    table_name="foo",
    records=[("hello world 1",), ("hello world 2",), ("hello world 3",)],
    columns=("text",),
  )
  ```
