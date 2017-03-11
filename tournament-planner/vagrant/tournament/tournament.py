#!/usr/bin/env python
# 
# tournament.py -- implementation of a Swiss-system tournament
#

import psycopg2


def connect(database_name="tournament"):
    """Connect to the PostgreSQL database.  Returns a database connection."""
    return psycopg2.connect("dbname=" + database_name)


def commitExecute(query):
    conn = connect()
    db_cursor = conn.cursor()
    db_cursor.execute(query)
    conn.commit()
    conn.close()


def deleteMatches():
    """Remove all the match records from the database."""
    query = "DELETE FROM matches;"
    commitExecute(query)


def deletePlayers():
    """Remove all the player records from the database."""
    query = "DELETE FROM players;"
    commitExecute(query)


def countPlayers():
    """Returns the number of players currently registered."""
    db = connect()
    db_cursor = db.cursor()
    query = "SELECT COUNT(id) AS num FROM players"
    db_cursor.execute(query)
    results = db_cursor.fetchone()
    db.close()
    if results:
        return results[0]
    else:
        return '0'


def registerPlayer(name):
    """Adds a player to the tournament database.
  
    The database assigns a unique serial id number for the player.  (This
    should be handled by your SQL database schema, not in your Python code.)
  
    Args:
      name: the player's full name (need not be unique).
    """
    query = "INSERT INTO players (name) VALUES(%s)"
    commitExecute(query)


def playerStandings():
    """Returns a list of the players and their win records, sorted by wins.

    The first entry in the list should be the player in first place, or a player
    tied for first place if there is currently a tie.

    Returns:
      A list of tuples, each of which contains (id, name, wins, matches):
        id: the player's unique id (assigned by the database)
        name: the player's full name (as registered)
        wins: the number of matches the player has won
        matches: the number of matches the player has played
    """
    wins_losses = """
      SELECT players.id, NAME, COUNT(matches.id) AS {sortBy}
        FROM players LEFT JOIN matches ON players.id = {prefix}_id
        GROUP BY players.id ORDER BY {sortBy} DESC
    """
    wins = wins_losses.format(prefix='winner', sortBy='wins')
    losses = wins_losses.format(prefix='loser', sortBy='losses')

    query = """
    SELECT winners.id, winners.name, wins, wins + losses AS matches
        FROM ({wins}) AS winners LEFT JOIN ({losses}) AS losers
            ON winners.id = losers.id;
    """.format(wins=wins, losses=losses)

    db = connect()
    db_cursor = db.cursor()
    db_cursor.execute(query)
    results = db_cursor.fetchall()
    db.close()
    return results


def reportMatch(winner, loser):
    """Records the outcome of a single match between two players.

    Args:
      winner:  the id number of the player who won
      loser:  the id number of the player who lost
    """
    query = """
    INSERT INTO matches (winner_id, loser_id)
    VALUES ({winner_id}, {loser_id})
    """.format(winner_id=winner, loser_id=loser)
    commitExecute(query)


def swissPairings():
    """Returns a list of pairs of players for the next round of a match.
  
    Assuming that there are an even number of players registered, each player
    appears exactly once in the pairings.  Each player is paired with another
    player with an equal or nearly-equal win record, that is, a player adjacent
    to him or her in the standings.
  
    Returns:
      A list of tuples, each of which contains (id1, name1, id2, name2)
        id1: the first player's unique id
        name1: the first player's name
        id2: the second player's unique id
        name2: the second player's name
    """
    results = []
    players = playerStandings()
    for i in range(0, len(players), 2):
        results.append(
            (players[i][0], players[i][1],
             players[i + 1][0], players[i + 1][1])
        )
    return results
