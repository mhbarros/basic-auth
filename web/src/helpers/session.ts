import Api from '../services/Api';

export async function getServerSideProps(ctx){
    let response = await Api.get('/login');
    if(response.data.ok){
        ctx.res.setHeader('location', '/dashboard');
        ctx.res.statusCode = 302;
        ctx.res.end();
    }

    return {props:{}};
}