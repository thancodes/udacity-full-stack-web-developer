# Imports
from webapp2 import WSGIApplication

# Handlers
from handlers.blogfront import BlogFrontHandler
from handlers.register import RegisterHandler
from handlers.login import LoginHandler
from handlers.logout import LogoutHandler
from handlers.newpost import NewPostHandler
from handlers.post import PostHandler
from handlers.likepost import LikePostHandler
from handlers.unlikepost import UnlikePostHandler
from handlers.editpost import EditPostHandler
from handlers.deletepost import DeletePostHandler
from handlers.addcomment import AddCommentHandler
from handlers.editcomment import EditCommentHandler
from handlers.deletecomment import DeleteCommentHandler

# Routing
app = WSGIApplication([
    ('/', BlogFrontHandler),
    ('/signup', RegisterHandler),
    ('/login', LoginHandler),
    ('/logout', LogoutHandler),
    ('/newpost', NewPostHandler),
    ('/([0-9]+)', PostHandler),
    ('/([0-9]+)/like', LikePostHandler),
    ('/([0-9]+)/unlike', UnlikePostHandler),
    ('/([0-9]+)/edit', EditPostHandler),
    ('/([0-9]+)/delete/([0-9]+)', DeletePostHandler),
    ('/([0-9]+)/addcomment/([0-9]+)', AddCommentHandler),
    ('/([0-9]+)/([0-9]+)/editcomment/([0-9]+)', EditCommentHandler),
    ('/([0-9]+)/([0-9]+)/deletecomment/([0-9]+)', DeleteCommentHandler),
], debug=True)
