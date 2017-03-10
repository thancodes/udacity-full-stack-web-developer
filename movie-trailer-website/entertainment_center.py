import media
import fresh_tomatoes

"""
Create new movie object to 3 variables is the_social_network, steve_jobs, benjamin_button
"""
the_social_network = media.Movie('The Social Network',
                                 'Harvard student Mark Zuckerberg creates the social networking site that would '
                                 'become known as Facebook, but is later sued by two brothers who claimed he stole '
                                 'their idea, and the co-founder who was later squeezed out of the business.',
                                 'https://upload.wikimedia.org/wikipedia/en/7/7a/Social_network_film_poster.jpg',
                                 'https://www.youtube.com/watch?v=lB95KLmpLR4')

steve_jobs = media.Movie('Steve Jobs',
                         'Steve Jobs takes us behind the scenes of the digital revolution, to paint a portrait of the '
                         'man at its epicenter. The story unfolds backstage at three iconic product launches, '
                         'ending in 1998 with the unveiling of the iMac.',
                         'https://upload.wikimedia.org/wikipedia/en/a/aa/SteveJobsposter.jpg',
                         'https://www.youtube.com/watch?v=aEr6K1bwIVs')

benjamin_button = media.Movie('The Curious Case of Benjamin Button',
                              'Tells the story of Benjamin Button, a man who starts aging backwards with bizarre consequences.',
                              'https://upload.wikimedia.org/wikipedia/en/7/7c/The_Curious_Case_of_Benjamin_Button_%28film%29.png',
                              'https://www.youtube.com/watch?v=rAYtpZgelAM')

"""
Main subroutine for generate movie page
Add 3 variables to movies array for generate
"""
movies = [the_social_network, steve_jobs, benjamin_button]
fresh_tomatoes.open_movies_page(movies)
