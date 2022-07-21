import knexfile from "../config/pg";

const knex: any = knexfile.connect();

export default knex;
