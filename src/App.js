import React, { useState, useEffect } from "react"
import { movieApiRequests } from "./api"

function App() {
  const [movieDatas, setMovieDatas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetchMoviDatas = async () => {
    try {
      const {
        data: {
          data: { movies: movieDatas }
        }
      } = await movieApiRequests.getMovies()
      setMovieDatas(movieDatas)
      console.log(movieDatas)
    } catch {
      setError("Error: Can't get movie datas")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchMoviDatas()
  }, [])
  return error ? (
    <span>{error}</span>
  ) : loading ? (
    <span>Loading...</span>
  ) : (
    <div>
      {movieDatas.map(movie => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  )
}

export default App
