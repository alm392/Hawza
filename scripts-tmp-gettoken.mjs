import pkg from '@next/env';
import { createHash } from 'crypto';

const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

const token = createHash('sha256')
  .update(`hawza-student:${process.env.STUDENT_PASS}`)
  .digest('hex');

console.log(token);
