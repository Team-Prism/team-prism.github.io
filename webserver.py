import http.server
import socketserver
import threading
# used for locally testing the website in a way that would work mostly the same as when deployed via github pages

PORT = 81
#Handler = http.server.SimpleHTTPRequestHandler

class Handler(http.server.SimpleHTTPRequestHandler):
    def _getFinalPath(self, path):
        if path.endswith('/'):
            if not path.endswith('.html/'):
                return path + 'index.html'
            else:
                return ''.join(path.split('')[::-1])
        else:
            return path

    def do_GET(self):
        print(self.path)
        if self.path.endswith('/'):
            self.path = self.path + 'index.html'
        elif self.path == '/facicon.ico':
            self.send_response(404)
            return
        else:
            self.path = self._getFinalPath(self.path)
        #elif not self.path.endswith('.html'):
            
        try:
            file_to_open = open(self.path[1:]).read()
            #print(file_to_open)
            self.send_response(200)
        except:
            try:
                file_to_open = open(self.path[1:] + '.html')
                self.send_response(200)
            except:
                file_to_open = open("index.html").read()
                self.send_response(404)
        self.end_headers()
        self.wfile.write(bytes(file_to_open, 'utf-8'))

httpd = socketserver.TCPServer(("", PORT), Handler)
print("serving at port", PORT)
threading.Thread(target=httpd.serve_forever).start()