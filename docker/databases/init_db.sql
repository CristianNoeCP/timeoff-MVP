

CREATE TABLE managers (
  id uuid PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)


CREATE TABLE employees (
  id uuid PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  available_vacation_days INTEGER NOT NULL,
  manager_id uuid NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (manager_id) REFERENCES managers(id)
)


CREATE TABLE leave_requests (
  id uuid PRIMARY KEY NOT NULL,
  employee_id uuid NOT NULL,
  status TEXT NOT NULL,
  days_deducted INTEGER NOT NULL,
  manager_id uuid NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (manager_id) REFERENCES managers(id)
);
