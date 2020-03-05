import pickle
import pandas as pd
import numpy as np

datos = pd.read_csv("./Resources/baselimpia.csv")
datos.drop(columns = ['Title'], inplace = True)
X = pd.get_dummies(datos,columns=["Country","Actores","Directores","Production","Rated","Genre"])

x = X[[col for col in X.columns if col!= "Ex_NoEx"]].values
y = X[["Ex_NoEx"]].values

x_prueba = x[0]

print(x_prueba)

pickle_in = open("./Resources/modelProject3","rb")
modeldef = pickle.load(pickle_in)


ynew= modeldef.predict(x_prueba.reshape(1,-1))
print(ynew)

