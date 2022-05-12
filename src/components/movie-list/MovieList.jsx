import React, { useEffect, useState } from "react";
import "./movieList.scss";
import { SwiperSlide, Swiper } from "swiper/react";
import Button from "../button/Button";
import tmdbApi, { category } from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";
import MovieCard from "../movie-card/MovieCard";

const MovieList = (props) => {
  const [items, setItems] = useState([]);
  const getList = async () => {
    let response = null;
    const params = {};
    if (props.type !== "similar") {
      switch (props.category) {
        case category.movie:
          response = await tmdbApi.getMovieList(props.type, { params });
          break;
        default:
          response = await tmdbApi.getTvList(props.type, { params });
      }
    } else {
      response = await tmdbApi.similar(props.category, props.id, { params });
    }
    setItems(response.results);
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="movie-list">
      <Swiper grabCursor={true} spaceBetween={10} slidesPerView={"auto"}>
        {items.map((item, i) => (
          <SwiperSlide key={i}>
            <MovieCard item={item} category={props.category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieList;
