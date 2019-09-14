import React, { useState, useEffect, useCallback } from "react"
import { movieApiRequests } from "./api"

const useClientRect = loading => {
  const [rect, setRect] = useState(null)
  const ref = useCallback(
    node => {
      if (node !== null) {
        setRect(node.getBoundingClientRect())
      }
    },
    [loading]
  )
  return [rect, ref]
}

function App() {
  const [movieDatas, setMovieDatas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [windowHeight] = useState(window.innerHeight)
  const [rect, ref] = useClientRect(loading)
  const fetchMoviDatas = async () => {
    try {
      const {
        data: {
          data: { movies: movieDatas }
        }
      } = await movieApiRequests.getMovies()
      setMovieDatas(movieDatas)
    } catch {
      setError("Error: Can't get movie datas")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchMoviDatas()
  }, [])
  return (
    <div ref={ref}>
      {rect !== null && <div>{`컨텐츠의 길이는 ${rect.height}px`}</div>}
      {windowHeight !== null && <div>{`window.innerHeight: ${windowHeight}px`}</div>}
      {error ? (
        <span>{error}</span>
      ) : loading ? (
        <span>Loading...</span>
      ) : (
        <div>
          {movieDatas.map(movie => (
            <div key={movie.id}>{movie.title}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
