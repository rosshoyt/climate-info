//import axios from 'axios';
import { useQueries } from 'react-query';
import { fetchNOAAQuery } from './useNOAAQuery';


export default function useNOAAQueries(noaaQueryList) {
  return useQueries(
    noaaQueryList.map(nq => {
      return {
        queryKey: [nq.getURL()],
        queryFn: () => fetchNOAAQuery(nq.getURL()),
      }
    })
  )
}