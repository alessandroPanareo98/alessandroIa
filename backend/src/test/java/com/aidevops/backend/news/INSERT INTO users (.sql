INSERT INTO users (
    id,
    email,
    password_hash,
    full_name,
    role,
    enabled,
    created_at
  )
VALUES (
    'id:bigint',
    'email:character varying',
    'password_hash:character varying',
    'full_name:character varying',
    'role:character varying',
    enabled:boolean,
    'created_at:timestamp with time zone'
  );