import test, { expect } from "@playwright/test";
import {signUpUser} from '../../../utils/api/authApi';


test('POST /users/login should login an existing user successfully', async ({request}) => {


    const password = 'TestPassword123!';
    const user = await signUpUser({password});

    const response = await request.post('users/login',{
        data: {
            user:{
                email: user.email,
                password
            }
        }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(user.email);
    expect(body.user.username).toBe(user.username);
    expect(body.user.token).toBeTruthy();
    expect(body.user.bio).toBeNull();
    expect(body.user.image).toBeNull();
});