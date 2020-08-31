import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import Routes from './routes';

dotenv.config();
const app = express();

if(!process.env.PORT){
    console.log('Variáveis de ambiente não configuradas.');
    process.exit(1);
}

app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(session({secret: 'abc', saveUninitialized: true, resave: false, cookie: {maxAge: 900000}}));
app.use((req, res, next) => {
    if(req.session){
        req.session.touch();
    }
    next();
});
app.use(Routes);

app.listen(process.env.PORT);