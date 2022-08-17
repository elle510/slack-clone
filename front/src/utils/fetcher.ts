import axios from 'axios';

const fetcher = async <T>(url: string): Promise<T> =>
  await axios.get(url, { withCredentials: true }).then((response) => response.data);

export default fetcher;
