from google.appengine.ext import db
from handlers.blog import BlogHandler
from helpers import *


class LogoutHandler(BlogHandler):
    def get(self):
        self.logout()
        self.redirect('/')
