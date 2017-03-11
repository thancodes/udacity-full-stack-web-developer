# Full Stack Web Developer Nanodegree

## Movie Trailer Website

### Using
Clone this repo to your desktop, go to its `movie-trailer-website` directory and run:
```bash
python entertainment_center.py
```

## Multi User Blog

### Using
Clone this repo to your desktop, go to its `multi-user-blog` directory and run:
```bash
dev_appserver.py .
```

Or you could try out the app here:

[Tawatchai Blog](http://tawatchair-blog.appspot.com/)

## Tournament Planner
Clone this repo to your desktop, go to its `tournament-planner` directory.

### Launch the Vagrant
```bash
$ vagrant up
$ vagrant ssh
```
### Enter to Tournament Planner
```bash
$ cd /
$ cd vagrant
$ cd tournament
```

### Initialize the database
```bash
$ psql
vagrant=> \i tournament.sql
vagrant=> \q
```

### Run the test
```bash
$ python tournament_test.py
```

You should see these results:
```
1. countPlayers() returns 0 after initial deletePlayers() execution.
2. countPlayers() returns 1 after one player is registered.
3. countPlayers() returns 2 after two players are registered.
4. countPlayers() returns zero after registered players are deleted.
5. Player records successfully deleted.
6. Newly registered players appear in the standings with no matches.
7. After a match, players have updated standings.
8. After match deletion, player standings are properly reset.
9. Matches are properly deleted.
10. After one match, players with one win are properly paired.
Success!  All tests pass!
```

### Shutdown Vagrant
```bash
$ vagrant halt
```

### Destroy Vagrant
```bash
$ vagrant destroy
```

## Item Catalog
Clone this repo to your desktop, go to its `item-catalog/vagrant/catalog` directory.

### Using

Create the database
```bash
$ python database_setup.py
```

Database seeding
```bash
$ python db_seed.py
```

Run the app
```bash
$ python application.py
```

Access and test application, Navigate to
```
http://localhost:8000
```
