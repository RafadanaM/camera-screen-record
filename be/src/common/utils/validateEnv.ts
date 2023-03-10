import { cleanEnv, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    PORT: str(),
    NODE_ENV: str(),
    ORIGIN: str(),
  });
}

export default validateEnv;
