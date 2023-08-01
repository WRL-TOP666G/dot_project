const app = require('../../app');
const request = require('supertest');

describe('GET', ()=>{
    it('returns status code 200 if collection and id is in DB', async() =>{
        const res = await request('http://localhost:8080')
            .get('/test_task/3')
            .expect(200)
        expect(await res.status).toEqual(200);
        expect(await res.body[0].content).toEqual('Paint the wall');
        expect(await res.body[0].assignee_id).toEqual(2);
        expect(await res._body[0].status).toEqual('Complete');
    })

    it('returns status code 404 if id is not in DB', async() =>{
        const res = await request('http://localhost:8080')
            .get('/test_task/999')
            .expect(404);
        expect(await res.status).toEqual(404);

    })
});


describe('POST', ()=>{
    // The similar logic as 'GET' 
});

describe('DELETE', ()=>{
    // The similar logic as 'GET' 
});