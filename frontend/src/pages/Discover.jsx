import React from 'react';
import Card from '../components/Card';

export default function Discover() {
  const recommendations = [
    { 
      id: 1,
      title: 'The Shawshank Redemption', 
      year: 1994,
      poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      director: 'Frank Darabont',
      rating: 9.3,
      genres: ['Drama', 'Crime']
    },
    { 
      id: 2,
      title: 'The Dark Knight', 
      year: 2008,
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      director: 'Christopher Nolan',
      rating: 9.0,
      genres: ['Action', 'Crime', 'Drama']
    },
    { 
      id: 3,
      title: 'Pulp Fiction', 
      year: 1994,
      poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      director: 'Quentin Tarantino',
      rating: 8.9,
      genres: ['Crime', 'Drama']
    },
    { 
      id: 4,
      title: 'Forrest Gump', 
      year: 1994,
      poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
      director: 'Robert Zemeckis',
      rating: 8.8,
      genres: ['Drama', 'Romance']
    },
    { 
      id: 5,
      title: 'Fight Club', 
      year: 1999,
      poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      director: 'David Fincher',
      rating: 8.8,
      genres: ['Drama']
    },
    { 
      id: 6,
      title: 'The Godfather', 
      year: 1972,
      poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      director: 'Francis Ford Coppola',
      rating: 9.2,
      genres: ['Crime', 'Drama']
    },
  ];

  return (
    <div className="flex flex-col w-full bg-slate-950 text-slate-50 min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-2">Recommended For You</h2>
        <p className="text-slate-400 mb-8">
          Based on your taste and ratings
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {recommendations.map((movie, index) => (
            <Card 
              key={movie.id} 
              movie={movie} 
              showRating={true}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}