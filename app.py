from flask import Flask, render_template,jsonify
import json
from sqlalchemy import create_engine
import psycopg2 

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

engine = create_engine('postgresql://postgres:1234@localhost:5432/peliculas_db')

pelis = ["The Pianist", "Adrien Brody", "Leonardo DiCaprio", "Inception", "Roman Polansky"]
actores = ["Leonardo", "Angie", "Jorge", "Mioguel"]
directores = ["Juanita", "Lolita"]

@app.route("/")
def home():
    return render_template("dashboard.html")

@app.route("/api/movies/<search>", methods = ["POST"])
def info(search):
    try:
        connection = psycopg2.connect(
        database='peliculas_db',
        user='postgres',
        host='localhost',
        password='1234'
        )

        flag = searchInArrays(search)
        query = ""

        if flag == 1:
            query = "SELECT * FROM movie_data WHERE Title LIKE '%The Pianist%'"
        if flag == 2:
            query  = "SELECT COUNT(Title) AS Movie, AVG(imdbrating) AS imdbR, AVG(Metascore) AS Mscore, to_char(SUM(worldwide), '$999,999,999,999') AS WW, mode() WITHIN GROUP (ORDER BY rated) AS modal_value, mode() WITHIN GROUP (ORDER BY genre) AS genreV, mode() WITHIN GROUP (ORDER BY production) AS prodV, AVG(Runtime) AS RunT FROM movie_data WHERE Director LIKE '%{search}%'"
        if flag == 3:
            query = f'''SELECT COUNT(title) AS Movie, AVG(imdbrating) AS imdbRating, AVG(Metascore) AS Metascore, to_char(SUM(worldwide), '$999,999,999,999') AS BoxOffice, mode() WITHIN GROUP (ORDER BY rated) AS Rated, mode() WITHIN GROUP (ORDER BY genre) AS Genre, mode() WITHIN GROUP (ORDER BY production) AS Production, AVG(Runtime) AS RunTime
            FROM movie_data
            WHERE Actors LIKE '%{search}%'
            '''
        print(query)

        cursor = connection.cursor()
    #      postgreSQL_select_Query = 'SELECT * FROM movie_data'
        cursor.execute(query)
        resultado = cursor.fetchall()

        for x in resultado:
            print(x)

        # COMO VOY A SABER SI ME SEARCH ES IGUAL A PELICULA O ACTOR O DIRECTOR??

        # SE ME OCURRE JUNTAR LOS RESULTADOS DE LOS 3 QUERIES...Y YA

    # CON ESE RESULTADO LO MANDO A TEMPLATE 
        # RESULTADO = PELIS, DIRECTOR, ACTOR

    except (Exception, psycopg2.Error) as error :
        print ('Error while fetching data from PostgreSQL', error)
        #return render_template("dashboard.html", pelis = pelis)
        #return render_template("dashboard.html", resultado=resultado)
    return jsonify({
        "resultado": resultado
    })

@app.route("/api/list/<genres>")
def genre():
    try:
        connection = psycopg2.connect(
        database='peliculas_db',
        user='postgres',
        host='localhost',
        password='1234')

        query=""

        '''SELECT Title, Genre FROM movie_data
        WHERE Genre LIKE '%Action%'''
            
    except (Exception, psycopg2.Error) as error :
        print ('Error while fetching data from PostgreSQL', error)
        #return render_template("dashboard.html", pelis = pelis)
        #return render_template("dashboard.html", resultado=resultado)
    return jsonify({
        "resultado": resultado
    })

@app.route("/api/random/<descriptions>")
def descript():
    try:
        connection = psycopg2.connect(
        database='peliculas_db',
        user='postgres',
        host='localhost',
        password='1234')

        query=""

        '''SELECT Title AS Movie, to_char(worldwide, '$999,999,999,999') AS BoxOffice, Metascore AS Metascore, Genre AS Genre, Plot as Plot, Runtime AS Runtime FROM movie_data WHERE Title LIKE '%Avatar%''''
            
    except (Exception, psycopg2.Error) as error :
        print ('Error while fetching data from PostgreSQL', error)
        #return render_template("dashboard.html", pelis = pelis)
        #return render_template("dashboard.html", resultado=resultado)
    return jsonify({
        "resultado": resultado
    })

        
########################################################################################
# ENDPOINT to get random movie lists  

########################################################################################
#ENDPOINT that filters data for movies and give all teh information about it.

###########################################################################################

################################################# POST method example

#@app.route("/auto2", methods = ["POST"])
#def auto2():
    #Lo que nos llega es un json
 #   miJSON = request.json

  #  keyWord = miJSON["searchString"]










   # miJSON = jsonify({
    #    "peliculas":[]
    #})

    #return miJSON



################################################# POST method example
 
def searchInArrays(string):
    if string in pelis:
        return 1
    if string in actores:
        return 2
    if string in directores:
        return 3

if __name__ == "__main__":
    app.run(debug = True)