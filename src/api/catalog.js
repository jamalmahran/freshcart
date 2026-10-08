import axios from 'axios'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

// The API never returns more than 50 items per request, even with limit=100.
// So: get page 1, read numberOfPages, fetch the other pages at the same time,
// and join everything into one array.
export async function fetchAll(resource) {
  const first = await axios.get(`${API_BASE}/${resource}`, { params: { limit: 50, page: 1 } })
  const totalPages = first.data.metadata?.numberOfPages || 1

  const otherPages = []
  for (let page = 2; page <= totalPages; page++) {
    otherPages.push(axios.get(`${API_BASE}/${resource}`, { params: { limit: 50, page } }))
  }
  const responses = await Promise.all(otherPages)

  return responses.reduce(function (all, response) {
    return all.concat(response.data.data)
  }, first.data.data)
}
