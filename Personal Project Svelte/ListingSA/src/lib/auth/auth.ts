import jwt_decode from 'jwt-decode';



 let loggedIn: boolean = false;

export async function isLoggedIn(): Promise<boolean> {
  const token = localStorage.getItem('token');
  return token !== null && !isTokenExpired(token);
}

export async function logout() {
  localStorage.removeItem('token');
  loggedIn = false;
}

interface JwtPayload {
  exp: number; 
}

export function isTokenExpired(token: string): boolean {
  const payload: JwtPayload = jwt_decode(token);
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}



