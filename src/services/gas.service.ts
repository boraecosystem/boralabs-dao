import axios, { type AxiosInstance } from 'axios';

export default class GasService {
  private $api: AxiosInstance;

  constructor() {
    this.$api = axios.create({
      baseURL: `${import.meta.env.VITE_BORALABS_API_URL}`
    });
  }

  async supportGas(address: string) {
    try {
      await this.$api.get(`/bgas/${address}`);
    } catch (e) {
      console.error('Already received gas fee', { e });
    }
  }
}
