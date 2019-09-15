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

const useScrolledOffset = () => {
  const [offsetY, setOffsetY] = useState(window.scrollY + window.innerHeight)
  useEffect(() => {
    const scrollHandler = () => {
      setOffsetY(window.scrollY + window.innerHeight)
    }
    window.addEventListener("scroll", scrollHandler)
    return () => window.removeEventListener("scroll", scrollHandler)
  }, [])
  return offsetY
}

function App() {
  const [movieDatas, setMovieDatas] = useState([])
  const [fetchedMovieDatas, setFetchedMovieDatags] = useState(null)
  const [movieDataPageNum, setMovieDataPageNum] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [contentSmallThanWindow, setContentSmallThanWindow] = useState(null)
  const [rect, ref] = useClientRect(loading)
  const offsetY = useScrolledOffset()
  const fetchMoviDatas = async page => {
    try {
      setLoading(true)
      const {
        data: {
          data: { movies: fetchedMovieDatas }
        }
      } = await movieApiRequests.getMovies(page)
      setFetchedMovieDatags(fetchedMovieDatas)
    } catch {
      setError("Error: Can't get movie datas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMoviDatas(movieDataPageNum)
  }, [movieDataPageNum])

  useEffect(() => {
    if (fetchedMovieDatas !== null) {
      setMovieDatas(movieDatas.concat(fetchedMovieDatas))
    }
  }, [fetchedMovieDatas])

  useEffect(() => {
    const windowResizeHandler = () => {
      setWindowHeight(window.innerHeight)
    }
    window.addEventListener("resize", windowResizeHandler)
    return () => window.removeEventListener("resize" > windowResizeHandler)
  }, [])

  useEffect(() => {
    if (loading) {
      return
    }
    if (rect !== null && !loading) {
      if (contentSmallThanWindow) {
        setMovieDataPageNum(movieDataPageNum + 1)
        console.log("movieDataPageNum:", movieDataPageNum)
      }
    }
  }, [contentSmallThanWindow, rect])

  useEffect(() => {
    if (rect !== null && !loading) {
      setContentSmallThanWindow(rect.height <= windowHeight)
      console.log(contentSmallThanWindow)
    }
  }, [windowHeight, rect])

  useEffect(() => {
    if (rect === null) {
      return
    }
    if (offsetY >= rect.height) {
      setMovieDataPageNum(movieDataPageNum + 1)
    }
  }, [offsetY])
  return (
    <div ref={ref}>
      {rect !== null && <div>{`컨텐츠의 길이는 ${rect.height}px`}</div>}
      {windowHeight !== null && <div>{`window.innerHeight: ${windowHeight}px`}</div>}
      {error ? (
        <span>{error}</span>
      ) : (
        <div>
          {movieDatas.map((movie, idx) => (
            <div key={idx}>{movie.title}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
