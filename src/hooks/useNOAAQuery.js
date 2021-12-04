import axios from 'axios';
import { useQuery } from 'react-query';

export const fetchNOAAQuery = (noaaQueryString) => axios.get(noaaQueryString).then((res) => res.data);

export default function useNOAAQuery(noaaQuery) {
  return useQuery([noaaQuery.getURL()], fetchNOAAQuery)
}
