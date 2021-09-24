import 'dotenv/config';
import { Client, QueryConfig, QueryResult, QueryResultRow } from 'pg';

class DatabaseService {
  private client: Client;

  constructor() {
    this.client = new Client(process.env['DATABASE_URL']);
  }

  public async init() {
    await this.client.connect();
  }

  public async query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: I,
  ): Promise<QueryResult<R>> {
    return await this.client.query(queryTextOrConfig, values);
  }
}

const databaseService = new DatabaseService();
export { databaseService as DatabaseService };
