import axios from 'axios';

const baseApi: string = 'https://angelic-appreciation-production.up.railway.app/api/v1';

export const authUser = (rut: string, clave: string): Promise<any> => {
  return axios.post(`${baseApi}/usuario/autenticar`, {
    rutUsuario: rut,
    clave: clave
  });
}

export const getPendingByDepartment = (departmentId: number): Promise<any> => {
  return axios.get(`${baseApi}/gasto-comun/pendientes-por-departamento/${departmentId}`);
};
