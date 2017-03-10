/* Drop the database tournament  if exists */
DROP DATABASE IF EXISTS tournament;

/* Create the database tournament */
CREATE DATABASE tournament;

/* Connect to the database tournament */
\c tournament;

/* Create the players table  */
CREATE TABLE players  ( id SERIAL PRIMARY KEY,
                        name VARCHAR (25) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

/* Create the matches table  */
CREATE TABLE matches  ( id SERIAL PRIMARY KEY,
                        winner_id INT REFERENCES players(id),
                        loser_id INT REFERENCES players(id) ,
                        FOREIGN KEY (winner_id) REFERENCES players(id),
                        FOREIGN KEY (loser_id) REFERENCES players(id) );
