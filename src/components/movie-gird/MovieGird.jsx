import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./movieGird.scss";
import MovieCard from "../movie-card/MovieCard";
import Button, { OutlineButton } from "../button/Button";
import Input from "../input/Input";
import tmdbApi, { category, movieType, tvType } from "../../api/tmdbApi";

const MovieGird = (props) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const { keyword } = useParams();

  useEffect(() => {
    const getList = async () => {
      let response = null;
      if (keyword === undefined) {
        const params = {};
        switch (props.category) {
          case category.movie:
            response = await tmdbApi.getMovieList(movieType.upcoming, {
              params,
            });
            break;
          default:
            response = await tmdbApi.getTvList(tvType.popular, { params });
        }
      } else {
        console.log("keyword", keyword);
        const params = {
          query: keyword,
        };
        response = await tmdbApi.search(props.category, { params });
      }
      setItems(response.results);
      setTotalPage(response.total_pages);
    };

    getList();
  }, [props.category, keyword]);

  const loadMore = async () => {
    let response = null;
    if (keyword === undefined) {
      const params = { page: page + 1 };
      switch (props.category) {
        case category.movie:
          response = await tmdbApi.getMovieList(movieType.upcoming, { params });
          break;
        default:
          response = await tmdbApi.getTvList(tvType.popular, { params });
      }
    } else {
      const params = {
        page: page + 1,
        query: keyword,
      };
      response = await tmdbApi.search(props.category, { params });
    }
    setItems([...items, ...response.results]);
    setPage(page + 1);
  };
  return (
    <>
      <div className="section mb-3">
        <MovieSearch category={props.category} keyword={keyword} />
      </div>

      <div className="movie-gird">
        {items.map((item, i) => (
          <MovieCard category={props.category} key={i} item={item} />
        ))}
      </div>

      {page < totalPage ? (
        <div className="movie-gird__loadmore">
          <OutlineButton className="small" onClick={loadMore}>
            Load more
          </OutlineButton>
        </div>
      ) : null}
    </>
  );
};

const MovieSearch = (props) => {
  const history = useHistory();

  const [keyword, setKeyWord] = useState(props.keyword ? props.keyword : "");
  console.log("keyw1", keyword);
  const goToSearch = useCallback(() => {
    if (keyword.trim().length > 0) {
      history.push(
        `/react-movie/${category[props.category]}/search/${keyword}}`
      );
    }
    // setKeyWord("");
  }, [keyword, props.category, history]);

  useEffect(() => {
    const enterEvent = (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        goToSearch();
      }
    };
    document.addEventListener("keyup", enterEvent);
    return () => {
      document.removeEventListener("keyup", enterEvent);
    };
  }, [goToSearch, keyword]);

  return (
    <div className="movie-search">
      <Input
        type="text"
        placeholder="Enter keyword"
        value={keyword}
        onChange={(e) => setKeyWord(e.target.value)}
      />
      <Button className="small" onClick={goToSearch}>
        Search
      </Button>
    </div>
  );
};

export default MovieGird;
