const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDB} = require('./fixtures/db')

beforeEach(setupDB)

test('Should signup new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Aiza',
        email: 'ayu@example.com',
        password: 'aiza123'
    }).expect(201)

    // assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // asseetions about the response
    expect(response.body).toMatchObject({
        user: { 
            name: 'Aiza',
            email: 'ayu@example.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('aiza123')

})

test('Sould login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})

test('Sould not login non-existent user', async () => {
    await request(app)
    .post('/users/login')
    .send({
        email: 'none@example.com',
        password: 'pword23'
    })
    .expect(400)
})

test('Should get profile for User', async () => {
    await request(app)
    .get('/users/profile')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated User', async () => {
    await request(app)
    .get('/users/profile')
    .send()
    .expect(401)
})

test('Should delete profile for User', async () => {
    await request(app)
    .delete('/users/profile')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete profile for unauthenticated User', async () => {
    await request(app)
    .delete('/users/profile')
    .send()
    .expect(401)
})

test('Should upload image', async () => {
    await request(app)
        .post('/users/profile/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Roger'
        })
        .expect(200)
    
        const user = await User.findById(userOneId)
        expect(user.name).toEqual('Roger')

})

test('Should update invalid user fields', async () => {
    await request(app)
        .patch('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'India'
        })
        .expect(400)
})