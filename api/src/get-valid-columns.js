import knex from "./database_client.js";

export async function getValidColumns(tableName) {
  try {
    const validColumns = await knex(tableName).columnInfo();
    return Object.keys(validColumns);
  } catch (error) {
    console.error({ error: `Error fetching columns for ${tableName}` });
    throw error;
  }
}
