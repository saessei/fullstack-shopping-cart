exports.up = (pgm) => {
  // 1. Create the auth schema and users table (which you already did)
  pgm.createSchema("auth", { ifNotExists: true });
  pgm.createTable(
    { schema: "auth", name: "users" },
    {
      id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
      email: { type: "varchar(255)" },
    },
    { ifNotExists: true }
  );

  // 2. NEW: Create the products table so the cart has something to reference
  pgm.createTable(
    "products",
    {
      id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
      name: { type: "varchar(255)", notNull: true },
      price: { type: "integer", notNull: true },
      created_at: { type: "timestamp", default: pgm.func("now()") }
    },
    { ifNotExists: true }
  );
};

exports.down = (pgm) => {
  pgm.dropTable("products");
  pgm.dropTable({ schema: "auth", name: "users" });
  pgm.dropSchema("auth");
};