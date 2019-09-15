import axios from "axios"

const movieApi = axios.create({
  baseURL: "https://yts.lt/api/v2"
})

export const movieApiRequests = {
  getMovies: (page = 1) => movieApi.get("/list_movies.json", { params: { page, limit: 20 } })
}
