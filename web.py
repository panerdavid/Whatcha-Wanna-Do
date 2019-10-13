from flask import Flask, request, render_template
import json

app = Flask(__name__)

@app.route('/form-example', methods=['GET', 'POST']) #allow both GET and POST requests
def form_example():
    if request.method == 'POST':
        return;
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
