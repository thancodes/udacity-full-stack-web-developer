import webbrowser


class Movie:
    """Movie are documented in the same way as classes, and represents a movie.

    The __init__ method may be documented in either the class level
    docstring, or as a docstring on the __init__ method itself.

    Note:
        Do not include the `self` parameter in the ``Args`` section.

    Args:
        movie_title (str): Movie Title.
        movie_storyline (str): Movie description or movie plot.
        poster_image (str): Poster image url.
        trailer_youtube (str): Youtube video trailer url.

    Attributes:
        title (str): Movie Title.
        storyline (str): Movie description or movie plot.
        poster_image_url (str): Poster image url.
        trailer_youtube_url (str): Youtube video trailer url.
    """

    def __init__(self, movie_title, movie_storyline, poster_image,
                 trailer_youtube):
        self.title = movie_title
        self.storyline = movie_storyline
        self.poster_image_url = poster_image
        self.trailer_youtube_url = trailer_youtube

    def show_trailer(self):
        """
        This method for open web browser for show youtube trailer
        """
        webbrowser.open(self.trailer_youtube)
