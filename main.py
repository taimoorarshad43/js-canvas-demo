from flask import Flask, render_template, request, redirect, url_for
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Create or connect to SQLite database
conn = sqlite3.connect('users.db')
c = conn.cursor()

# Create users table if not exists
c.execute('''CREATE TABLE IF NOT EXISTS users (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             username TEXT NOT NULL UNIQUE,
             password TEXT NOT NULL)''')
conn.commit()

# Close the connection
conn.close()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # Hash the password before storing in the database
        hashed_password = generate_password_hash(password)

        # Connect to SQLite database
        conn = sqlite3.connect('users.db')
        c = conn.cursor()

        try:
            # Insert user into the database
            c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
            conn.commit()
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            return render_template('signup.html', error="Username already exists")

        # Close the connection
        conn.close()
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Connect to SQLite database
        conn = sqlite3.connect('users.db')
        c = conn.cursor()

        # Retrieve user from the database
        c.execute("SELECT * FROM users WHERE username=?", (username,))
        user = c.fetchone()

        if user and check_password_hash(user[2], password):
            return redirect(url_for('game'))
        else:
            return render_template('login.html', error="Invalid username or password")

        # Close the connection
        conn.close()
    return render_template('login.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/users')
def getUsers():
    #Get users from DB
    #Create connection to DB

    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    c.execute("SELECT username FROM users")

    users = c.fetchall()

    #Close the connection
    conn.close()

    print(users)

    return users



if __name__ == '__main__':
    app.run(debug=True)
