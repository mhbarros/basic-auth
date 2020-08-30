import dotenv from 'dotenv';
import express, {Request, Response} from 'express';

dotenv.config();
const app = express();

if(!process.env.PORT){
    console.log('Variáveis de ambiente não configuradas.');
    process.exit(1);
}

app.use(express.json());
app.get('/', (req: Request, res: Response) => {
    res.json({ok: true});
});
app.listen(process.env.PORT);