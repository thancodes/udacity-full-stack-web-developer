# Tournament Planner
Clone this repo to your desktop, go to its `tournament-planner` directory

## Launch the Vagrant
```bash
$ vagrant up
$ vagrant ssh
```
## Enter to Tournament Planner
```bash
$ cd /
$ cd vagrant
$ cd tournament
```

## Initialize the database
```bash
$ psql
vagrant=> \i tournament.sql
vagrant=> \q
```

## Run the test
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

## Shutdown Vagrant
```bash
$ vagrant halt
```

## Destroy Vagrant
```bash
$ vagrant destroy
```
