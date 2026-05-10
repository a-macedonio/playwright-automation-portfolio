import test, { expect } from "@playwright/test";
import {signUpUser} from '../../../utils/api/authApi';


test('POST /users/login should login an existing user successfully', async ({request}) => {

     
    const uniqueId = Date.now();
    const username = `testuser_${uniqueId}`;
    const email = `testuser_${uniqueId}@mail.com`;
    const password = 'Password123!';

    await signUpUser(email,password,username);

    const response = await request.post('users/login',{
        data: {
            user:{
                email:email,
                password:password
            }
        }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(email);
    expect(body.user.username).toBe(username);
    expect(body.user.token).toBeTruthy();
    expect(body.user.bio).toBeNull();
    expect(body.user.image).toBeNull();
});