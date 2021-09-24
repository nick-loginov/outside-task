import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
import * as fs from 'fs';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {}

export async function down(pgm: MigrationBuilder): Promise<void> {}
