import Papa from 'papaparse'

export default async function readCSV(path){
  const response = await fetch(path);
  const reader = response.body.getReader();
  const result = await reader.read(); // raw array
  const decoder = new TextDecoder('utf-8');
  const csv = decoder.decode(result.value); // the csv text
  const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
  return results.data; // return the rows, an array of objects
}