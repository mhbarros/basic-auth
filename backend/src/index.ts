import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import Routes from './routes';

dotenv.config();
const app = express();

if(!process.env.PORT){
    console.log('Variáveis de ambiente não configuradas.');
    process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(Routes);

app.listen(process.env.PORT);