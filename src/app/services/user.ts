import http from './http';

export const login = async (username: any, password: any) => {
  const response = await http.post('/login', {
    email:username,
    password
  });
  return response;
}

export const search = async (keyword: any) => {
  const response = await http.get('/user', {
    params: {
      keyword,
      limit: 10,
    }
  });
  return response.data.payload;
}

export const checkEmail = async (email: any) => {
  const response = await http.get('/user/check-email-exists', {
    params: {
      email,
    }
  });
  return response.data.payload;
}

