from google.appengine.ext import db
from handlers.blog import BlogHandler
from helpers import *
from models.post import Post


class NewPostHandler(BlogHandler):
    def get(self):
        if self.user:
            self.render("newpost.html")
        else:
            access_error = 'You must be signed in to create a post.'
            self.redirect("/login", access_error=access_error)

    def post(self):
        if not self.user:
            return self.redirect('/login')

        subject = self.request.get('subject')
        content = self.request.get('content')

        if subject and content:
            p = Post(parent=blog_key(), subject=subject, content=content, user_id=self.user.key().id())
            p.put()

            self.redirect('/%s' % str(p.key().id()))
        else:
            error = "subject and content, please!"
            self.render("newpost.html", subject=subject, content=content, error=error)
