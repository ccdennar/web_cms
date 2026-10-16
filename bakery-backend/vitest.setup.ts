import dotenv from 'dotenv'
dotenv.config({ path: 'test.env' })   // test-specific overrides
dotenv.config()                        // fall back to .env